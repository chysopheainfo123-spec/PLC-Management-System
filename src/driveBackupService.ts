import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db');

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  description?: string;
}

/**
 * List backup files in Google Drive
 */
export async function listDriveBackups(googleToken: string): Promise<GoogleDriveFile[]> {
  try {
    const url = 'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
      q: "name contains 'plc_computer_backup' and trashed = false",
      fields: 'files(id, name, mimeType, size, createdTime, description)',
      orderBy: 'createdTime desc'
    });

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${googleToken}`
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Drive API returned error listing files: ${res.status} - ${errText}`);
    }

    const data = await res.json() as { files: GoogleDriveFile[] };
    return data.files || [];
  } catch (error: any) {
    console.error('[DriveBackupService] Error listing backups:', error);
    throw error;
  }
}

/**
 * Upload the current prisma/dev.db file to Google Drive
 */
export async function uploadBackupToDrive(googleToken: string): Promise<GoogleDriveFile> {
  try {
    if (!fs.existsSync(DB_PATH)) {
      throw new Error('Database file dev.db not found on server.');
    }

    const fileBuffer = fs.readFileSync(DB_PATH);
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `plc_computer_backup_${dateStr}.db`;

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const close_delim = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: 'application/vnd.sqlite3',
      description: 'PLC Computer School Database Cloud Backup'
    };

    const multipartRequestBody = Buffer.concat([
      Buffer.from(delimiter),
      Buffer.from('Content-Type: application/json; charset=UTF-8\r\n\r\n'),
      Buffer.from(JSON.stringify(metadata)),
      Buffer.from(delimiter),
      Buffer.from('Content-Type: application/octet-stream\r\n\r\n'),
      fileBuffer,
      Buffer.from(close_delim)
    ]);

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${googleToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': multipartRequestBody.length.toString()
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Drive API returned error uploading backup: ${res.status} - ${errText}`);
    }

    const data = await res.json() as GoogleDriveFile;
    console.log(`[DriveBackupService] Backup uploaded successfully. ID: ${data.id}`);
    return data;
  } catch (error: any) {
    console.error('[DriveBackupService] Error uploading backup:', error);
    throw error;
  }
}

/**
 * Restore the database by downloading a backup from Google Drive
 * and overwriting prisma/dev.db
 */
export async function restoreBackupFromDrive(googleToken: string, fileId: string, prisma: any): Promise<boolean> {
  try {
    // 1. Fetch file info to verify it's our backup file
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const metaRes = await fetch(metaUrl, {
      headers: {
        'Authorization': `Bearer ${googleToken}`
      }
    });

    if (!metaRes.ok) {
      const errText = await metaRes.text();
      throw new Error(`Failed to fetch backup metadata: ${metaRes.status} - ${errText}`);
    }

    const meta = await metaRes.json() as GoogleDriveFile;
    if (!meta.name.startsWith('plc_computer_backup')) {
      throw new Error('Selected file is not a valid PLC Computer database backup file.');
    }

    // 2. Download database file content
    const mediaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const mediaRes = await fetch(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${googleToken}`
      }
    });

    if (!mediaRes.ok) {
      const errText = await mediaRes.text();
      throw new Error(`Failed to download backup content: ${mediaRes.status} - ${errText}`);
    }

    const arrayBuffer = await mediaRes.arrayBuffer();
    const backupBuffer = Buffer.from(arrayBuffer);

    // 3. Gracefully disconnect Prisma before overwriting database file
    console.log('[DriveBackupService] Disconnecting Prisma before database restoration...');
    await prisma.$disconnect();

    // 4. Overwrite dev.db and remove wal/shm temp files to avoid corruption
    const journalPath = `${DB_PATH}-journal`;
    const walPath = `${DB_PATH}-wal`;
    const shmPath = `${DB_PATH}-shm`;

    for (const f of [journalPath, walPath, shmPath]) {
      if (fs.existsSync(f)) {
        try {
          fs.unlinkSync(f);
        } catch (unlinkErr) {
          console.error(`Could not delete temp database file ${f}:`, unlinkErr);
        }
      }
    }

    fs.writeFileSync(DB_PATH, backupBuffer);
    console.log('[DriveBackupService] Database file successfully overwritten.');

    // 5. Reconnect and apply journal WAL optimizations
    await prisma.$connect();
    await prisma.$queryRawUnsafe(`PRAGMA journal_mode=WAL;`);
    await prisma.$queryRawUnsafe(`PRAGMA busy_timeout=5000;`);
    console.log('[DriveBackupService] Prisma reconnected and WAL optimizations reapplied.');

    return true;
  } catch (error: any) {
    console.error('[DriveBackupService] Error restoring backup:', error);
    throw error;
  }
}

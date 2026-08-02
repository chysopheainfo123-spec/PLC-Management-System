import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'prisma', 'dev.db');
const BACKUPS_DIR = path.join(process.cwd(), 'prisma', 'backups');
const CONFIG_FILE = path.join(process.cwd(), 'prisma', 'config.json');

export function initAutoBackup() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }

  // Check every hour
  setInterval(() => {
    const dateStr = new Date().toISOString().split('T')[0];
    const backupPath = path.join(BACKUPS_DIR, `dev_backup_${dateStr}.db`);
    
    // Only backup once per day
    if (!fs.existsSync(backupPath) && fs.existsSync(DB_PATH)) {
      try {
        fs.copyFileSync(DB_PATH, backupPath);
        console.log(`[Auto-Backup] Successfully created daily backup: ${backupPath}`);
        
        // Read dynamic backup retention days from config.json (default to 30 as in UI, or 7)
        let retentionDays = 7;
        if (fs.existsSync(CONFIG_FILE)) {
          try {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
            if (config.backupRetentionDays !== undefined) {
              retentionDays = parseInt(config.backupRetentionDays, 10) || 7;
            }
          } catch (configErr) {
            console.error('[Auto-Backup] Error reading retention days from config:', configErr);
          }
        }

        // Clean up old backups (keep last retentionDays)
        const files = fs.readdirSync(BACKUPS_DIR).filter(file => file.startsWith('dev_backup_') && file.endsWith('.db'));
        if (files.length > retentionDays) {
          files.sort(); // Oldest first due to ISO date format
          const filesToDelete = files.slice(0, files.length - retentionDays);
          filesToDelete.forEach(file => {
            try {
              fs.unlinkSync(path.join(BACKUPS_DIR, file));
              console.log(`[Auto-Backup] Deleted old backup due to retention policy (${retentionDays} days): ${file}`);
            } catch (unlinkErr) {
              console.error(`[Auto-Backup] Failed to delete backup file ${file}:`, unlinkErr);
            }
          });
        }
      } catch (err) {
        console.error('[Auto-Backup] Failed to create daily backup:', err);
      }
    }
  }, 1000 * 60 * 60); // Every hour
}

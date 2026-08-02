import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportToExcel(data: any[], filename: string, title?: string) {
  if (!data || !data.length) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      margins: {
        left: 0.5, right: 0.5,
        top: 0.5, bottom: 0.5,
        header: 0.3, footer: 0.3
      }
    }
  });

  // Extract headers
  const headers = Object.keys(data[0]);

  // Title Row
  if (title) {
    worksheet.addRow([title]);
    worksheet.mergeCells(1, 1, 1, headers.length);
    const titleCell = worksheet.getCell('A1');
    titleCell.font = { name: 'Kantumruy Pro', size: 16, bold: true, color: { argb: 'FF1e3a8a' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow([]); // empty row
  }

  // Header Row
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Kantumruy Pro', bold: true, color: { argb: 'FFffffff' }, size: 11 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3b82f6' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFcbd5e1' } },
      left: { style: 'thin', color: { argb: 'FFcbd5e1' } },
      bottom: { style: 'thin', color: { argb: 'FFcbd5e1' } },
      right: { style: 'thin', color: { argb: 'FFcbd5e1' } }
    };
  });

  // Data Rows
  data.forEach((rowObj, index) => {
    const rowData = headers.map(h => rowObj[h]);
    const row = worksheet.addRow(rowData);
    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Kantumruy Pro', size: 10, color: { argb: 'FF1e293b' } };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFe2e8f0' } },
        left: { style: 'thin', color: { argb: 'FFe2e8f0' } },
        bottom: { style: 'thin', color: { argb: 'FFe2e8f0' } },
        right: { style: 'thin', color: { argb: 'FFe2e8f0' } }
      };

      // alternate row colors
      if (index % 2 === 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFf8fafc' }
        };
      }
    });
  });

  // Adjust column widths
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.address.startsWith('A1')) return; // skip title
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 12 : maxLength + 2;
  });

  // Export to blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || !data.length) return;

  // Extract headers
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => {
      return headers.map(fieldName => {
        let field = row[fieldName];
        if (field === null || field === undefined) {
          field = '';
        } else if (typeof field === 'object') {
          field = JSON.stringify(field);
        } else {
          field = String(field);
        }
        // Escape double quotes and enclose in double quotes if it contains a comma or newline
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          field = `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(',');
    })
  ].join('\n');

  // Add BOM for Excel to recognize UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

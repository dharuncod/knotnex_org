/**
 * Utility to generate and trigger browser download of a CSV file.
 * Automatically handles quotes, commas, and UTF-8 Byte Order Mark for Excel compatibility.
 */
export function downloadCSV(filename, headers, rows) {
  const escapeCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(escapeCell).join(',');
  const dataRows = rows.map(row => row.map(escapeCell).join(','));
  const csvContent = [headerRow, ...dataRows].join('\r\n');

  // Add UTF-8 BOM so Microsoft Excel & LibreOffice display characters properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCSV(filename: string, path: string) {
  const link = document.createElement('a');
  link.href = path;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

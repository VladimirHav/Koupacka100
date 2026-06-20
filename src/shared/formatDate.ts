// Formats a "YYYY-MM-DD" date string (the swim date) as "D.M.YYYY".
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${Number(day)}.${Number(month)}.${year}`;
}

// Formats an ISO datetime string (e.g. createdAt/updatedAt) as "D.M.YYYY HH:mm".
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const datePart = formatDate(iso.slice(0, 10));
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${datePart} ${hours}:${minutes}`;
}

export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const daysAgo = (n: number) => dayKey(Date.now() - n * 86400000);
export const seedFromDay = (k = dayKey()) => k.split('-').reduce((s, p) => s * 31 + parseInt(p, 10), 7);

export const toPaise = (n) => Math.round(Number(n) * 100);
export const fromPaise = (p) => p / 100;
export const fmtINR = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fromPaise(p));

/** Equal split in paise with deterministic residue distribution */
export function splitEvenPaise(totalPaise, ids) {
  const n = ids.length;
  const base = Math.floor(totalPaise / n);
  let rem = totalPaise - base * n;
  const sorted = [...ids].sort(); // deterministic
  const map = new Map();
  for (const id of sorted) {
    const bonus = rem > 0 ? 1 : 0;
    if (rem > 0) rem--;
    map.set(id, base + bonus);
  }
  return map; // id -> paise (integer)
}

import { splitEvenPaise } from '../util/money.js';

/** returns Map<memberId, paise> positive = gets, negative = owes */
export function computeBalancesPaise(group) {
  const bal = new Map(group.members.map(m => [m.id, 0]));
  for (const exp of group.expenses) {
    const shares = splitEvenPaise(exp.amount_cents, exp.participants);
    bal.set(exp.paidBy, (bal.get(exp.paidBy) || 0) + exp.amount_cents);
    for (const [pid, c] of shares) {
      bal.set(pid, (bal.get(pid) || 0) - c);
    }
  }
  return bal;
}

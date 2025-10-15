/** Min-cash-flow style two-pointer on deterministic sorted lists */
export function settleTransactions(balances) {
  const cred = [], debt = [];
  for (const [id, p] of Object.entries(balances)) {
    if (p > 0) cred.push({ id, p });
    else if (p < 0) debt.push({ id, p: -p });
  }
  cred.sort((a,b)=> b.p - a.p || a.id.localeCompare(b.id));
  debt.sort((a,b)=> b.p - a.p || a.id.localeCompare(b.id));

  let i=0, j=0;
  const tx = [];
  while (i<debt.length && j<cred.length) {
    const x = Math.min(debt[i].p, cred[j].p);
    tx.push({ from: debt[i].id, to: cred[j].id, paise: x });
    debt[i].p -= x; cred[j].p -= x;
    if (debt[i].p === 0) i++;
    if (cred[j].p === 0) j++;
  }
  return tx;
}

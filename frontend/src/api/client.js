const base =  '/api';

const j = (res) => res.ok ? res.json() : res.json().then(e => { throw new Error(e.error || 'Request failed'); });

export const api = {
  getGroup: (id) => fetch(`${base}/groups/${id}`).then(j),
  createGroup: (name) => fetch(`${base}/groups`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) }).then(j),

  listMembers: (gid) => fetch(`${base}/groups/${gid}/members`).then(j),
  addMember: (gid, name) => fetch(`${base}/groups/${gid}/members`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name }) }).then(j),

  listExpenses: (gid) => fetch(`${base}/groups/${gid}/expenses`).then(j),
  addExpense: (gid, body) => fetch(`${base}/groups/${gid}/expenses`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }).then(j),

  getBalances: (gid) => fetch(`${base}/groups/${gid}/balance`).then(j),
  getSettlements: (gid) => fetch(`${base}/groups/${gid}/settle`).then(j),
};

import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { fmtINR } from '../utils/currency';

export default function ExpensesTable({ group }) {
  const { data: expenses = [], isLoading, isError, error } = useQuery({
    queryKey:['expenses', group._id],
    queryFn:()=>api.listExpenses(group._id)
  });

  const idToName = Object.fromEntries(group.members.map(m=>[String(m._id), m.name]));

  return (
    <div className="panel">
      <h3>Expenses</h3>
      {isLoading ? <p>Loading…</p> :
       isError ? <div className="notification error">{error.message}</div> :
       expenses.length ? (
        <table className="table">
          <thead><tr><th>Description</th><th>Paid By</th><th>Participants</th><th>Amount</th></tr></thead>
          <tbody>
            {expenses.map(e=>(
              <tr key={e._id}>
                <td>{e.description}</td>
                <td>{idToName[e.paidBy]}</td>
                <td>{e.participants.map(p=>idToName[p]).join(', ')}</td>
                <td>{fmtINR(e.amount_cents/100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
       ) : <p>No expenses yet.</p>}
    </div>
  );
}

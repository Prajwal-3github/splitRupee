import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { fmtINR } from '../utils/currency';

export default function Settlements({ group }) {
  const { data: tx = [], isLoading, isError, error } = useQuery({ queryKey:['settlements', group._id], queryFn:()=>api.getSettlements(group._id) });
  const markPaid = (s) => {
    // UI-only action for now; integrate payment later
    alert(`${s.from} paid ${s.to} ${fmtINR(s.amount)} ✔`);
  };
  return (
    <div className="panel">
      <h3>How to Settle Up</h3>
      {isLoading ? <p>Loading…</p> :
       isError ? <div className="notification error">{error.message}</div> :
       tx.length ? (
        <table className="table">
          <thead><tr><th>From</th><th>To</th><th>Amount</th><th></th></tr></thead>
          <tbody>
            {tx.map((s, i)=>(
              <tr key={i}>
                <td className="owes">{s.from}</td>
                <td className="owed">{s.to}</td>
                <td>{fmtINR(s.amount)}</td>
                <td><button className="btn btn-primary" onClick={()=>markPaid(s)}>Mark Paid</button></td>
              </tr>
            ))}
          </tbody>
        </table>
       ) : <p>Everyone is settled up!</p>}
    </div>
  );
}

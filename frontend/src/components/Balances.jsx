import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { fmtINR } from '../utils/currency';

export default function Balances({ group }) {
  const { data = [], isLoading, isError, error } = useQuery({ queryKey:['balances', group._id], queryFn:()=>api.getBalances(group._id) });
  return (
    <div className="panel">
      <h3>Balances</h3>
      {isLoading ? <p>Loading…</p> :
       isError ? <div className="notification error">{error.message}</div> :
       <table className="table">
         <thead><tr><th>Name</th><th>Balance</th></tr></thead>
         <tbody>
           {data.map(({ name, balance })=>(
             <tr key={name}>
               <td>{name}</td>
               <td>
                 <span className={balance >= 0 ? 'owed' : 'owes'}>
                   {balance >= 0 ? `is owed ${fmtINR(balance)}` : `owes ${fmtINR(Math.abs(balance))}`}
                 </span>
               </td>
             </tr>
           ))}
         </tbody>
       </table>}
    </div>
  );
}

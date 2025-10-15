import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function Groups(){
  const nav = useNavigate();
  const { data: groups = [], isLoading, isError, error } = useQuery({
    queryKey:['groups'],
    queryFn: () => fetch('/api/groups').then(r=>r.json())
  });

  return (
    <>
      <div className="panel">
        <h2>Your Groups</h2>
        {isLoading ? <p>Loading…</p> :
         isError ? <div className="notification error">{error.message}</div> :
         groups.length ? (
           <table className="table">
             <thead><tr><th>Name</th><th>Created</th><th></th></tr></thead>
             <tbody>
               {groups.map(g=>(
                 <tr key={g._id}>
                   <td>{g.name}</td>
                   <td>{new Date(g.createdAt).toLocaleDateString('en-IN')}</td>
                   <td><button className="btn" onClick={()=>nav(`/groups/${g._id}`)}>Open</button></td>
                 </tr>
               ))}
             </tbody>
           </table>
         ) : <p>No groups yet. Create one below.</p>}
      </div>
    </>
  );
}

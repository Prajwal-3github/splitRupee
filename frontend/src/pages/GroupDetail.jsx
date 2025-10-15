import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import ExpenseForm from '../components/ExpenseForm';
import Members from '../components/Members';
import Balances from '../components/Balances';
import Settlements from '../components/Settlements';
import InviteButton from '../components/InviteButton';
import ExpensesTable from '../components/ExpensesTable';

export default function GroupDetail(){      
  const { groupId } = useParams();
  const nav = useNavigate();
  const { data: group, isLoading, isError } = useQuery({
    queryKey:['group', groupId],
    queryFn:()=>api.getGroup(groupId)
  });

  if (isLoading) return <div className="panel"><p>Loading…</p></div>;
  if (isError || !group) return (
    <div className="panel">
      <p>Group not found</p>
      <button onClick={()=>nav('/groups')}>Back</button>
    </div>
  );

  return (
    <>
      <div className="group-header">
        <h2>{group.name}</h2>
        <InviteButton group={group} />
      </div>

      <div className="tabs">
        <Link to="" end>Expenses</Link>
        <Link to="members">Members</Link>
        <Link to="settle">Settle</Link>
        <Link to="activity">Activity</Link>
        <Link to="settings">Settings</Link>
      </div>

      <Routes>
        <Route index element={
          <div className="container">
            <ExpenseForm group={group} />
            <ExpensesTable group={group} />
          </div>
        } />
        <Route path="members" element={
          <div className="container"><Members group={group} /><Balances group={group} /></div>
        } />
        <Route path="settle" element={<div className="container"><Settlements group={group}/></div>} />
        <Route path="activity" element={<div className="panel"><p>Coming soon.</p></div>} />
        <Route path="settings" element={<div className="panel"><p>Settings coming soon.</p></div>} />
      </Routes>
    </>
  );
}

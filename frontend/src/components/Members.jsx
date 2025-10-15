import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export default function Members({ group }) {
  const qc = useQueryClient();
  const [name, setName] = useState('');

  const { data: members = [] } = useQuery({ queryKey:['members', group.id], queryFn:()=>api.listMembers(group.id) });
  const addMember = useMutation({
    mutationFn: (n)=> api.addMember(group.id, n),
    onSuccess: () => { qc.invalidateQueries({ queryKey:['group', group.id] }); qc.invalidateQueries({ queryKey:['members', group.id] }); setName(''); }
  });

  return (
    <div className="panel">
      <h3>Members</h3>
      {members.length === 0 ? <p>No members yet.</p> :
        <ul>{members.map(m => <li key={m.id}>{m.name}</li>)}</ul>
      }
      <form onSubmit={(e)=>{e.preventDefault(); if(name.trim()) addMember.mutate(name.trim());}}>
        <div className="form-group">
          <label htmlFor="memberName">Add New Member</label>
          <input id="memberName" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Carol" />
        </div>
        <button type="submit" disabled={addMember.isPending}>Add Member</button>
        {addMember.isError && <div className="notification error">{addMember.error.message}</div>}
      </form>
    </div>
  );
}

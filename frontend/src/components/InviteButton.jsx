import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function InviteButton({ group }){
  const qc = useQueryClient();
  const [link, setLink] = useState('');
  const [loading, setL] = useState(false);
  const [err, setErr] = useState('');

  const create = async () => {
    try{
      setL(true); setErr('');
      // pick the first member as inviter for demo; usually you'd track current user
      const createdById = group.members[0]?.id || 'system';
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/groups/${group.id}/invites`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ createdById, maxUses: 10, ttlHours: 168 })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error||'Failed to create invite');
      const url = `${window.location.origin}/invite/${data.token}`;
      setLink(url);
      qc.invalidateQueries({ queryKey:['group', group.id] });
    }catch(e){ setErr(e.message); } finally{ setL(false); }
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    alert('Invite link copied!');
  };

  return (
    <div className="invite-box">
      <button onClick={create} disabled={loading}>{loading?'Creating…':'Invite friends'}</button>
      {link && (
        <div className="invite-link">
          <input readOnly value={link} />
          <button onClick={copy}>Copy</button>
        </div>
      )}
      {err && <div className="notification error">{err}</div>}
    </div>
  );
}

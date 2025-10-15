import { useState } from 'react';
import { api } from '../api/client';

export default function GroupPicker({ onPick }) {
  const [name, setName] = useState('');
  const [loading, setL] = useState(false);
  const [err, setErr] = useState('');

  const create = async (e) => {
    e.preventDefault();
    setErr(''); if (!name.trim()) return setErr('Group name required');
    try { setL(true); const g = await api.createGroup(name.trim()); onPick(g); setName(''); }
    catch(e){ setErr(e.message); } finally { setL(false); }
  };

  return (
    <div className="panel">
      <h2>Create a New Group</h2>
      <form onSubmit={create}>
        <div className="form-group">
          <label htmlFor="groupName">Group Name</label>
          <input id="groupName" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Goa Trip" />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Group'}</button>
        {err && <div className="notification error">{err}</div>}
      </form>
    </div>
  );
}

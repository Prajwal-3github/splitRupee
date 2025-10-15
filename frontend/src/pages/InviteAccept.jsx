import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function InviteAccept(){
  const { token } = useParams();
  const nav = useNavigate();
  const { register, handleSubmit, formState:{ errors } } = useForm({ defaultValues:{ name:'' } });

  const accept = async (data) => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/invites/accept`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, name: data.name })
    });
    const j = await res.json();
    if (!res.ok) return alert(j.error||'Failed to accept invite');
    nav(`/groups/${j.groupId}`);
  };

  return (
    <div className="panel">
      <h2>Join group</h2>
      <p>Enter your name to join via invite.</p>
      <form onSubmit={handleSubmit(accept)}>
        <div className="form-group">
          <label htmlFor="nm">Your name</label>
          <input id="nm" {...register('name',{required:'Required'})} />
          {errors.name && <small className="error">{errors.name.message}</small>}
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
}

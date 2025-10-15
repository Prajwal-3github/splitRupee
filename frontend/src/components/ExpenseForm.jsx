import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

const schema = z.object({
  description: z.string().min(1, 'Description required'),
  amount: z.coerce.number().positive('Enter amount > 0'),
  paidBy: z.string().min(1, 'Select payer'),
  participants: z.array(z.string()).nonempty('Pick at least one participant')
});

export default function ExpenseForm({ group }) {
  const qc = useQueryClient();
  const { data: members = [] } = useQuery({ queryKey:['members', group.id], queryFn:()=>api.listMembers(group.id) });

  const { register, handleSubmit, setValue, watch, formState:{ errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { description:'', amount:'', paidBy:'', participants:[] }
  });

  useEffect(()=>{ if(members[0]) setValue('paidBy', members[0].id); }, [members, setValue]);

  const allIds = members.map(m=>m.id);
  const selected = watch('participants') || [];
  const toggleAll = () => setValue('participants', selected.length === allIds.length ? [] : allIds);

  const addExpense = useMutation({
    mutationFn: (data)=> api.addExpense(group.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey:['balances', group.id] });
      qc.invalidateQueries({ queryKey:['settlements', group.id] });
      qc.invalidateQueries({ queryKey:['group', group.id] });
      reset({ description:'', amount:'', paidBy: members[0]?.id || '', participants: [] });
    }
  });

  return (
    <div className="panel">
      <h3>Add Expense</h3>
      <form onSubmit={handleSubmit((data)=>addExpense.mutate(data))}>
        <div className="form-group">
          <label htmlFor="desc">Description</label>
          <input id="desc" {...register('description')} placeholder="e.g., Groceries" />
          {errors.description && <small className="error">{errors.description.message}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input id="amount" type="number" step="0.01" {...register('amount')} placeholder="e.g., 1200" />
          {errors.amount && <small className="error">{errors.amount.message}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="paidBy">Paid By</label>
          <select id="paidBy" {...register('paidBy')}>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          {errors.paidBy && <small className="error">{errors.paidBy.message}</small>}
        </div>
        <div className="form-group">
          <label>Split Between</label>
          <button type="button" onClick={toggleAll} style={{ marginBottom: 8 }}>
            {selected.length === allIds.length ? 'Unselect all' : 'Select all'}
          </button>
          <div className="multi-select-participants">
            {members.map(m => (
              <label key={m.id} className="participant-item">
                <input type="checkbox" value={m.id} {...register('participants')} />
                {m.name}
              </label>
            ))}
          </div>
          {errors.participants && <small className="error">{errors.participants.message}</small>}
        </div>
        <button type="submit" disabled={addExpense.isPending}>
          {addExpense.isPending ? 'Adding…' : 'Add Expense'}
        </button>
        {addExpense.isError && <div className="notification error">{addExpense.error.message}</div>}
        {addExpense.isSuccess && <div className="notification success">Expense added successfully!</div>}
      </form>
    </div>
  );
}

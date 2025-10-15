import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { getGroup, addExpense } from '../db.js';
import { toPaise } from '../util/money.js';
import mongoose from 'mongoose';

const router = Router();

const ExpenseSchema = z.object({
  description: z.string().trim().min(1).max(120),
  amount: z.number().positive().finite().max(1e9),
  paidBy: z.string(),
  participants: z.array(z.string()).nonempty().transform((a) => [...new Set(a)])
});

router.post('/groups/:groupId/expenses', validate(z.object({
  params: z.object({ groupId: z.string() }),
  body: ExpenseSchema
})), async (req,res)=>{
  const g = await getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });

  const { description, amount, paidBy, participants } = req.v.body;
  const ids = new Set(g.members.map(m=>String(m._id)));

  if (!ids.has(paidBy)) return res.status(400).json({ error:`Payer not in group` });
  for (const pid of participants) if (!ids.has(pid)) return res.status(400).json({ error:`Participant ${pid} not in group` });

  const exp = await addExpense(g._id, {
    description,
    paidBy: new mongoose.Types.ObjectId(paidBy),
    participants: participants.map(id=> new mongoose.Types.ObjectId(id)),
    amount_cents: toPaise(amount),
    gift: !participants.includes(paidBy)
  });
  res.status(201).json(exp);
});

router.get('/groups/:groupId/expenses', validate(z.object({
  params: z.object({ groupId: z.string() })
})), async (req,res)=>{
  const g = await getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });
  res.json(g.expenses);
});

export default router;

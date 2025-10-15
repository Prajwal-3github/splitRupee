import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { getGroup } from '../db.js';
import { computeBalancesPaise } from '../services/balances.js';
import { fromPaise } from '../util/money.js';

const router = Router();

router.get('/groups/:groupId/balance', validate(z.object({
  params: z.object({ groupId: z.string() })
})), (req,res)=>{
  const g = getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });

  const bal = computeBalancesPaise(g);
  const out = g.members.map(m => ({
    name: m.name,
    balance: Number(fromPaise(bal.get(m.id) || 0).toFixed(2))
  }));
  res.json(out);
});

export default router;

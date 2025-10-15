import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { getGroup } from '../db.js';
import { computeBalancesPaise } from '../services/balances.js';
import { settleTransactions } from '../services/settlements.js';

const router = Router();

router.get('/groups/:groupId/settle', validate(z.object({
  params: z.object({ groupId: z.string() })
})), (req,res)=>{
  const g = getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });

  const balMap = Object.fromEntries(computeBalancesPaise(g));
  const idToName = Object.fromEntries(g.members.map(m=>[m.id, m.name]));
  const tx = settleTransactions(balMap).map(t => ({
    from: idToName[t.from],
    to: idToName[t.to],
    amount: Number((t.paise/100).toFixed(2))
  }));
  res.json(tx);
});

export default router;

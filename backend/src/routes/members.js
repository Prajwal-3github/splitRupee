import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { getGroup, addMember } from '../db.js';

const router = Router();

router.post('/groups/:groupId/members', validate(z.object({
  params: z.object({ groupId: z.string() }),
  body: z.object({ name: z.string().trim().min(1).max(40) })
})), (req,res)=>{
  const g = getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });
  // prevent duplicate names within group (case-insensitive)
  if (g.members.some(m => m.name.toLowerCase() === req.v.body.name.toLowerCase())) {
    return res.status(409).json({ error: 'Member with same name exists' });
  }
  const m = addMember(g, req.v.body.name);
  res.status(201).json(m);
});

router.get('/groups/:groupId/members', validate(z.object({
  params: z.object({ groupId: z.string() })
})), (req,res)=>{
  const g = getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });
  res.json(g.members);
});

export default router;

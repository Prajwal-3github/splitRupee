import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { createGroup, getGroup, listGroups, removeGroup } from '../db.js';

const router = Router();

router.get('/groups', async (_req, res)=>{
  const groups = await listGroups();
  res.json(groups);
});

router.post('/groups', validate(z.object({
  body: z.object({ name: z.string().trim().min(1).max(60) })
})), async (req, res)=> {
  const g = await createGroup(req.v.body.name);
  res.status(201).json(g);
});

router.get('/groups/:groupId', validate(z.object({
  params: z.object({ groupId: z.string() })
})), async (req, res)=>{
  const g = await getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });
  res.json(g);
});

router.delete('/groups/:groupId', validate(z.object({
  params: z.object({ groupId: z.string() })
})), async (req,res)=>{
  const g = await getGroup(req.v.params.groupId);
  if (!g) return res.status(404).json({ error:'Group not found' });
  await removeGroup(g._id);
  res.status(204).end();
});

export default router;

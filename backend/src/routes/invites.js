import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { db, getGroup, addMember } from '../db.js';          // ✅ import db here
import { createInvite, consumeInvite } from '../services/invites.js';

const router = Router();

// create invite
router.post(
  '/groups/:groupId/invites',
  validate(z.object({
    params: z.object({ groupId: z.string() }),
    body: z.object({
      createdById: z.string().min(1),
      maxUses: z.number().int().min(1).max(100).optional(),
      ttlHours: z.number().int().min(1).max(24 * 30).optional()
    })
  })),
  (req, res) => {
    const g = getGroup(req.v.params.groupId);
    if (!g) return res.status(404).json({ error: 'Group not found' });
    const ttlMs = (req.v.body.ttlHours ?? 168) * 60 * 60 * 1000;
    const inv = createInvite(g, req.v.body.createdById, req.v.body.maxUses ?? 10, ttlMs);
    res.status(201).json({ token: inv.token, expiresAt: inv.expiresAt, maxUses: inv.maxUses });
  }
);

// accept invite (join)
router.post(
  '/invites/accept',
  validate(z.object({
    body: z.object({ token: z.string().min(1), name: z.string().trim().min(1).max(40) })
  })),
  (req, res) => {
    const token = req.v.body.token;
    // find group containing token (scan in-memory db)
    const groups = Object.values(db.groups);                   // ✅ use imported db
    const group = groups.find(g => g.invites?.some(i => i.token === token && i.active));
    if (!group) return res.status(404).json({ error: 'Invite not found' });

    const result = consumeInvite(group, token);
    if (!result.ok) return res.status(400).json({ error: `Invite ${result.reason}` });

    const member = addMember(group, req.v.body.name);
    res.status(201).json({ groupId: group.id, member });
  }
);

export default router;

import { nanoid } from 'nanoid';

export function createInvite(group, createdById, maxUses = 1, ttlMs = 1000 * 60 * 60 * 24 * 7) {
  const token = `inv_${nanoid(16)}`;
  const invite = {
    token,
    createdById,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
    maxUses,
    used: 0,
    active: true
  };
  group.invites.push(invite);
  return invite;
}

export function consumeInvite(group, token) {
  const inv = group.invites.find(i => i.token === token && i.active);
  if (!inv) return { ok:false, reason:'invalid' };
  if (Date.now() > inv.expiresAt) return { ok:false, reason:'expired' };
  if (inv.used >= inv.maxUses) return { ok:false, reason:'exhausted' };
  inv.used += 1;
  if (inv.used >= inv.maxUses) inv.active = false;
  return { ok:true, invite: inv };
}

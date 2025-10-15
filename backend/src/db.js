import { connectDB } from './db/mongo.js';
import { Group } from './db/models.js';
import { nanoid } from 'nanoid';

export const db = {}; // no in-memory now, kept for compatibility

export async function createGroup(name) {
  await connectDB();
  const g = await Group.create({ name: name.trim(), members: [], expenses: [], invites: [] });
  return g.toObject();
}

export async function listGroups() {
  await connectDB();
  const groups = await Group.find({}, { name: 1, createdAt: 1 }).sort({ createdAt: -1 }).lean();
  return groups;
}

export async function getGroup(id) {
  await connectDB();
  const g = await Group.findById(id).lean();
  return g || null;
}

export async function removeGroup(id) {
  await connectDB();
  await Group.findByIdAndDelete(id);
}

export async function addMember(groupId, name) {
  await connectDB();
  const g = await Group.findById(groupId);
  if (!g) return null;
  g.members.push({ name: name.trim(), active: true });
  await g.save();
  return g.members[g.members.length - 1].toObject();
}

export async function addExpense(groupId, exp) {
  await connectDB();
  const g = await Group.findById(groupId);
  if (!g) return null;
  g.expenses.push(exp);
  await g.save();
  return g.expenses[g.expenses.length - 1].toObject();
}

export async function addInvite(groupId, invite) {
  await connectDB();
  const g = await Group.findById(groupId);
  if (!g) return null;
  g.invites.push(invite);
  await g.save();
  return invite;
}

export function newToken(prefix = 'inv') {
  return `${prefix}_${nanoid(16)}`;
}

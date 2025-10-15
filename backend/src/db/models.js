import { Schema, model, models } from 'mongoose';

const MemberSchema = new Schema({
  name: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true }
}, { _id: true });

const ExpenseSchema = new Schema({
  description: { type: String, required: true },
  amount_cents: { type: Number, required: true, min: 1 },
  paidBy: { type: Schema.Types.ObjectId, required: true },
  participants: [{ type: Schema.Types.ObjectId, required: true }],
  gift: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const InviteSchema = new Schema({
  token: { type: String, required: true, index: true, unique: true },
  createdById: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  maxUses: { type: Number, default: 10 },
  used: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { _id: false });

const GroupSchema = new Schema({
  name: { type: String, required: true },
  members: [MemberSchema],
  expenses: [ExpenseSchema],
  invites: [InviteSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Group = models.Group || model('Group', GroupSchema);

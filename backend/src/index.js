import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import groupsRouter from './routes/groups.js';
import membersRouter from './routes/members.js';
import expensesRouter from './routes/expenses.js';
import balancesRouter from './routes/balances.js';
import settlementsRouter from './routes/settlements.js';
import invitesRouter from './routes/invites.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(express.json({ limit: '256kb' }));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','PATCH'],
}));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60_000, max: 120 });
app.use('/api/', limiter);

// health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// routes
app.use('/api', groupsRouter);
app.use('/api', membersRouter);
app.use('/api', expensesRouter);
app.use('/api', balancesRouter);
app.use('/api', settlementsRouter);

// error fallback
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});
app.use('/api', invitesRouter);

export default app;

import mongoose from 'mongoose';

const { MONGODB_URI = '' } = process.env;
if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set');
}

let cached = global.__mongoose_conn;
if (!cached) cached = global.__mongoose_conn = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'expense_splitter',
      autoIndex: true
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

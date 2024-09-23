import mongoose, { Mongoose } from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

type CachedMongoose = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: CachedMongoose;
    }
  }
}

//@ts-ignore

let cached = globalThis.mongoose;

if (!cached) {
  //@ts-ignore
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    //@ts-ignore
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  if (cached.conn) {
    console.debug('connected to DB');
  } else {
    console.error('didnt connect');
  }
  return cached.conn;
}

export default dbConnect;

export const dynamic = 'force-dynamic';

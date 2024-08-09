import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const sql = neon(process.env.DATABASE_URL!);
export const googleSheet = neon(process.env.SHEET_URL!);

export const db = drizzle(sql);
export const sheet = drizzle(googleSheet);



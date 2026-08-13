import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const url = process.env.TURSO_DATABASE_URL;

if (!url) {
  throw new Error(
    'Falta TURSO_DATABASE_URL. Copia .env.example a .env.local y completa las credenciales.',
  );
}

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export { schema };

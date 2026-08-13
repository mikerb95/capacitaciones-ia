import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL ?? 'file:./local.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

// Con un archivo local se usa el dialecto sqlite, que no pide token.
// Contra Turso se usa el dialecto turso, que sí lo exige.
const isLocalFile = url.startsWith('file:');

export default defineConfig(
  isLocalFile
    ? {
        schema: './src/db/schema.ts',
        out: './drizzle',
        dialect: 'sqlite',
        dbCredentials: { url },
        verbose: true,
        strict: true,
      }
    : {
        schema: './src/db/schema.ts',
        out: './drizzle',
        dialect: 'turso',
        dbCredentials: { url, authToken },
        verbose: true,
        strict: true,
      },
);

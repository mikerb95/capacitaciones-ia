import { createClient } from '@libsql/client';
async function main() {
  const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
  try {
    const r = await c.execute("select key, value from settings limit 5");
    console.log('settings ok', r.rows);
  } catch (e) { console.log('settings FALLA:', (e as Error).message); }
  const t = await c.execute("select name from sqlite_master where type='table' order by name");
  console.log(t.rows.map((r) => r.name).join(', '));
}
main();

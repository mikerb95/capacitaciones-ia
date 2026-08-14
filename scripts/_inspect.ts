import { createClient } from '@libsql/client';

async function main() {
  const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
  const t = await c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('TABLAS REMOTAS:\n ', t.rows.map(r => r.name).join(', '));
  const p = await c.execute('PRAGMA table_info(platforms)');
  console.log('\nCOLUMNAS platforms:\n ', p.rows.map(r => r.name).join(', '));
  const m = await c.execute("SELECT slug, status FROM modules WHERE platform_id='chatgpt' ORDER BY sort_order");
  console.log('\nMODULOS chatgpt remotos:\n ', m.rows.map(r => `${r.slug}(${r.status})`).join(', '));
}
main();

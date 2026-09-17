import { createClient } from '@libsql/client';
async function main() {
  const c = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
  const r = await c.execute("select p.token, p.name, a.code from participants p join access_codes a on a.id=p.access_code_id where a.code='0368' limit 3");
  console.log(r.rows);
  const q = await c.execute("select ac.code, ap.platform_id, pp.key from access_code_plans ap join access_codes ac on ac.id=ap.access_code_id join platform_plans pp on pp.id=ap.plan_id where ap.platform_id='copilot'");
  console.log(q.rows);
}
main();

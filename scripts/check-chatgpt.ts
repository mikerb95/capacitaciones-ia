import { createClient } from '@libsql/client';

// Verificacion de solo lectura del contenido de ChatGPT en la base.

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const platform = await client.execute(
    "SELECT status, plans_note FROM platforms WHERE id = 'chatgpt'",
  );
  console.log('plataforma:', platform.rows[0]?.status);

  const rows = await client.execute(`
    SELECT m.slug, m.name, m.status, m.level,
           (SELECT COUNT(*) FROM module_prompts p WHERE p.module_id = m.id) AS prompts
    FROM modules m
    WHERE m.platform_id = 'chatgpt'
    ORDER BY m.sort_order
  `);

  console.log(`modulos: ${rows.rows.length}`);
  for (const r of rows.rows) {
    console.log(
      `  ${String(r.slug).padEnd(10)} ${String(r.status).padEnd(10)} ${String(r.level).padEnd(11)} ${r.prompts} prompts  ${r.name}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

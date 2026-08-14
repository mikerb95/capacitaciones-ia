import { createClient } from '@libsql/client';

// Limpieza puntual: el modulo chatgpt/sora salio del seed cuando OpenAI
// descontinuo Sora, y el seeder no borra modulos que ya no estan en el archivo.
// Este script se corre una vez y despues se puede eliminar.

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const found = await client.execute(
    "SELECT id FROM modules WHERE platform_id = 'chatgpt' AND slug = 'sora'",
  );

  if (!found.rows.length) {
    console.log('No hay modulo chatgpt/sora que borrar.');
    return;
  }

  const id = Number(found.rows[0].id);
  const children = [
    'module_outcomes',
    'module_prompts',
    'module_steps',
    'module_roles',
    'module_mistakes',
    'module_plans',
  ];

  for (const table of children) {
    const result = await client.execute({
      sql: `DELETE FROM ${table} WHERE module_id = ?`,
      args: [id],
    });
    console.log(`  ${table.padEnd(18)} ${result.rowsAffected} filas`);
  }

  const removed = await client.execute({
    sql: 'DELETE FROM modules WHERE id = ?',
    args: [id],
  });
  console.log(`  ${'modules'.padEnd(18)} ${removed.rowsAffected} fila (id ${id})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

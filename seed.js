// Re-seed com encoding correto via conexao direta PostgreSQL
// Uso: node seed.js postgresql://postgres:SENHA@db.swxlaicapszyotqtedoq.supabase.co:5432/postgres
const { Client } = require('pg');
const fs = require('node:fs');
const path = require('node:path');

const password = process.argv[2];
if (!password) {
  console.error('Uso: node seed.js "SUASENHA"');
  console.error('Senha em: Supabase → Settings → Database → Database password');
  process.exit(1);
}

async function resolveIPv4(hostname) {
  const dns = require('node:dns').promises;
  const addrs = await dns.resolve4(hostname);
  return addrs[0];
}

async function main() {
  const host = await resolveIPv4('db.swxlaicapszyotqtedoq.supabase.co');
  console.log(`Conectando via IPv4: ${host}`);
  const client = new Client({
    host,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log('Conectado. Limpando dados antigos...');

  await client.query(`
    TRUNCATE datas, designacoes, discursos RESTART IDENTITY CASCADE;
    DELETE FROM temas;
    DELETE FROM congregacoes;
  `);
  console.log('Tabelas limpas.');

  const sql = fs.readFileSync(path.join(__dirname, 'supabase_schema.sql'), { encoding: 'utf8' });

  // Extract only INSERT statements
  const inserts = sql
    .split('\n')
    .filter(l => l.trimStart().startsWith('INSERT INTO'))
    .map(l => l.trim());

  console.log(`${inserts.length} inserts a executar...`);
  let ok = 0, fail = 0;
  for (const stmt of inserts) {
    try {
      await client.query(stmt);
      ok++;
      if (ok % 50 === 0) process.stdout.write(`${ok}...`);
    } catch (e) {
      console.error(`\nFAIL: ${stmt.slice(0, 80)}\n  ${e.message}`);
      fail++;
    }
  }
  await client.end();
  console.log(`\nConcluido: ${ok} ok, ${fail} falhas`);
}

main().catch(err => { console.error(err); process.exit(1); });

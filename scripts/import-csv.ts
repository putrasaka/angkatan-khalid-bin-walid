/**
 * Import CSV hasil export Supabase ke Neon.
 *
 * Pakai:
 *   npx tsx scripts/import-csv.ts [folder]
 *   npm run import:csv -- [folder]
 *
 * Default folder: ./csv-export
 * DATABASE_URL dibaca dari .env.local lalu .env
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { neon } from '@neondatabase/serverless';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const TABLES: Record<string, string[]> = {
  students: ['id', 'name', 'nickname', 'role', 'photo', 'photo_large', 'photo_sd', 'photo_smp', 'previous_school', 'current_school', 'birth_place_date', 'address', 'hobby', 'dream', 'message', 'impression', 'instagram', 'created_at'],
  moments: ['id', 'title', 'image', 'date', 'tag', 'story', 'created_at'],
  graduation_info: ['id', 'main_banner', 'title', 'cohort_name', 'date', 'location', 'description'],
  graduates: ['id', 'name', 'position'],
  graduation_gallery: ['id', 'image', 'caption', 'created_at'],
  video_moments: ['id', 'title', 'description', 'video_url', 'poster_url', 'duration', 'date', 'created_at'],
  visitor_logs: ['id', 'name', 'age', 'previous_school', 'current_school', 'logged_in_at'],
};

loadEnv();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL tidak ditemukan.');
  console.error('Jalankan `vercel env pull .env.local` atau isi DATABASE_URL di .env');
  process.exit(1);
}

const folder = process.argv[2] ?? 'csv-export';
const sql = neon(connectionString);
const CHUNK = 100;

async function main() {
  if (!existsSync(folder)) {
    console.error(`Folder tidak ditemukan: ${folder}`);
    process.exit(1);
  }

  for (const [table, allowedColumns] of Object.entries(TABLES)) {
    const file = join(folder, `${table}.csv`);
    if (!existsSync(file)) {
      console.log(`SKIP  ${table.padEnd(20)} (file tidak ada)`);
      continue;
    }

    const rows: Record<string, string>[] = parse(readFileSync(file, 'utf8'), {
      columns: true,
      bom: true,
      skip_empty_lines: true,
    });

    if (rows.length === 0) {
      console.log(`SKIP  ${table.padEnd(20)} (kosong)`);
      continue;
    }

    const headers = Object.keys(rows[0]);
    const unknown = headers.filter((h) => !allowedColumns.includes(h));
    if (unknown.length > 0) {
      console.error(`ERROR ${table}: kolom tidak dikenal -> ${unknown.join(', ')}`);
      process.exit(1);
    }

    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const values: unknown[] = [];
      const tuples = chunk.map(
        (row) =>
          `(${headers
            .map((h) => {
              values.push(row[h] === '' ? null : row[h]);
              return `$${values.length}`;
            })
            .join(', ')})`
      );

      const query = `insert into ${table} (${headers
        .map((h) => `"${h}"`)
        .join(', ')}) values ${tuples.join(', ')} on conflict do nothing`;

      await sql.query(query, values);
    }

    console.log(`OK    ${table.padEnd(20)} ${rows.length} baris`);
  }

  // Sequence serial tidak ikut maju saat id diimpor eksplisit.
  const maxRow = await sql.query('select coalesce(max(id), 0) as max from graduates');
  const maxId = Number((maxRow[0] as { max: number | string }).max ?? 0);
  if (maxId > 0) {
    await sql.query(`select setval('graduates_id_seq', $1)`, [maxId]);
  }

  console.log('\nSelesai. Verifikasi jumlah baris:');
  for (const table of Object.keys(TABLES)) {
    const res = await sql.query(`select count(*)::int as count from ${table}`);
    console.log(`  ${table.padEnd(20)} ${(res[0] as { count: number }).count}`);
  }
}

main().catch((err) => {
  console.error('\nImport gagal:', err.message ?? err);
  process.exit(1);
});

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// POST /api/visitor-log — catat pengunjung buku tamu (dedup per nama, case-insensitive).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'DATABASE_URL belum diset di environment' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  const name = String(body.name ?? '').trim();
  const age = String(body.age ?? '').trim();
  const previousSchool = String(body.previousSchool ?? '').trim();
  const currentSchool = String(body.currentSchool ?? '').trim();

  if (!name || !age || !previousSchool || !currentSchool) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  try {
    const sql = neon(connectionString);

    const existing = await sql`select id from visitor_logs where lower(name) = lower(${name}) limit 1`;
    if (existing.length > 0) {
      return res.status(200).json({ skipped: true });
    }

    await sql`
      insert into visitor_logs (name, age, previous_school, current_school)
      values (${name}, ${age}, ${previousSchool}, ${currentSchool})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/visitor-log]', err);
    return res.status(500).json({ error: 'Gagal menyimpan log pengunjung' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { rateLimit, rateLimitKey } from '../server/rate-limit.js';
import { signVisitorToken } from '../server/visitor-token.js';

// POST /api/visitor-log — catat pengunjung buku tamu (dedup per nama, case-insensitive)
// lalu balas token bertanda tangan yang dipakai saat mengirim masukan.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const connectionString = process.env.DATABASE_URL;
  const secret = process.env.VISITOR_TOKEN_SECRET;
  if (!connectionString || !secret) {
    return res.status(500).json({ error: 'Server belum dikonfigurasi' });
  }

  let body: any;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  } catch {
    return res.status(400).json({ error: 'Body tidak valid' });
  }

  const name = String(body.name ?? '').trim();
  const age = String(body.age ?? '').trim();
  const previousSchool = String(body.previousSchool ?? '').trim();
  const currentSchool = String(body.currentSchool ?? '').trim();

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Nama tidak valid' });
  }
  if (!/^\d{2,3}$/.test(age)) {
    return res.status(400).json({ error: 'Umur tidak valid' });
  }
  if (!previousSchool || previousSchool.length > 150) {
    return res.status(400).json({ error: 'Sekolah asal tidak valid' });
  }
  if (!currentSchool || currentSchool.length > 150) {
    return res.status(400).json({ error: 'Sekolah sekarang tidak valid' });
  }

  try {
    const sql = neon(connectionString);

    const limited = await rateLimit(sql, rateLimitKey(req, 'visitor-log', secret), 10, 600);
    if (!limited.allowed) {
      res.setHeader('Retry-After', String(limited.retryAfter));
      return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' });
    }

    const existing = await sql`
      select id, name from visitor_logs where lower(name) = lower(${name}) limit 1
    `;
    let visitorId: string;
    let storedName = name;

    if (existing.length > 0) {
      const row = existing[0] as { id: unknown; name: unknown };
      visitorId = String(row.id);
      storedName = String(row.name ?? name);
    } else {
      const inserted = await sql`
        insert into visitor_logs (name, age, previous_school, current_school)
        values (${name}, ${age}, ${previousSchool}, ${currentSchool})
        returning id
      `;
      visitorId = String((inserted[0] as { id: unknown }).id);
    }

    return res.status(200).json({
      ok: true,
      token: signVisitorToken({ visitorId, name: storedName }, secret),
    });
  } catch (err) {
    console.error('[api/visitor-log]', err);
    return res.status(500).json({ error: 'Gagal menyimpan log pengunjung' });
  }
}

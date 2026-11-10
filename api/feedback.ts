import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { hashKey, rateLimit, rateLimitKey } from '../server/rate-limit';
import { verifyVisitorToken } from '../server/visitor-token';

// POST /api/feedback — masukan pengunjung. Identitas diambil dari token
// pengunjung (bukan field name di body), lalu dicek ulang ke database.
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

  const auth = String(req.headers.authorization ?? '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const visitor = verifyVisitorToken(token, secret);
  if (!visitor) {
    return res.status(401).json({ error: 'Sesi pengunjung tidak valid' });
  }

  let body: any;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  } catch {
    return res.status(400).json({ error: 'Body tidak valid' });
  }

  const phone = String(body.phone ?? '').trim().replace(/\s+/g, ' ');
  const message = String(body.message ?? '').trim();

  if (!/^[0-9+\-\s]{8,20}$/.test(phone)) {
    return res.status(400).json({ error: 'Nomor TLP wajib diisi (8-20 digit)' });
  }
  if (message.length < 3 || message.length > 1000) {
    return res.status(400).json({ error: 'Pesan harus 3-1000 karakter' });
  }

  try {
    const sql = neon(connectionString);

    const perVisitor = await rateLimit(
      sql,
      hashKey('feedback-visitor', visitor.visitorId, secret),
      1,
      60
    );
    if (!perVisitor.allowed) {
      res.setHeader('Retry-After', String(perVisitor.retryAfter));
      return res.status(429).json({ error: 'Tunggu sebentar sebelum mengirim masukan lagi.' });
    }

    const perIp = await rateLimit(sql, rateLimitKey(req, 'feedback-ip', secret), 5, 600);
    if (!perIp.allowed) {
      res.setHeader('Retry-After', String(perIp.retryAfter));
      return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' });
    }

    const rows = await sql`
      select name from visitor_logs where id::text = ${visitor.visitorId} limit 1
    `;
    const name = String((rows[0] as { name?: unknown } | undefined)?.name ?? '').trim();
    if (!name) {
      return res.status(401).json({ error: 'Sesi pengunjung tidak valid' });
    }

    await sql`
      insert into feedback (visitor_name, phone, message)
      values (${name}, ${phone}, ${message})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/feedback]', err);
    return res.status(500).json({ error: 'Gagal menyimpan masukan' });
  }
}

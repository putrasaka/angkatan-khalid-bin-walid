import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// POST /api/feedback — masukan pengunjung. Nama pengirim berasal dari sesi
// pengunjung di client; endpoint ini publik, jadi dibatasi per nama.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'DATABASE_URL belum diset di environment' });
  }

  let body: any;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
  } catch {
    return res.status(400).json({ error: 'Body tidak valid' });
  }

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim().replace(/\s+/g, ' ');
  const message = String(body.message ?? '').trim();

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Nama pengirim tidak valid' });
  }
  if (!/^[0-9+\-\s]{8,20}$/.test(phone)) {
    return res.status(400).json({ error: 'Nomor TLP wajib diisi (8-20 digit)' });
  }
  if (message.length < 3 || message.length > 1000) {
    return res.status(400).json({ error: 'Pesan harus 3-1000 karakter' });
  }

  try {
    const sql = neon(connectionString);

    // Batas 1 masukan per nama per menit. Bisa diakali dengan ganti nama —
    // tanpa penyimpanan IP/KV, ini batas yang wajar untuk situs kenangan.
    const recent = await sql`
      select 1 from feedback
      where lower(visitor_name) = lower(${name})
        and created_at > now() - interval '60 seconds'
      limit 1
    `;
    if (recent.length > 0) {
      return res.status(429).json({ error: 'Tunggu sebentar sebelum mengirim masukan lagi.' });
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

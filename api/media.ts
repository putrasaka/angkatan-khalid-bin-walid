import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// GET /api/media?t=<tabel>&id=<id>&c=<kolom>
// Menyajikan blob base64 dari database sebagai file gambar/video asli.
// Tabel & kolom dibatasi whitelist supaya nama kolom tidak bisa diinjeksi.
const COLUMNS: Record<string, string[]> = {
  students: ['photo', 'photo_large', 'photo_sd', 'photo_smp'],
  moments: ['image'],
  graduation_info: ['main_banner'],
  graduation_gallery: ['image'],
  video_moments: ['video_url', 'poster_url'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const t = String(req.query.t ?? '');
  const id = String(req.query.id ?? '');
  const c = String(req.query.c ?? '');

  if (!COLUMNS[t] || !COLUMNS[t].includes(c) || !id) {
    return res.status(400).json({ error: 'Parameter media tidak valid' });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'DATABASE_URL belum diset di environment' });
  }

  try {
    const sql = neon(connectionString);
    const rows = await sql.query(`select ${c} as v from ${t} where id::text = $1 limit 1`, [id]);
    const value = (rows[0] as { v?: string } | undefined)?.v;
    if (typeof value !== 'string') {
      return res.status(404).end();
    }

    const match = value.match(/^data:([^;,]+)(;base64)?,([\s\S]*)$/);
    if (!match) {
      // Nilai sudah berupa URL biasa (mis. Unsplash) — arahkan saja.
      return res.redirect(307, value);
    }

    const mime = match[1];
    const body = match[2]
      ? Buffer.from(match[3], 'base64')
      : Buffer.from(decodeURIComponent(match[3]));

    res.setHeader('Content-Type', mime);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // Video butuh dukungan Range agar bisa di-seek (Safari menolak tanpa ini).
    const range = req.headers.range;
    if (range) {
      const rm = /bytes=(\d*)-(\d*)/.exec(range);
      if (rm) {
        const size = body.length;
        let start = rm[1] ? Number(rm[1]) : 0;
        let end = rm[2] ? Number(rm[2]) : size - 1;
        if (!rm[1] && rm[2]) {
          start = Math.max(size - Number(rm[2]), 0);
          end = size - 1;
        }
        end = Math.min(end, size - 1);
        if (start > end || start >= size) {
          res.setHeader('Content-Range', `bytes */${size}`);
          return res.status(416).end();
        }
        const chunk = body.subarray(start, end + 1);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
        res.setHeader('Content-Length', String(chunk.length));
        return res.status(206).send(chunk);
      }
    }

    res.setHeader('Content-Length', String(body.length));
    return res.status(200).send(body);
  } catch (err) {
    console.error('[api/media]', err);
    return res.status(500).json({ error: 'Gagal memuat media' });
  }
}

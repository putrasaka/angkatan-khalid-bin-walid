import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

// GET /api/data — metadata saja. Kolom gambar/video yang masih berupa data URI
// diganti URL /api/media supaya response tetap jauh di bawah limit 4.5 MB Vercel.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return res.status(500).json({ error: 'DATABASE_URL belum diset di environment' });
  }

  try {
    const sql = neon(connectionString);

    const [students, moments, graduationInfo, graduates, gallery, videos] = await Promise.all([
      sql`select id, name, nickname, role,
            case when photo like 'data:%' then '/api/media?t=students&id=' || id || '&c=photo' else photo end as photo,
            case when photo_large like 'data:%' then '/api/media?t=students&id=' || id || '&c=photo_large' else photo_large end as photo_large,
            case when photo_sd like 'data:%' then '/api/media?t=students&id=' || id || '&c=photo_sd' else photo_sd end as photo_sd,
            case when photo_smp like 'data:%' then '/api/media?t=students&id=' || id || '&c=photo_smp' else photo_smp end as photo_smp,
            previous_school, current_school, birth_place_date, address, hobby, dream, message, impression, instagram, created_at
          from students order by created_at asc`,
      sql`select id, title,
            case when image like 'data:%' then '/api/media?t=moments&id=' || id || '&c=image' else image end as image,
            date, tag, story, created_at
          from moments order by created_at asc`,
      sql`select id,
            case when main_banner like 'data:%' then '/api/media?t=graduation_info&id=' || id || '&c=main_banner' else main_banner end as main_banner,
            title, cohort_name, date, location, description
          from graduation_info where id = 1 limit 1`,
      sql`select name from graduates order by position asc`,
      sql`select id,
            case when image like 'data:%' then '/api/media?t=graduation_gallery&id=' || id || '&c=image' else image end as image,
            caption, created_at
          from graduation_gallery order by created_at asc`,
      sql`select id, title, description,
            case when video_url like 'data:%' then '/api/media?t=video_moments&id=' || id || '&c=video_url' else video_url end as video_url,
            case when poster_url like 'data:%' then '/api/media?t=video_moments&id=' || id || '&c=poster_url' else poster_url end as poster_url,
            duration, date, created_at
          from video_moments order by created_at asc`,
    ]);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      students,
      moments,
      graduationInfo: graduationInfo[0] ?? null,
      graduates: graduates.map((row: { name: string }) => row.name),
      gallery,
      videos,
    });
  } catch (err) {
    console.error('[api/data]', err);
    return res.status(500).json({ error: 'Gagal memuat data dari database' });
  }
}

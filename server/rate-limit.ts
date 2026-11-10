import type { VercelRequest } from '@vercel/node';
import { createHash } from 'node:crypto';

// Rate limit berbasis tabel Neon. Satu statement upsert atomik supaya dua
// request bersamaan tidak bisa sama-sama lolos.

type Sql = { query: (text: string, params?: unknown[]) => Promise<any[]> };

export function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (first) {
    const ip = first.split(',')[0]?.trim();
    if (ip) return ip;
  }
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) return real.trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

export function hashKey(scope: string, value: string, secret: string): string {
  return createHash('sha256').update(`${secret}|${scope}|${value}`).digest('hex');
}

export function rateLimitKey(req: VercelRequest, scope: string, secret: string): string {
  return hashKey(scope, clientIp(req), secret);
}

export async function rateLimit(
  sql: Sql,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; retryAfter: number }> {
  const rows = await sql.query(
    `insert into rate_limits (key, window_start, count) values ($1, now(), 1)
     on conflict (key) do update set
       count = case when rate_limits.window_start < now() - make_interval(secs => $2::double precision) then 1 else rate_limits.count + 1 end,
       window_start = case when rate_limits.window_start < now() - make_interval(secs => $2::double precision) then now() else rate_limits.window_start end
     returning count,
       greatest(0, ceil(extract(epoch from (window_start + make_interval(secs => $2::double precision)) - now())))::int as retry_after`,
    [key, windowSeconds]
  );

  // Bersihkan baris lama sesekali, jangan di await.
  if (Math.random() < 0.01) {
    void sql
      .query(`delete from rate_limits where window_start < now() - interval '1 day'`)
      .catch(() => {});
  }

  return {
    allowed: Number(rows[0]?.count ?? 0) <= limit,
    retryAfter: Number(rows[0]?.retry_after ?? windowSeconds),
  };
}

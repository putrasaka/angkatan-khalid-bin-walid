// @ts-check
import { createHash } from 'node:crypto';

// Rate limit berbasis tabel Neon. Satu statement upsert atomik supaya dua
// request bersamaan tidak bisa sama-sama lolos.

/**
 * @typedef {{ query: (text: string, params?: unknown[]) => Promise<any[]> }} Sql
 */

/** @param {any} req */
export function clientIp(req) {
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

/**
 * @param {string} scope
 * @param {string} value
 * @param {string} secret
 */
export function hashKey(scope, value, secret) {
  return createHash('sha256').update(`${secret}|${scope}|${value}`).digest('hex');
}

/**
 * @param {any} req
 * @param {string} scope
 * @param {string} secret
 */
export function rateLimitKey(req, scope, secret) {
  return hashKey(scope, clientIp(req), secret);
}

/**
 * @param {Sql} sql
 * @param {string} key
 * @param {number} limit
 * @param {number} windowSeconds
 * @returns {Promise<{ allowed: boolean; retryAfter: number }>}
 */
export async function rateLimit(sql, key, limit, windowSeconds) {
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

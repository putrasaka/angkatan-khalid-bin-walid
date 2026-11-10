// @ts-check
import { createHmac, timingSafeEqual } from 'node:crypto';

// Token pengunjung bertanda tangan. Server memakai token ini untuk mengetahui
// siapa yang mengirim masukan, bukan field `name` dari body request.

/**
 * @param {string} encoded
 * @param {string} secret
 */
function sign(encoded, secret) {
  return createHmac('sha256', secret).update(encoded).digest('hex');
}

/**
 * @param {{ visitorId: string; name: string }} input
 * @param {string} secret
 * @param {number} [ttlSeconds]
 */
export function signVisitorToken(input, secret, ttlSeconds = 86400) {
  const payload = {
    vid: input.visitorId,
    name: input.name,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

/**
 * @param {string} token
 * @param {string} secret
 * @returns {{ visitorId: string; name: string } | null}
 */
export function verifyVisitorToken(token, secret) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const [encoded, signature] = parts;
  const expected = sign(encoded, secret);
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (
    typeof payload?.vid !== 'string' ||
    typeof payload?.name !== 'string' ||
    typeof payload?.exp !== 'number'
  ) {
    return null;
  }
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

  return { visitorId: payload.vid, name: payload.name };
}

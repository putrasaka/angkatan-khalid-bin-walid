// @ts-check
import { createHmac, timingSafeEqual } from 'node:crypto';

// URL media video berumur pendek. Kunci diturunkan dari secret yang sudah ada,
// dengan label terpisah supaya tidak bisa dipakai silang dengan token pengunjung.

/** @param {string} secret */
function mediaKey(secret) {
  return createHmac('sha256', secret).update('media').digest();
}

/**
 * @param {string} t
 * @param {string} id
 * @param {string} c
 * @param {string} exp
 * @param {string} secret
 */
function signature(t, id, c, exp, secret) {
  return createHmac('sha256', mediaKey(secret))
    .update(`${t}|${id}|${c}|${exp}`)
    .digest('hex');
}

/**
 * @param {string} t
 * @param {string} id
 * @param {string} c
 * @param {string} secret
 * @param {number} [ttlSeconds]
 */
export function signMediaUrl(t, id, c, secret, ttlSeconds = 7200) {
  const exp = String(Math.floor(Date.now() / 1000) + ttlSeconds);
  const sig = signature(t, id, c, exp, secret);
  return `/api/media?t=${encodeURIComponent(t)}&id=${encodeURIComponent(id)}&c=${encodeURIComponent(
    c
  )}&exp=${exp}&sig=${sig}`;
}

/**
 * @param {{ t: string; id: string; c: string; exp: string; sig: string }} params
 * @param {string} secret
 */
export function verifyMediaSignature(params, secret) {
  const { t, id, c, exp, sig } = params;
  if (!t || !id || !c || !exp || !sig) return false;
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) <= Math.floor(Date.now() / 1000)) return false;

  const expected = signature(t, id, c, exp, secret);
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

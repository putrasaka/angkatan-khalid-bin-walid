import { createHmac, timingSafeEqual } from 'node:crypto';

// URL media video berumur pendek. Kunci diturunkan dari secret yang sudah ada,
// dengan label terpisah supaya tidak bisa dipakai silang dengan token pengunjung.

function mediaKey(secret: string): Buffer {
  return createHmac('sha256', secret).update('media').digest();
}

function signature(t: string, id: string, c: string, exp: string, secret: string): string {
  return createHmac('sha256', mediaKey(secret))
    .update(`${t}|${id}|${c}|${exp}`)
    .digest('hex');
}

export function signMediaUrl(
  t: string,
  id: string,
  c: string,
  secret: string,
  ttlSeconds = 7200
): string {
  const exp = String(Math.floor(Date.now() / 1000) + ttlSeconds);
  const sig = signature(t, id, c, exp, secret);
  return `/api/media?t=${encodeURIComponent(t)}&id=${encodeURIComponent(id)}&c=${encodeURIComponent(
    c
  )}&exp=${exp}&sig=${sig}`;
}

export function verifyMediaSignature(
  params: { t: string; id: string; c: string; exp: string; sig: string },
  secret: string
): boolean {
  const { t, id, c, exp, sig } = params;
  if (!t || !id || !c || !exp || !sig) return false;
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) <= Math.floor(Date.now() / 1000)) return false;

  const expected = signature(t, id, c, exp, secret);
  const a = Buffer.from(sig, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

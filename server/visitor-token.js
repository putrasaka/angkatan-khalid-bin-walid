import { createHmac, timingSafeEqual } from 'node:crypto';

// Token pengunjung bertanda tangan. Server memakai token ini untuk mengetahui
// siapa yang mengirim masukan, bukan field `name` dari body request.

export interface VisitorTokenPayload {
  visitorId: string;
  name: string;
}

function sign(encoded: string, secret: string): string {
  return createHmac('sha256', secret).update(encoded).digest('hex');
}

export function signVisitorToken(
  input: VisitorTokenPayload,
  secret: string,
  ttlSeconds = 86400
): string {
  const payload = {
    vid: input.visitorId,
    name: input.name,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyVisitorToken(token: string, secret: string): VisitorTokenPayload | null {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const [encoded, signature] = parts;
  const expected = sign(encoded, secret);
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: any;
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

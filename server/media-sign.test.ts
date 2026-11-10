import test from 'node:test';
import assert from 'node:assert/strict';
import { signMediaUrl, verifyMediaSignature } from './media-sign';

const SECRET = 'test-secret';

function paramsFrom(url: string) {
  const q = new URL(url, 'https://example.test').searchParams;
  return {
    t: q.get('t') ?? '',
    id: q.get('id') ?? '',
    c: q.get('c') ?? '',
    exp: q.get('exp') ?? '',
    sig: q.get('sig') ?? '',
  };
}

test('URL bertanda tangan valid', () => {
  const url = signMediaUrl('video_moments', 'vid-1', 'video_url', SECRET);
  assert.equal(verifyMediaSignature(paramsFrom(url), SECRET), true);
});

test('id yang diganti ditolak', () => {
  const params = paramsFrom(signMediaUrl('video_moments', 'vid-1', 'video_url', SECRET));
  assert.equal(verifyMediaSignature({ ...params, id: 'vid-2' }, SECRET), false);
});

test('kolom yang diganti ditolak', () => {
  const params = paramsFrom(signMediaUrl('video_moments', 'vid-1', 'video_url', SECRET));
  assert.equal(verifyMediaSignature({ ...params, c: 'poster_url' }, SECRET), false);
});

test('signature diubah ditolak', () => {
  const params = paramsFrom(signMediaUrl('video_moments', 'vid-1', 'video_url', SECRET));
  const sig = params.sig.slice(0, -1) + (params.sig.endsWith('a') ? 'b' : 'a');
  assert.equal(verifyMediaSignature({ ...params, sig }, SECRET), false);
});

test('URL kedaluwarsa ditolak', () => {
  const url = signMediaUrl('video_moments', 'vid-1', 'video_url', SECRET, -1);
  assert.equal(verifyMediaSignature(paramsFrom(url), SECRET), false);
});

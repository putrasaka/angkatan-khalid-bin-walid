import test from 'node:test';
import assert from 'node:assert/strict';
import { signVisitorToken, verifyVisitorToken } from './visitor-token.js';

const SECRET = 'test-secret';

test('token valid mengembalikan identitas', () => {
  const token = signVisitorToken({ visitorId: 'abc-123', name: 'Budi' }, SECRET);
  assert.deepEqual(verifyVisitorToken(token, SECRET), { visitorId: 'abc-123', name: 'Budi' });
});

test('token yang diubah ditolak', () => {
  const token = signVisitorToken({ visitorId: 'abc-123', name: 'Budi' }, SECRET);
  const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
  assert.equal(verifyVisitorToken(tampered, SECRET), null);
});

test('secret lain ditolak', () => {
  const token = signVisitorToken({ visitorId: 'abc-123', name: 'Budi' }, SECRET);
  assert.equal(verifyVisitorToken(token, 'secret-lain'), null);
});

test('token kedaluwarsa ditolak', () => {
  const token = signVisitorToken({ visitorId: 'abc-123', name: 'Budi' }, SECRET, -1);
  assert.equal(verifyVisitorToken(token, SECRET), null);
});

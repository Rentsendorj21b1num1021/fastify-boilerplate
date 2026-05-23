import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildTestApp } from './helpers/buildTestApp';

const app = buildTestApp();

beforeAll(() => app.ready());
afterAll(() => app.close());

describe('GET /health', () => {
  it('status ok буцаана', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
  });
});

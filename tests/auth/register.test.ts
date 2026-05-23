import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { buildTestApp } from '../helpers/buildTestApp';

// Service-г mock хийнэ — DB хэрэггүй болно
vi.mock('../../src/services/auth.service', () => ({
  register: vi.fn(),
  login: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
}));

import * as authService from '../../src/services/auth.service';

const app = buildTestApp();

beforeAll(() => app.ready());
afterAll(() => app.close());

describe('POST /api/v1/auth/register', () => {
  it('амжилттай бүртгэнэ', async () => {
    const mockUser = { id: '123', name: 'Бат', email: 'bat@example.com' };
    vi.mocked(authService.register).mockResolvedValueOnce(mockUser as any);

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { name: 'Бат', email: 'bat@example.com', password: 'password123' },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({
      success: true,
      message: 'Бүртгэл амжилттай',
      data: { email: 'bat@example.com' },
    });
  });

  it('validation алдаа — email буруу', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { name: 'Бат', email: 'buruuformat', password: 'password123' },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ success: false, message: 'Validation алдаа' });
  });

  it('validation алдаа — password богино', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { name: 'Бат', email: 'bat@example.com', password: '123' },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().errors[0].field).toBe('password');
  });

  it('давхардсан email — 409', async () => {
    vi.mocked(authService.register).mockRejectedValueOnce({
      statusCode: 409,
      message: 'Email бүртгэлтэй байна',
    });

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { name: 'Бат', email: 'bat@example.com', password: 'password123' },
    });

    expect(res.statusCode).toBe(409);
    expect(res.json()).toMatchObject({ success: false, message: 'Email бүртгэлтэй байна' });
  });
});

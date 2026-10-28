import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findOneMock, compareMock, signMock } = vi.hoisted(() => ({
  findOneMock: vi.fn(),
  compareMock: vi.fn(),
  signMock: vi.fn(),
}));

vi.mock('../user/user.model.js', () => ({
  User: {
    findOne: findOneMock,
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: compareMock,
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: signMock,
  },
}));

import { loginUser } from './auth.service.js';

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-for-automated-tests';

    findOneMock.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: 'user123',
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'hashed-password',
        role: 'admin',
      }),
    });

    compareMock.mockResolvedValue(true);
    signMock.mockReturnValue('mock-jwt-token');
  });

  it('logs in successfully with valid credentials', async () => {
    const result = await loginUser({
      email: 'admin@example.com',
      password: 'correct-password',
    });

    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.email).toBe('admin@example.com');
    expect(result.user.role).toBe('admin');
    expect(result.user).not.toHaveProperty('password');
    expect(compareMock).toHaveBeenCalledWith(
      'correct-password',
      'hashed-password',
    );
  });

  it('rejects an unknown email', async () => {
    findOneMock.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    await expect(
      loginUser({
        email: 'unknown@example.com',
        password: 'some-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('rejects an incorrect password', async () => {
    compareMock.mockResolvedValue(false);

    await expect(
      loginUser({
        email: 'admin@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('rejects login when JWT_SECRET is missing', async () => {
    delete process.env.JWT_SECRET;

    await expect(
      loginUser({
        email: 'admin@example.com',
        password: 'correct-password',
      }),
    ).rejects.toThrow('JWT_SECRET is missing in the .env file');
  });
});
import type { Request, Response } from 'express';
import { loginUser } from './auth.service.js';

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        message: 'Email and password are required',
      });
      return;
    }

    const result = await loginUser({
      email: email.trim(),
      password,
    });

    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({
          message: 'Invalid email or password',
        });
        return;
      }

      if (error.message === 'JWT_SECRET is missing in the .env file') {
        res.status(500).json({
          message: 'Server authentication configuration error',
        });
        return;
      }
    }

    console.error('Login error:', error);

    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
import api from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    credentials,
  );

  return response.data;
};
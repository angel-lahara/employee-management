import api from './api';

export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  isActive?: boolean;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
}

export type UpdateEmployeeData = Partial<
  Omit<CreateEmployeeData, 'password'>
> & {
  password?: string;
  isActive?: boolean;
};

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/users');
  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.employees)) {
    return data.employees;
  }

  if (Array.isArray(data.users)) {
    return data.users;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
};

export const createEmployee = async (
  employee: CreateEmployeeData,
) => {
  const response = await api.post('/users', employee);
  return response.data;
};

export const updateEmployee = async (
  id: string,
  employee: UpdateEmployeeData,
) => {
  const response = await api.patch(`/users/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
import type { Request, Response } from 'express';
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from './user.service.js';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Internal server error';

export const listEmployees = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json({ employees });
  } catch (error) {
    console.error('List employees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, department } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      department?: string;
    };

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      password.length < 8 ||
      (department !== undefined && typeof department !== 'string')
    ) {
      res.status(400).json({
        message:
          'Valid name and email are required; password must be at least 8 characters',
      });
      return;
    }

    const employee = await createEmployee({
      name,
      email,
      password,
      department,
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
      },
    });
  } catch (error) {
    const message = getErrorMessage(error);

    if (message === 'Email already exists') {
      res.status(409).json({ message });
      return;
    }

    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
   const employee = await getEmployeeById(String(req.params.id));
    res.status(200).json({ employee });
  } catch (error) {
    const message = getErrorMessage(error);

    if (message === 'Employee not found') {
      res.status(404).json({ message });
      return;
    }

    if (message.includes('Cast to ObjectId')) {
      res.status(400).json({ message: 'Invalid employee ID' });
      return;
    }

    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const editEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, department } = req.body as {
      name?: string;
      email?: string;
      department?: string;
    };

    if (
      (name !== undefined &&
        (typeof name !== 'string' || !name.trim())) ||
      (email !== undefined &&
        (typeof email !== 'string' || !email.trim())) ||
      (department !== undefined && typeof department !== 'string') ||
      (name === undefined && email === undefined && department === undefined)
    ) {
      res.status(400).json({ message: 'Provide valid employee fields to update' });
      return;
    }

   const employee = await updateEmployee(String(req.params.id), {
  name,
  email,
  department,
});

    res.status(200).json({
      message: 'Employee updated successfully',
      employee,
    });
  } catch (error) {
    const message = getErrorMessage(error);

    if (message === 'Employee not found') {
      res.status(404).json({ message });
      return;
    }

    if (message === 'Email already exists') {
      res.status(409).json({ message });
      return;
    }

    if (message.includes('Cast to ObjectId')) {
      res.status(400).json({ message: 'Invalid employee ID' });
      return;
    }

    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeEmployee = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
   const result = await deleteEmployee(String(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    const message = getErrorMessage(error);

    if (message === 'Employee not found') {
      res.status(404).json({ message });
      return;
    }

    if (message.includes('Cast to ObjectId')) {
      res.status(400).json({ message: 'Invalid employee ID' });
      return;
    }

    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
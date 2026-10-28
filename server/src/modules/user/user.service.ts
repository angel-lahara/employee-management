import bcrypt from 'bcryptjs';
import { User } from './user.model.js';

interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
  department?: string;
}

interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  department?: string;
}

export const getAllEmployees = async () => {
  return User.find({ role: 'employee' })
    .select('-password')
    .sort({ createdAt: -1 });
};

export const createEmployee = async (input: CreateEmployeeInput) => {
  const email = input.email.trim().toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  return User.create({
    name: input.name.trim(),
    email,
    password: hashedPassword,
    role: 'employee',
    department: input.department?.trim() ?? '',
  });
};

export const updateEmployee = async (
  id: string,
  input: UpdateEmployeeInput,
) => {
  const employee = await User.findOne({ _id: id, role: 'employee' });

  if (!employee) {
    throw new Error('Employee not found');
  }

  if (input.email !== undefined) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await User.findOne({
      email,
      _id: { $ne: employee._id },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    employee.email = email;
  }

  if (input.name !== undefined) {
    employee.name = input.name.trim();
  }

  if (input.department !== undefined) {
    employee.department = input.department.trim();
  }

  await employee.save();

  return User.findById(employee._id).select('-password');
};

export const deleteEmployee = async (id: string) => {
  const employee = await User.findOneAndDelete({
    _id: id,
    role: 'employee',
  });

  if (!employee) {
    throw new Error('Employee not found');
  }

  return { message: 'Employee deleted successfully' };
};

export const getEmployeeById = async (id: string) => {
  const employee = await User.findOne({
    _id: id,
    role: 'employee',
  }).select('-password');

  if (!employee) {
    throw new Error('Employee not found');
  }

  return employee;
};
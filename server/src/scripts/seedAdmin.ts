import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import { User } from '../modules/user/user.model.js';

dotenv.config();

const seedAdmin = async (): Promise<void> => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        'ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env',
      );
    }

    if (password.length < 8) {
      throw new Error('Admin password must be at least 8 characters long');
    }

    await connectDB();

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('A user with this admin email already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin account created successfully!');
    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error('Admin seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void seedAdmin();
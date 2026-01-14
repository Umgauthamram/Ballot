import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    //this can be changed and user can be created by running " node seedAdmin.js "
    const adminUser = new User({
      name: 'App Admin',
      studentId: 'SYSADMIN',
      email: 'admin@system.com',
      password: hashedPassword,
      department: 'GENERAL',
      collegeName: 'System Administration',
      role: 'ADMIN',
      status: 'active'
    });

    await adminUser.save();
    process.exit();
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
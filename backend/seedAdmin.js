import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js'; 
import {connectDB} from './config/db.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt); 

    //this can be changed and user can be created by running " node seedAdmin.js "
    const adminUser = new User({
      name: 'App Admin',     
      studentId: 'SYSADMIN',    
      email: 'admin@system.com',
      password: hashedPassword,
      department: 'GENERAL',
      role: 'ADMIN',
      status: 'verified',
      idCardUrl: 'ADMIN_BADGE'
    });

    await adminUser.save();
    console.log('Admin User Created!');
    console.log('Login ID: SYSADMIN');
    console.log('Password: admin123');
    process.exit();
  } catch (error) {
    console.error(' Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
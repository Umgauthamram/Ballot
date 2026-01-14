import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import { connectDB } from './config/db.js';
import { sendCredentialsEmail } from './utils/emailService.js';

dotenv.config();
connectDB();

// EDIT THIS ARRAY TO ADD STUDENTS
const studentsToSeed = [
    {
        name: "gautham",
        studentId: "CS101",
        email: "gauthamram.um@gmail.com",
        department: "COMPUTER_SCIENCE",
        collegeName: "Alliance university"
    },
    // {
    //     name: "Jane Smith",
    //     studentId: "ME102",
    //     email: "jane@ballot.com",
    //     department: "ENGINEERING",
    //     collegeName: "Tech Institute"
    // },
    // {
    //     name: "Alice Johnson",
    //     studentId: "AR103",
    //     email: "alice@ballot.com",
    //     department: "ARTS",
    //     collegeName: "City Arts College"
    // }
];

const generatePassword = () => Math.random().toString(36).slice(-8);

const seedStudents = async () => {
    try {
        console.log('--- SEEDING STUDENTS ---');

        for (const student of studentsToSeed) {
            // Check existence
            const exists = await User.findOne({
                $or: [{ email: student.email }, { studentId: student.studentId }]
            });

            if (exists) {
                console.log(`[SKIP] ${student.name} (${student.studentId}) - Already exists`);
                continue;
            }

            // Generate credentials
            const password = generatePassword();
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create User
            await User.create({
                name: student.name,
                email: student.email,
                studentId: student.studentId,
                department: student.department,
                collegeName: student.collegeName || "Unknown Institute",
                password: hashedPassword,
                role: 'STUDENT',
                status: 'active',
                isPasswordChanged: false
            });

            // Send Email
            await sendCredentialsEmail(student.email, student.name, student.studentId, password);

            console.log(`[CREATED] ${student.name}`);
            console.log(`   ID: ${student.studentId}`);
            console.log(`   Email: ${student.email}`);
            console.log(`   Password: ${password}`); // Log cleartext password for admin to note down
            console.log('-------------------------');
        }

        console.log('--- SEEDING COMPLETE ---');
        process.exit();
    } catch (error) {
        console.error('Error seeding students:', error.message);
        process.exit(1);
    }
};

seedStudents();

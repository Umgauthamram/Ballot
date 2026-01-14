import User from '../models/User.js';
import { sendCredentialsEmail } from '../utils/emailService.js';
import bcrypt from 'bcryptjs';

// Helper to generate random password
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};

export const generateUsers = async (req, res) => {
    try {
        const { users } = req.body; // Expecting array of { name, email, studentId, department }

        const results = {
            success: [],
            failed: []
        };

        for (const userData of users) {
            try {
                // Validate required fields
                if (!userData.name || !userData.email || !userData.studentId || !userData.department || !userData.collegeName) {
                    results.failed.push({ ...userData, reason: 'Missing required fields' });
                    continue;
                }

                // Check if user exists
                const exists = await User.findOne({ $or: [{ email: userData.email }, { studentId: userData.studentId }] });
                if (exists) {
                    results.failed.push({ ...userData, reason: 'User already exists' });
                    continue;
                }

                const password = generatePassword();
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = await User.create({
                    name: userData.name,
                    email: userData.email,
                    studentId: userData.studentId,
                    department: userData.department,
                    collegeName: userData.collegeName,
                    password: hashedPassword,
                    role: 'STUDENT',
                    status: 'active',
                    isPasswordChanged: false
                });

                // Send Email
                await sendCredentialsEmail(userData.email, userData.name, userData.studentId, password);

                results.success.push({
                    name: newUser.name,
                    email: newUser.email,
                    studentId: newUser.studentId
                });

            } catch (error) {
                results.failed.push({ ...userData, reason: error.message });
            }
        }

        res.json({ message: 'User generation complete', results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

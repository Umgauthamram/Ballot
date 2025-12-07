import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const signup = async (req, res) => {
  try {
    const { name, studentId, email, password, department } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, studentId, email, department,
      password: hashedPassword,
      role: 'STUDENT' 
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: false,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  
  const user = await User.findOne({ 
    $or: [{ email: identifier }, { studentId: identifier }] 
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      department: user.department,
      isAdmin: user.role === 'ADMIN',
      status: user.status,
      votedPollIds: user.votedPollIds,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
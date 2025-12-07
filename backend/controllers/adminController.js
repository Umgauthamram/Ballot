import User from '../models/User.js';
import Poll from '../models/Poll.js';

export const uploadId = async (req, res) => {
  try {
    const userId = req.user.id; 
    const imageUrl = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(userId, {
      status: 'pending',
      idCardUrl: imageUrl
    });

    res.json({ message: 'ID Uploaded', url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId, isApproved } = req.body;
    const status = isApproved ? 'verified' : 'rejected';
    
    await User.findByIdAndUpdate(userId, { status });
    res.json({ message: `User ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'STUDENT' }).select('-password');
  res.json(users);
};

export const createPoll = async (req, res) => {
  const { title, description, eligibility, candidates } = req.body;
  
  const formattedCandidates = candidates.map(name => ({ name, manifesto: "Standard Manifesto" }));

  const poll = await Poll.create({
    title, description, eligibility, candidates: formattedCandidates
  });
  res.status(201).json(poll);
};
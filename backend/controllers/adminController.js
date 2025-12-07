import User from '../models/User.js';
import Poll from '../models/Poll.js';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const abiPath = path.join(__dirname, '../config/Voting.json');
const contractJSON = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractJSON.abi, wallet);

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

// export const createPoll = async (req, res) => {
//   const { title, description, eligibility, candidates } = req.body;
  
//   const formattedCandidates = candidates.map(name => ({ name, manifesto: "Standard Manifesto" }));

//   const poll = await Poll.create({
//     title, description, eligibility, candidates: formattedCandidates
//   });
//   res.status(201).json(poll);
// };

export const createPoll = async (req, res) => {
  const { title, description, eligibility, candidates } = req.body;
  
  try {
    console.log("1. Initiating Blockchain Transaction...");
    
    //Create on Blockchain First and We pass a dummy IPFS hash for now, and the candidate names
    const tx = await contract.createPoll("ipfs_placeholder", candidates);
    console.log(`   Tx Hash: ${tx.hash}`);
    
    // Wait for block confirmation
    const receipt = await tx.wait();
    console.log("   Block Confirmed!");

    // B. Get the Poll ID from the Blockchain Event
    const pollCount = await contract.pollCount();
    const blockchainPollId = pollCount.toString();

    console.log(`2. Creating Database Entry (Chain ID: ${blockchainPollId})...`);

    const formattedCandidates = candidates.map(name => ({ 
      name, 
      manifesto: "Standard Manifesto" 
    }));

    const poll = await Poll.create({
      title, 
      description, 
      eligibility, 
      candidates: formattedCandidates,
      blockchainId: blockchainPollId
    });

    res.status(201).json(poll);

  } catch (error) {
    console.error("Creation Failed:", error);
    res.status(500).json({ message: "Blockchain Transaction Failed: " + error.message });
  }
};

export const togglePollStatus = async (req, res) => {
  try {
    const { pollId, status } = req.body;
    
    if (!['UPCOMING', 'ACTIVE', 'ENDED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const poll = await Poll.findByIdAndUpdate(
      pollId, 
      { status }, 
      { new: true } 
    );

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
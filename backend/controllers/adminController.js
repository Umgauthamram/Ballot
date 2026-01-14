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

import { sendCredentialsEmail } from '../utils/emailService.js';
import bcrypt from 'bcryptjs';

// generateUsers moved to userGenController.js

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'STUDENT' }).select('-password');
  res.json(users);
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await User.find().distinct('department');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  const { title, description, eligibility, candidates, durationInHours } = req.body;

  try {
    const formattedCandidates = candidates.map(name => ({ name, manifesto: "Standard Manifesto" }));

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (durationInHours || 24) * 60 * 60 * 1000); // Default 24h

    // 1. Create on Blockchain
    console.log("Creating Poll on Blockchain...");
    const pollMetadata = JSON.stringify({ title, description, eligibility }); // Simulating IPFS hash
    const tx = await contract.createPoll(pollMetadata, candidates);
    console.log("Tx Sent:", tx.hash);

    const receipt = await tx.wait();

    // 2. Get Poll ID from Events
    let blockchainId = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog.name === 'PollCreated') {
          blockchainId = parsedLog.args.pollId.toString();
          break;
        }
      } catch (e) {
        // Ignore logs from other contracts or unparsable logs
      }
    }

    if (!blockchainId) throw new Error("Failed to retrieve Blockchain Poll ID");
    console.log("Blockchain Poll ID:", blockchainId);

    // 3. Save to MongoDB
    const poll = await Poll.create({
      title, description, eligibility, candidates: formattedCandidates,
      startTime, endTime, status: 'UPCOMING',
      blockchainId: blockchainId
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error("Poll Creation Failed:", error);
    // Ensure headers aren't sent if they were already sent (though unlikely here)
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to create election" });
    }
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
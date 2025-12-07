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



export const castVote = async (req, res) => {
  const { pollId, candidateId } = req.body;
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId);
    if (user.status !== 'verified') return res.status(403).json({ message: 'User not verified' });
    if (user.votedPollIds.includes(pollId)) return res.status(400).json({ message: 'Already voted' });

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    // 2. Map MongoDB Candidate ID to Blockchain Index (0, 1, 2 & ...)
    const candidateIndex = poll.candidates.findIndex(c => c._id.toString() === candidateId);
    if (candidateIndex === -1) return res.status(400).json({ message: 'Invalid Candidate' });

    // 3. Generate Anonymized User Hash
    // We hash the Student ID so the blockchain knows unique voters without knowing NAMES.
    const userHash = ethers.keccak256(ethers.toUtf8Bytes(user.studentId));

    console.log(`Voting on Blockchain Poll: ${poll.blockchainId}, Cand: ${candidateIndex}, User: ${user.studentId}`);

    // 4. Send Transaction (Backend Pays Gas)
    // We use poll.blockchainId (or default to pollId if you didn't update model yet)
    // Note: If you haven't updated Poll model yet, rely on the fact that Mongo polls usually don't match Chain IDs directly. 
    const chainPollId = poll.blockchainId || 1; 

    const tx = await contract.vote(chainPollId, candidateIndex, userHash);
    console.log(`   Tx Sent: ${tx.hash}`);
    
    await tx.wait();
    console.log("   Vote Confirmed ");

    poll.candidates[candidateIndex].voteCount += 1;
    await poll.save();

    user.votedPollIds.push(pollId);
    await user.save();

    res.json({ message: 'Vote Cast Successfully', txHash: tx.hash });

  } catch (error) {
    console.error("Voting Failed:", error);
    if (error.reason && error.reason.includes("User has already voted")) {
       return res.status(400).json({ message: "Blockchain rejected: Already voted." });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPolls = async (req, res) => {
  const polls = await Poll.find({});
  res.json(polls);
};
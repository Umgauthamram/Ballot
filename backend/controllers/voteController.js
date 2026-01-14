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
    // if (user.status !== 'verified') return res.status(403).json({ message: 'User not verified' });
    if (user.votedPollIds.includes(pollId)) return res.status(400).json({ message: 'Already voted' });

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    if (poll.status === 'ENDED' || new Date() > new Date(poll.endTime)) {
      return res.status(400).json({ message: 'Election has ended' });
    }

    // 2. Map MongoDB Candidate ID to Blockchain Index (0, 1, 2 & ...)
    const candidateIndex = poll.candidates.findIndex(c => c._id.toString() === candidateId);
    if (candidateIndex === -1) return res.status(400).json({ message: 'Invalid Candidate' });

    // 3. Generate Anonymized User Hash
    const userHash = ethers.keccak256(ethers.toUtf8Bytes(user.studentId));

    // 4. Send Transaction (Only if Poll is on Blockchain)
    let txHash = "0xMOCK_" + Math.random().toString(16).substr(2, 40);

    if (poll.blockchainId) {
      try {
        console.log(`Voting on Blockchain Poll: ${poll.blockchainId}, Cand: ${candidateIndex}, User: ${user.studentId}`);
        const tx = await contract.vote(poll.blockchainId, candidateIndex, userHash);
        console.log(`   Tx Sent: ${tx.hash}`);
        await tx.wait();
        console.log("   Vote Confirmed on Chain");
        txHash = tx.hash;
      } catch (err) {
        console.error("Blockchain Vote Failed:", err);
        // If already voted on chain, we allow syncing to DB. Otherwise throw.
        if (err.reason && err.reason.includes("User has already voted")) {
          console.log("   Identified as Duplicate Vote on Chain. Syncing DB...");
        } else {
          throw err; // Real error (gas, network) -> fail the request
        }
      }
    } else {
      console.log("   Local Poll (No Blockchain ID): Skipping Contract Call");
    }

    // 5. Update MongoDB (Dual-Write / Sync)
    poll.candidates[candidateIndex].voteCount += 1;
    await poll.save(); // Restored to ensure vote count updates

    user.votedPollIds.push(pollId);
    await user.save();

    res.json({ message: 'Vote Cast Successfully', txHash });

  } catch (error) {
    console.error("Voting Failed:", error);
    if (error.reason && error.reason.includes("User has already voted")) {
      // Sync DB: If blockchain has it but DB doesn't, fix DB.
      if (!user.votedPollIds.includes(pollId)) {
        user.votedPollIds.push(pollId);
        await user.save();
      }
      return res.status(400).json({ message: "Note: Vote was already recorded on chain. Dashboard updated." });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPolls = async (req, res) => {
  const polls = await Poll.find({});
  res.json(polls);
};
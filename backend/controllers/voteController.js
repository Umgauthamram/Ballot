import User from '../models/User.js';
import Poll from '../models/Poll.js';

export const castVote = async (req, res) => {
  const { pollId, candidateId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (user.status !== 'verified') return res.status(403).json({ message: 'User not verified' });
    if (user.votedPollIds.includes(pollId)) return res.status(400).json({ message: 'Already voted' });

    // 2. Blockchain Logic (To be added in next step)
    // await web3Provider.voteOnChain(pollId, candidateId);
    
    const poll = await Poll.findById(pollId);
    const candidate = poll.candidates.id(candidateId);
    
    candidate.voteCount += 1;
    await poll.save();

    user.votedPollIds.push(pollId);
    await user.save();

    res.json({ message: 'Vote Cast Successfully', txHash: '0xMOCK_HASH_UNTIL_WEB3_ADDED' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPolls = async (req, res) => {
  const polls = await Poll.find({});
  res.json(polls);
};
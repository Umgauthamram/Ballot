import mongoose from 'mongoose';

const candidateSchema = mongoose.Schema({
  name: String,
  manifesto: String,
  voteCount: { type: Number, default: 0 }
});

const pollSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  eligibility: { type: String, required: true }, // 'ALL' or 'DEPT_NAME'
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['UPCOMING', 'ACTIVE', 'ENDED'], default: 'UPCOMING' },
  candidates: [candidateSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blockchainId: { type: String }
}, { timestamps: true });

export default mongoose.model('Poll', pollSchema);
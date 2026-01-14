import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  collegeName: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isPasswordChanged: { type: Boolean, default: false },
  votedPollIds: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
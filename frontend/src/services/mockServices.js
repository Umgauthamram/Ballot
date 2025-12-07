

export const INITIAL_POLLS = [
  {
    id: 'p1',
    title: 'STUDENT BODY PRESIDENT 2024',
    description: 'Election for the primary representative of the student union.',
    status: 'ACTIVE',
    eligibility: 'ALL',
    candidates: [
      { id: 'c1', name: 'ALEXEI VOLKOV', manifesto: 'Optimization of campus resource allocation protocols.', voteCount: 142 },
      { id: 'c2', name: 'SARAH CHEN', manifesto: 'Implementation of mandatory digital literacy modules.', voteCount: 189 },
    ]
  },
  {
    id: 'p2',
    title: 'CS DEPT HEAD REPRESENTATIVE',
    description: 'Representative for Computer Science resource allocation.',
    status: 'UPCOMING',
    eligibility: 'COMPUTER_SCIENCE',
    candidates: [
      { id: 'c3', name: 'MARCUS VANE', manifesto: '24/7 Lab Access and Server Upgrades.', voteCount: 0 },
      { id: 'c4', name: 'JANE DOE', manifesto: 'Hackathon funding increase.', voteCount: 0 },
    ]
  }
];

export const INITIAL_USERS = [
  {
    id: 'u1',
    name: 'Student 001',
    studentId: '2024001',
    email: 's1@campus.edu',
    collegeName: 'Polytechnic Institute',
    department: 'COMPUTER_SCIENCE',
    status: 'unverified',
    votedPollIds: [],
    password: 'password'
  },
  {
    id: 'u2',
    name: 'Student 002',
    studentId: '2024002',
    email: 's2@campus.edu',
    collegeName: 'Polytechnic Institute',
    department: 'ARTS',
    status: 'pending',
    votedPollIds: [],
    idImageUrl: 'https://picsum.photos/400/600',
    password: 'password'
  },
  {
    id: 'u3',
    name: 'Verified Student',
    studentId: '2024003',
    email: 'verified@campus.edu',
    collegeName: 'Polytechnic Institute',
    department: 'BUSINESS',
    status: 'verified',
    votedPollIds: [],
    password: 'password'
  },
  {
    id: 'admin',
    name: 'System Admin',
    studentId: 'ADMIN',
    email: 'admin@sys.edu',
    collegeName: 'Polytechnic Institute',
    department: 'GENERAL',
    status: 'verified',
    votedPollIds: [],
    isAdmin: true,
    password: 'admin'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    hash: '0x7f2a9c1e3f8bd4e1',
    pollTitle: 'PRESIDENT 2023',
    candidateName: 'SARAH CHEN',
    timestamp: '10:42:15 AM',
    voterHash: '0x99a1...b2f'
  }
];

export const INITIAL_VOTE_HISTORY = [];

// export const generateHash = () => {
//   const full = '0x' + Array(64)
//     .fill(0)
//     .map(() => Math.floor(Math.random() * 16).toString(16))
//     .join('');
//   return full.slice(0, 10) + '...' + full.slice(-6);
// };

// export const getCurrentTime = () => {
//   return new Date().toLocaleTimeString('en-US', {
//     hour12: true,
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit'
//   });
// };

export const generateHash = () => {
  const full = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  return full.slice(0, 10) + '...' + full.slice(-6);
};

export const getCurrentTime = () => new Date().toLocaleTimeString('en-US', {
  hour12: true,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
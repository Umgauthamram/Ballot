import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_POLLS,
  INITIAL_USERS,
  INITIAL_TRANSACTIONS,
  INITIAL_VOTE_HISTORY,
  generateHash,
  getCurrentTime
} from './services/mockServices.js';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [polls, setPolls] = useState(INITIAL_POLLS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [voteHistory, setVoteHistory] = useState(INITIAL_VOTE_HISTORY);
  const [currentView, setCurrentView] = useState('LANDING');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const setView = (view) => setCurrentView(view);

  const login = (identifier, password) => {
    const user = users.find(u =>
      (u.studentId === identifier || u.email === identifier) &&
      u.password === password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user)); 
      setView(user.isAdmin ? 'ADMIN_PANEL' : 'STUDENT_DASHBOARD');
      return true;
    }
    return false;
  };

  const signup = (data) => {
    const newUser = {
      id: `u${Date.now()}`,
      name: data.name || 'Anonymous Voter',
      studentId: data.studentId || `TEMP${Date.now()}`,
      email: data.email || '',
      department: data.department || 'GENERAL',
      collegeName: 'Polytechnic Institute',
      status: 'unverified',
      password: data.password || 'password',
      votedPollIds: [],
      isAdmin: false
    };
    setUsers(prev => [...prev, newUser]);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); 
    setView('LANDING');
  };

const uploadId = async (file) => {
    await new Promise(res => setTimeout(res, 1500));
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        status: 'pending',
        idImageUrl: URL.createObjectURL(file)
      };
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // ← Persist
    }
  };

  const verifyUser = (userId, isApproved) => {
    setUsers(prev => prev.map(u =>
      u.id === userId
        ? { ...u, status: isApproved ? 'verified' : 'rejected' }
        : u
    ));
  };

  const createPoll = (pollData) => {
    const newPoll = {
      id: `p${Date.now()}`,
      title: pollData.title,
      description: pollData.description,
      eligibility: pollData.eligibility,
      status: 'UPCOMING',
      candidates: pollData.candidates.map((name, idx) => ({
        id: `c${Date.now()}-${idx}`,
        name,
        manifesto: 'Manifesto pending approval...',
        voteCount: 0
      }))
    };
    setPolls(prev => [...prev, newPoll]);
  };

  const togglePollStatus = (pollId, status) => {
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, status } : p));
  };

  const castVote = async (pollId, candidateId) => {
    await new Promise(res => setTimeout(res, 3000));
    const poll = polls.find(p => p.id === pollId);
    if (!poll || !currentUser) throw new Error('Invalid vote');

    const candidate = poll.candidates.find(c => c.id === candidateId);
    if (!candidate) throw new Error('Candidate not found');

    setPolls(prev => prev.map(p =>
      p.id === pollId
        ? {
            ...p,
            candidates: p.candidates.map(c =>
              c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
            )
          }
        : p
    ));

    const newTx = {
      hash: generateHash(),
      pollTitle: poll.title,
      candidateName: candidate.name,
      timestamp: getCurrentTime(),
      voterHash: generateHash()
    };
    setTransactions(prev => [newTx, ...prev]);

    const newRecord = {
      pollId: poll.id,
      pollTitle: poll.title,
      candidateName: candidate.name,
      timestamp: getCurrentTime()
    };
    setVoteHistory(prev => [newRecord, ...prev]);

    const updatedUser = {
      ...currentUser,
      votedPollIds: [...currentUser.votedPollIds, pollId]
    };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser)); 
  };

  const changePassword = (oldPw, newPw) => {
    if (!currentUser || oldPw !== currentUser.password) return false;
    const updatedUser = { ...currentUser, password: newPw };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      polls,
      transactions,
      voteHistory,
      currentView,
      setView,
      login,
      signup,
      logout,
      uploadId,
      verifyUser,
      createPoll,
      togglePollStatus,
      castVote,
      changePassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
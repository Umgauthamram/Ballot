// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {
//   INITIAL_POLLS,
//   INITIAL_USERS,
//   INITIAL_TRANSACTIONS,
//   INITIAL_VOTE_HISTORY,
//   generateHash,
//   getCurrentTime
// } from './services/mockServices.js';

// const AppContext = createContext(undefined);

// export const AppProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState(INITIAL_USERS);
//   const [polls, setPolls] = useState(INITIAL_POLLS);
//   const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
//   const [voteHistory, setVoteHistory] = useState(INITIAL_VOTE_HISTORY);
//   const [currentView, setCurrentView] = useState('LANDING');

//   useEffect(() => {
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       try {
//         const user = JSON.parse(savedUser);
//         setCurrentUser(user);
//       } catch (e) {
//         localStorage.removeItem('currentUser');
//       }
//     }
//   }, []);

//   const setView = (view) => setCurrentView(view);

//   const login = (identifier, password) => {
//     const user = users.find(u =>
//       (u.studentId === identifier || u.email === identifier) &&
//       u.password === password
//     );

//     if (user) {
//       setCurrentUser(user);
//       localStorage.setItem('currentUser', JSON.stringify(user)); 
//       setView(user.isAdmin ? 'ADMIN_PANEL' : 'STUDENT_DASHBOARD');
//       return true;
//     }
//     return false;
//   };

//   const signup = (data) => {
//     const newUser = {
//       id: `u${Date.now()}`,
//       name: data.name || 'Anonymous Voter',
//       studentId: data.studentId || `TEMP${Date.now()}`,
//       email: data.email || '',
//       department: data.department || 'GENERAL',
//       collegeName: 'Polytechnic Institute',
//       status: 'unverified',
//       password: data.password || 'password',
//       votedPollIds: [],
//       isAdmin: false
//     };
//     setUsers(prev => [...prev, newUser]);
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     localStorage.removeItem('currentUser'); 
//     setView('LANDING');
//   };

// const uploadId = async (file) => {
//     await new Promise(res => setTimeout(res, 1500));
//     if (currentUser) {
//       const updatedUser = {
//         ...currentUser,
//         status: 'pending',
//         idImageUrl: URL.createObjectURL(file)
//       };
//       setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
//       setCurrentUser(updatedUser);
//       localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // ← Persist
//     }
//   };

//   const verifyUser = (userId, isApproved) => {
//     setUsers(prev => prev.map(u =>
//       u.id === userId
//         ? { ...u, status: isApproved ? 'verified' : 'rejected' }
//         : u
//     ));
//   };

//   const createPoll = (pollData) => {
//     const newPoll = {
//       id: `p${Date.now()}`,
//       title: pollData.title,
//       description: pollData.description,
//       eligibility: pollData.eligibility,
//       status: 'UPCOMING',
//       candidates: pollData.candidates.map((name, idx) => ({
//         id: `c${Date.now()}-${idx}`,
//         name,
//         manifesto: 'Manifesto pending approval...',
//         voteCount: 0
//       }))
//     };
//     setPolls(prev => [...prev, newPoll]);
//   };

//   const togglePollStatus = (pollId, status) => {
//     setPolls(prev => prev.map(p => p.id === pollId ? { ...p, status } : p));
//   };

//   const castVote = async (pollId, candidateId) => {
//     await new Promise(res => setTimeout(res, 3000));
//     const poll = polls.find(p => p.id === pollId);
//     if (!poll || !currentUser) throw new Error('Invalid vote');

//     const candidate = poll.candidates.find(c => c.id === candidateId);
//     if (!candidate) throw new Error('Candidate not found');

//     setPolls(prev => prev.map(p =>
//       p.id === pollId
//         ? {
//             ...p,
//             candidates: p.candidates.map(c =>
//               c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c
//             )
//           }
//         : p
//     ));

//     const newTx = {
//       hash: generateHash(),
//       pollTitle: poll.title,
//       candidateName: candidate.name,
//       timestamp: getCurrentTime(),
//       voterHash: generateHash()
//     };
//     setTransactions(prev => [newTx, ...prev]);

//     const newRecord = {
//       pollId: poll.id,
//       pollTitle: poll.title,
//       candidateName: candidate.name,
//       timestamp: getCurrentTime()
//     };
//     setVoteHistory(prev => [newRecord, ...prev]);

//     const updatedUser = {
//       ...currentUser,
//       votedPollIds: [...currentUser.votedPollIds, pollId]
//     };
//     setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
//     setCurrentUser(updatedUser);
//     localStorage.setItem('currentUser', JSON.stringify(updatedUser)); 
//   };

//   const changePassword = (oldPw, newPw) => {
//     if (!currentUser || oldPw !== currentUser.password) return false;
//     const updatedUser = { ...currentUser, password: newPw };
//     setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
//     setCurrentUser(updatedUser);
//     localStorage.setItem('currentUser', JSON.stringify(updatedUser));
//     return true;
//   };

//   return (
//     <AppContext.Provider value={{
//       currentUser,
//       users,
//       polls,
//       transactions,
//       voteHistory,
//       currentView,
//       setView,
//       login,
//       signup,
//       logout,
//       uploadId,
//       verifyUser,
//       createPoll,
//       togglePollStatus,
//       castVote,
//       changePassword
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) throw new Error('useApp must be used within AppProvider');
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import * as API from './services/apiServices'; 

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [transactions, setTransactions] = useState([]); 

  const [voteHistory, setVoteHistory] = useState(() => {
    const savedHistory = localStorage.getItem('voteHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [currentView, setCurrentView] = useState('LANDING');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          const pollsData = await API.fetchPollsAPI();
          const formattedPolls = pollsData.map(p => ({ ...p, id: p._id }));
          setPolls(formattedPolls);

          if (currentUser.isAdmin) {
            const usersData = await API.fetchAllUsersAPI();
            const formattedUsers = usersData.map(u => ({ ...u, id: u._id }));
            setUsers(formattedUsers);
          }
        } catch (error) {
          console.error("Failed to load data", error);
        }
      }
    };
    loadData();
  }, [currentUser, currentView]); 


  const setView = (view) => setCurrentView(view);

  const login = async (identifier, password) => {
    try {
      const user = await API.loginAPI(identifier, password);
      user.votedPollIds = user.votedPollIds || [];
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setView(user.isAdmin ? 'ADMIN_PANEL' : 'STUDENT_DASHBOARD');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const signup = async (data) => {
    try {
      const user = await API.signupAPI(data);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setView('LANDING');
  };

  const uploadId = async (file) => {
    try {
      setLoading(true);
      const { url } = await API.uploadIdAPI(file);
      
      const updatedUser = { ...currentUser, status: 'pending', idCardUrl: url };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId, isApproved) => {
    try {
      await API.verifyUserAPI(userId, isApproved);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: isApproved ? 'verified' : 'rejected' } : u
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const createPoll = async (pollData) => {
    try {
      await API.createPollAPI(pollData);
      const pollsData = await API.fetchPollsAPI();
      setPolls(pollsData.map(p => ({ ...p, id: p._id })));
    } catch (error) {
      console.error(error);
    }
  };



  const castVote = async (pollId, candidateId) => {
    try {
      await API.castVoteAPI(pollId, candidateId);

      const updatedUser = { 
        ...currentUser, 
        votedPollIds: [...currentUser.votedPollIds, pollId] 
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const poll = polls.find(p => p.id === pollId);
      const candidate = poll?.candidates.find(c => (c._id === candidateId || c.id === candidateId));
      
      const newRecord = {
        pollId: pollId,
        pollTitle: poll?.title || "Unknown Election",
        candidateName: candidate?.name || "Unknown Candidate",
        timestamp: new Date().toLocaleString() 
      };

      const updatedHistory = [newRecord, ...voteHistory];
      setVoteHistory(updatedHistory);
      localStorage.setItem('voteHistory', JSON.stringify(updatedHistory));

      const newTx = {
        hash: "0x" + Math.random().toString(16).substr(2, 40),
        pollTitle: poll?.title,
        candidateName: candidate?.name,
        timestamp: new Date().toLocaleTimeString(),
      };
      setTransactions(prev => [newTx, ...prev]);

    } catch (error) {
      console.error(error);
      alert("Vote Failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

 const togglePollStatus = async (pollId, status) => {
    try {
      await API.togglePollStatusAPI(pollId, status);
      
      setPolls(prev => prev.map(p => 
        p.id === pollId ? { ...p, status } : p
      ));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update poll status");
    }
  };

  const changePassword = () => {
    console.log("Feature pending API implementation");
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
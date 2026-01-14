import React, { createContext, useContext, useState, useEffect } from 'react';
import * as API from './services/apiServices';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [polls, setPolls] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [departments, setDepartments] = useState([]); // Added missing state
  const [currentView, setCurrentView] = useState('LANDING');

  const [voteHistory, setVoteHistory] = useState(() => {
    const savedHistory = localStorage.getItem('voteHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Restore session
  useEffect(() => {
    const initSession = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);

          try {
            const freshUser = await API.fetchCurrentUserAPI();
            freshUser.token = user.token;
            setCurrentUser(freshUser);
            localStorage.setItem('currentUser', JSON.stringify(freshUser));
          } catch (err) {
            console.error("Session refresh failed", err);
            if (err.response?.status === 401) localStorage.removeItem('currentUser');
          }
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    };
    initSession();
  }, []);

  // Fetch Data based on User Role
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Always fetch polls for authenticated users
        const pollsData = await API.fetchPollsAPI();
        setPolls(pollsData.map(p => ({ ...p, id: p._id })));

        // Fetch Admin specific data
        if (currentUser.isAdmin) {
          const [usersData, deptsData] = await Promise.all([
            API.fetchAllUsersAPI(),
            API.fetchDepartmentsAPI()
          ]);
          setUsers(usersData.map(u => ({ ...u, id: u._id })));
          setDepartments(deptsData);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, [currentUser]);

  const setView = (view) => setCurrentView(view);

  const login = async (identifier, password) => {
    try {
      const user = await API.loginAPI(identifier, password);
      // Ensure votedPollIds exists
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
      await API.signupAPI(data);
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

  const generateUsers = async (usersData) => {
    try {
      const result = await API.generateUsersAPI(usersData);

      if (currentUser?.isAdmin) {
        // Refresh users list
        const usersData = await API.fetchAllUsersAPI();
        const formattedUsers = usersData.map(u => ({ ...u, id: u._id }));
        setUsers(formattedUsers);

        // Refresh departments in case new ones were added
        const deptsData = await API.fetchDepartmentsAPI();
        setDepartments(deptsData);
      }
      return { success: true, ...result };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || 'Generation failed' };
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

      // Update local user state
      const updatedUser = {
        ...currentUser,
        votedPollIds: [...(currentUser.votedPollIds || []), pollId]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Refresh polls to show updated counts
      const pollsData = await API.fetchPollsAPI();
      const updatedPolls = pollsData.map(p => ({ ...p, id: p._id }));
      setPolls(updatedPolls);

      // Generate local history record
      const poll = updatedPolls.find(p => p.id === pollId);
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

      // Mock Transaction for UI (since we aren't fully using blockchain return values yet)
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

  const changePassword = async (oldPw, newPw) => {
    try {
      await API.changePasswordAPI(oldPw, newPw);

      // Update local state to reflect change immediately
      const updatedUser = { ...currentUser, isPasswordChanged: true };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update password"
      };
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      polls,
      transactions,
      departments,
      voteHistory,
      currentView,
      setView,
      login,
      signup,
      logout,
      generateUsers,
      createPoll,
      togglePollStatus,
      castVote,
      changePassword,
      // Export API functions for components that might need them directly
      signupAPI: API.signupAPI,
      fetchCurrentUserAPI: API.fetchCurrentUserAPI,
      generateUsersAPI: API.generateUsersAPI,
      createPollAPI: API.createPollAPI,
      fetchAllUsersAPI: API.fetchAllUsersAPI,
      fetchDepartmentsAPI: API.fetchDepartmentsAPI,
      fetchPollsAPI: API.fetchPollsAPI,
      castVoteAPI: API.castVoteAPI,
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
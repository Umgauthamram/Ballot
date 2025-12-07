import api from '../../api/axios';

export const loginAPI = async (identifier, password) => {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data;
};

export const signupAPI = async (userData) => {
  const { data } = await api.post('/auth/signup', userData);
  return data;
};

export const verifyUserAPI = async (userId, isApproved) => {
  const { data } = await api.patch('/admin/verify', { userId, isApproved });
  return data;
};

export const uploadIdAPI = async (file) => {
  const formData = new FormData();
  formData.append('idCard', file);
  
  const { data } = await api.post('/admin/upload-id', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const createPollAPI = async (pollData) => {
  const { data } = await api.post('/admin/poll', pollData);
  return data;
};

export const fetchAllUsersAPI = async () => {
  const { data } = await api.get('/admin/users');
  return data; 
};

export const fetchPollsAPI = async () => {
  const { data } = await api.get('/vote');
  return data;
};

export const castVoteAPI = async (pollId, candidateId) => {
  const { data } = await api.post('/vote', { pollId, candidateId });
  return data;
};

export const togglePollStatusAPI = async (pollId, status) => {
  const { data } = await api.patch('/admin/poll-status', { pollId, status });
  return data;
};
import api from '../../api/axios';

export const loginAPI = async (identifier, password) => {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data;
};

export const fetchCurrentUserAPI = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const signupAPI = async (userData) => {
  const { data } = await api.post('/auth/signup', userData);
  return data;
};

export const generateUsersAPI = async (users) => {
  const { data } = await api.post('/admin/generate-users', { users });
  return data;
};

export const createPollAPI = async (pollData) => {
  // pollData should now include durationInHours
  const { data } = await api.post('/admin/poll', pollData);
  return data;
};

export const fetchAllUsersAPI = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};

export const fetchDepartmentsAPI = async () => {
  const { data } = await api.get('/admin/departments');
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

export const changePasswordAPI = async (oldPassword, newPassword) => {
  const { data } = await api.post('/auth/change-password', { oldPassword, newPassword });
  return data;
};
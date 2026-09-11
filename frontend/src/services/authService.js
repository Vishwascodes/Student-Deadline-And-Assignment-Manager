import api from './api';

const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

const updateProfile = async (formData) => {
  const { data } = await api.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export default { register, login, getProfile, updateProfile };

import api from './api';

const getAssignments = async (params = {}) => {
  const { data } = await api.get('/assignments', { params });
  return data;
};

const getAssignmentById = async (id) => {
  const { data } = await api.get(`/assignments/${id}`);
  return data;
};

const createAssignment = async (payload) => {
  const { data } = await api.post('/assignments', payload);
  return data;
};

const updateAssignment = async (id, payload) => {
  const { data } = await api.put(`/assignments/${id}`, payload);
  return data;
};

const markCompleted = async (id) => {
  const { data } = await api.put(`/assignments/${id}/complete`);
  return data;
};

const deleteAssignment = async (id) => {
  const { data } = await api.delete(`/assignments/${id}`);
  return data;
};

const getStats = async () => {
  const { data } = await api.get('/assignments/stats');
  return data;
};

export default {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  markCompleted,
  deleteAssignment,
  getStats,
};

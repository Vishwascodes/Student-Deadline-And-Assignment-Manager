import api from './api';

const getSubjects = async () => {
  const { data } = await api.get('/subjects');
  return data;
};

const createSubject = async (payload) => {
  const { data } = await api.post('/subjects', payload);
  return data;
};

const updateSubject = async (id, payload) => {
  const { data } = await api.put(`/subjects/${id}`, payload);
  return data;
};

const deleteSubject = async (id) => {
  const { data } = await api.delete(`/subjects/${id}`);
  return data;
};

export default { getSubjects, createSubject, updateSubject, deleteSubject };

import axios from './axios';

// Get all returns
export const getAllReturns = async (params = {}) => {
  const response = await axios.get('/returns', { params });
  return response;  // axios interceptor already returns response.data
};

// Get return by ID
export const getReturnById = async (id) => {
  const response = await axios.get(`/returns/${id}`);
  return response;  // axios interceptor already returns response.data
};

// Update return status
export const updateReturnStatus = async (id, data) => {
  const response = await axios.patch(`/returns/${id}/status`, data);
  return response;  // axios interceptor already returns response.data
};

export default {
  getAllReturns,
  getReturnById,
  updateReturnStatus,
};

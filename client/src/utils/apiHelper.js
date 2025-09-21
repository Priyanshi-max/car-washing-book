import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

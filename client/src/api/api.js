import axios from 'axios';

const backendURL = 'http://localhost:5000'; // Update to match your backend URL

export const testBackend = async () => {
  try {
    const response = await axios.get(`${backendURL}/api/health`); // Test route
    return response.data;
  } catch (error) {
    console.error('Error connecting to backend:', error);
    throw error;
  }
};

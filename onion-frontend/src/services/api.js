/**
 * api.js — Disease Prediction Service
 */
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  timeout: 30000,
});

/**
 * POST /predict/
 * @param {File} file — JPG image
 * @returns {{ disease: string, confidence: number }}
 */
export const predictDisease = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/predict/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default API;
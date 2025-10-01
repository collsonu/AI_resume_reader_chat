import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const parseResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/parse-resume`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
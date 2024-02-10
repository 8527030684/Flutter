import axios from 'axios';

const baseURL = 'http://64.227.131.178:3001';

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(baseURL+endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(baseURL+endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    return await axios.delete(baseURL+endpoint);
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export const updateData = async (endpoint,data) => {
  try {
    return await axios.put(baseURL+endpoint,data);
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

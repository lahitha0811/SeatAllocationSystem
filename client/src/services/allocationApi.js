// src/services/allocationApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/allocations";

export const runAllocation = async (session, limit) => {
  const response = await axios.post(`${BASE_URL}/run`, { session, limit });
  return response.data;
};

export const getAllAllocations = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getRoomAllocations = async (roomNumber) => {
  const response = await axios.get(`${BASE_URL}/${roomNumber}`);
  return response.data;
};
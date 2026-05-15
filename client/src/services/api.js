import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;
const ML   = import.meta.env.VITE_ML_URL;

export const authAPI = {
  register: (data) => axios.post(`${BASE}/auth/register`, data),
  login:    (data) => axios.post(`${BASE}/auth/login`, data),
};

export const predictAPI = {
  predict:    (data) => axios.post(`${BASE}/predictions`, data),
  getHistory: ()     => axios.get(`${BASE}/predictions`),
  deleteOne:  (id)   => axios.delete(`${BASE}/predictions/${id}`),
};

export const mlAPI = {
  getModels:  () => axios.get(`${ML}/models`),
  getMetrics: () => axios.get(`${ML}/metrics`),
};

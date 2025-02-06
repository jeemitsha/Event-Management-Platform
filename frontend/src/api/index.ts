import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const guestLogin = async () => {
  const response = await api.post('/auth/guest-login');
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const createEvent = async (eventData: {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEvent = async (id: string) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const updateEvent = async (id: string, eventData: {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  capacity?: number;
}) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const joinEvent = async (id: string) => {
  const response = await api.post(`/events/${id}/join`);
  return response.data;
};

export const leaveEvent = async (id: string) => {
  const response = await api.post(`/events/${id}/leave`);
  return response.data;
}; 
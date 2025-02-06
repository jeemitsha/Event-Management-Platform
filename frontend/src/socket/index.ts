import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  extraHeaders: {
    'Access-Control-Allow-Credentials': 'true'
  },
  auth: {
    token: localStorage.getItem('token')
  }
});

// Update token when it changes
export const updateSocketToken = (token: string | null) => {
  if (token) {
    socket.auth = { token };
  }
};

export { socket }; 
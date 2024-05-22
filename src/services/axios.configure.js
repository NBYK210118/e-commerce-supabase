import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://192.168.0.92:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

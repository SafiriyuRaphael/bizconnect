// lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: '/api/socketio',
      transports: ['websocket'],
    });
  }
  return socket;
};

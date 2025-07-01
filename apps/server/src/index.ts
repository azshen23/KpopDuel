import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SOCKET_EVENTS } from 'shared';
import { setupGameHandlers } from './game';
import { config } from './config';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Setup socket handlers
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  setupGameHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error from ${socket.id}:`, error);
  });
});

const PORT = config.PORT;

httpServer.listen(PORT, () => {
  console.log(`🎮 Game server running on port ${PORT}`);
});
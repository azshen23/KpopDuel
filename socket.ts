import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private serverUrl = 'http://localhost:3001'; // Change this to your server URL

  connect(playerId: string, playerName: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      query: {
        playerId,
        playerName
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Game events
  findOpponent() {
    this.socket?.emit('findOpponent');
  }

  submitGuess(roundNumber: number, guess: string) {
    this.socket?.emit('playerGuess', { roundNumber, guess });
  }

  // Event listeners
  onOpponentFound(callback: (opponent: any) => void) {
    this.socket?.on('startGame', callback);
  }

  onRoundStart(callback: (roundData: any) => void) {
    this.socket?.on('startRound', callback);
  }

  onRoundResult(callback: (result: any) => void) {
    this.socket?.on('roundResult', callback);
  }

  onGameOver(callback: (gameResult: any) => void) {
    this.socket?.on('gameOver', callback);
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketManager();
import { Server, Socket } from 'socket.io';
import { Match, PlayerGuess, SOCKET_EVENTS, GAME_CONSTANTS, User } from 'shared';

// In-memory storage for MVP
const matches = new Map<string, Match>();
const playerQueue: string[] = [];
const connectedPlayers = new Map<string, User>();

export function setupGameHandlers(io: Server, socket: Socket) {
  // Handle player joining queue
  socket.on(SOCKET_EVENTS.FIND_OPPONENT, (user: User) => {
    connectedPlayers.set(socket.id, user);
    addToQueue(socket);
  });

  // Handle player guesses
  socket.on(SOCKET_EVENTS.PLAYER_GUESS, (guess: PlayerGuess) => {
    const match = findMatchByPlayerId(socket.id);
    if (!match) return;

    handlePlayerGuess(io, match, socket.id, guess);
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    handlePlayerDisconnect(io, socket);
  });
}

function addToQueue(socket: Socket) {
  playerQueue.push(socket.id);
  
  if (playerQueue.length >= 2) {
    const player1Id = playerQueue.shift()!;
    const player2Id = playerQueue.shift()!;
    createMatch(socket.server, player1Id, player2Id);
  }
}

function createMatch(io: Server, player1Id: string, player2Id: string) {
  const match: Match = {
    id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    player1Id,
    player2Id,
    currentRound: 0,
    rounds: generateRounds(),
    scores: { [player1Id]: 0, [player2Id]: 0 },
    state: 'waiting'
  };

  matches.set(match.id, match);

  // Notify players of match start
  io.to(player1Id).to(player2Id).emit(SOCKET_EVENTS.MATCH_FOUND, {
    opponent: player1Id === player2Id ? 
      connectedPlayers.get(player1Id) : 
      connectedPlayers.get(player2Id)
  });

  startMatch(io, match);
}

function startMatch(io: Server, match: Match) {
  match.state = 'playing';
  startRound(io, match);
}

function startRound(io: Server, match: Match) {
  const round = match.rounds[match.currentRound];
  
  io.to(match.player1Id).to(match.player2Id).emit(SOCKET_EVENTS.START_ROUND, {
    roundNumber: match.currentRound + 1,
    snippetURL: round.snippetURL,
    options: round.options
  });

  // Auto-advance round after timeout
  setTimeout(() => {
    if (match.currentRound === match.rounds.length - 1) {
      endGame(io, match);
    } else {
      match.currentRound++;
      startRound(io, match);
    }
  }, GAME_CONSTANTS.ROUND_TIMEOUT_SECONDS * 1000);
}

function handlePlayerGuess(io: Server, match: Match, playerId: string, guess: PlayerGuess) {
  const round = match.rounds[guess.roundNumber - 1];
  const isCorrect = guess.guess === round.correctAnswer;
  
  // Calculate score based on speed and accuracy
  if (isCorrect) {
    const timeBonus = Math.max(
      0,
      GAME_CONSTANTS.ROUND_TIMEOUT_SECONDS - (guess.timestamp / 1000)
    );
    match.scores[playerId] += GAME_CONSTANTS.MAX_POINTS_PER_ROUND +
      (timeBonus * GAME_CONSTANTS.SPEED_BONUS_MULTIPLIER);
  }

  // Emit round result
  io.to(match.player1Id).to(match.player2Id).emit(SOCKET_EVENTS.ROUND_RESULT, {
    correctAnswer: round.correctAnswer,
    scores: match.scores
  });
}

function endGame(io: Server, match: Match) {
  match.state = 'finished';
  
  const winner = match.scores[match.player1Id] > match.scores[match.player2Id] ?
    match.player1Id : match.player2Id;

  io.to(match.player1Id).to(match.player2Id).emit(SOCKET_EVENTS.GAME_OVER, {
    finalScores: match.scores,
    winner
  });

  // Cleanup
  matches.delete(match.id);
}

function handlePlayerDisconnect(io: Server, socket: Socket) {
  const match = findMatchByPlayerId(socket.id);
  if (match) {
    const opponentId = match.player1Id === socket.id ? match.player2Id : match.player1Id;
    io.to(opponentId).emit(SOCKET_EVENTS.OPPONENT_LEFT);
    matches.delete(match.id);
  }

  // Remove from queue if waiting
  const queueIndex = playerQueue.indexOf(socket.id);
  if (queueIndex > -1) {
    playerQueue.splice(queueIndex, 1);
  }

  connectedPlayers.delete(socket.id);
}

function findMatchByPlayerId(playerId: string): Match | undefined {
  return Array.from(matches.values()).find(match =>
    match.player1Id === playerId || match.player2Id === playerId
  );
}

// Temporary function to generate mock rounds
function generateRounds() {
  return Array(GAME_CONSTANTS.ROUNDS_PER_MATCH).fill(null).map(() => ({
    snippetURL: 'https://example.com/snippet.mp3', // Replace with actual Firebase URLs
    options: ['Song 1', 'Song 2', 'Song 3', 'Song 4'],
    correctAnswer: 'Song 1'
  }));
}
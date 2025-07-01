export const SOCKET_EVENTS = {
  // Client -> Server events
  FIND_OPPONENT: 'findOpponent',
  PLAYER_GUESS: 'playerGuess',
  LEAVE_GAME: 'leaveGame',

  // Server -> Client events
  MATCH_FOUND: 'matchFound',
  START_GAME: 'startGame',
  START_ROUND: 'startRound',
  ROUND_RESULT: 'roundResult',
  GAME_OVER: 'gameOver',
  OPPONENT_LEFT: 'opponentLeft',

  // Error events
  ERROR: 'error'
} as const;

export type SocketEvents = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
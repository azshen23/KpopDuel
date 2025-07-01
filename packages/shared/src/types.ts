export interface User {
  id: string;
  username: string;
  profilePicture: string;
}

export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  currentRound: number;
  rounds: Round[];
  scores: {
    [playerId: string]: number;
  };
  state: 'waiting' | 'playing' | 'finished';
}

export interface Round {
  snippetURL: string;
  options: string[];
  correctAnswer: string;
}

export interface PlayerGuess {
  roundNumber: number;
  guess: string;
  timestamp: number;
}

export interface RoundResult {
  correctAnswer: string;
  scores: {
    [playerId: string]: number;
  };
  playerGuesses: {
    [playerId: string]: PlayerGuess;
  };
}

export interface GameOver {
  finalScores: {
    [playerId: string]: number;
  };
  winner: string;
}
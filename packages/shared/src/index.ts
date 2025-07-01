export * from './types';
export * from './events';

export const GAME_CONSTANTS = {
  ROUNDS_PER_MATCH: 5,
  ROUND_TIMEOUT_SECONDS: 10,
  SNIPPET_DURATION_SECONDS: 5,
  MAX_POINTS_PER_ROUND: 100,
  SPEED_BONUS_MULTIPLIER: 10, // Points multiplier based on response speed
} as const;
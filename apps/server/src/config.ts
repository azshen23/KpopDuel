import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:19000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FIREBASE_STORAGE_URL: process.env.FIREBASE_STORAGE_URL || '',
} as const;

// Validate required environment variables
if (!config.FIREBASE_STORAGE_URL) {
  console.warn('Warning: FIREBASE_STORAGE_URL is not set. Audio snippets will not be available.');
}
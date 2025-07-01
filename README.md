# KpopDuel 🎵

A real-time 1v1 K-pop music guessing game built with Expo React Native and Socket.io.

## Features

- Real-time multiplayer gameplay
- Google Sign-In authentication
- 5-second K-pop song snippets
- Points system based on speed and accuracy
- Beautiful UI with NativeWind (Tailwind CSS)

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- Firebase account (for audio storage)

## Project Structure

```
kpopduel/
  apps/
    client/       # Expo React Native app
    server/       # Node.js Socket.io server
  packages/
    shared/       # Shared types and constants
```

## Environment Setup

1. Create `.env` files:

   **apps/client/.env**
   ```
   EXPO_PUBLIC_SERVER_URL=http://localhost:3000
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   EXPO_PUBLIC_ANDROID_CLIENT_ID=your_android_client_id
   EXPO_PUBLIC_IOS_CLIENT_ID=your_ios_client_id
   ```

   **apps/server/.env**
   ```
   PORT=3000
   CLIENT_URL=http://localhost:19000
   FIREBASE_STORAGE_URL=your_firebase_storage_url
   ```

## Installation

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Build shared package:
   ```bash
   cd packages/shared
   yarn build
   ```

## Development

1. Start the server:
   ```bash
   yarn dev:server
   ```

2. Start the Expo app:
   ```bash
   yarn dev:client
   ```

3. Open the Expo app on your device using the Expo Go app or run in a simulator.

## Game Flow

1. Players sign in with Google
2. Join matchmaking queue
3. When matched, both players hear the same 5-second song snippet
4. Choose from 4 possible song titles
5. Points awarded based on speed and accuracy
6. After 5 rounds, winner is declared

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

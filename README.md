# KpopDuel Client

A real-time 1v1 K-pop audio snippet battle game built with React Native and Expo.

## Features

- 🎵 Real-time multiplayer K-pop guessing game
- 🎯 5 rounds per match with 4 song options each
- ⚡ WebSocket-based low-latency gameplay
- 🎨 Beautiful UI with NativeWind (Tailwind CSS for React Native)
- 🔊 Audio playback with Expo AV
- 📱 Cross-platform (iOS, Android, Web)

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation
- **Real-time Communication**: Socket.io Client
- **Audio**: Expo AV
- **Storage**: AsyncStorage

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kpopduel-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Configuration

### Server Connection

Update the server URL in `socket.ts`:
```typescript
private serverUrl = 'http://your-server-url:3001';
```

### Audio Sources

The app expects audio snippet URLs from the server. Make sure your backend provides valid audio URLs.

## Project Structure

```
kpopduel-client/
├── App.tsx                 # Main app component with navigation
├── socket.ts              # Socket.io client manager
├── screens/               # Screen components
│   ├── LoginScreen.tsx    # User authentication
│   ├── LobbyScreen.tsx    # Matchmaking lobby
│   ├── GameScreen.tsx     # Main game interface
│   └── ResultsScreen.tsx  # Game results display
├── components/            # Reusable components
├── utils/                 # Utility functions
├── assets/               # Images, icons, etc.
└── package.json          # Dependencies and scripts
```

## Game Flow

1. **Login**: Enter display name
2. **Lobby**: Find opponent via matchmaking
3. **Game**: 5 rounds of K-pop song guessing
4. **Results**: View final scores and winner

## Socket Events

### Client → Server
- `findOpponent`: Request matchmaking
- `playerGuess`: Submit answer for current round

### Server → Client
- `startGame`: Game begins with opponent info
- `startRound`: New round with audio snippet and options
- `roundResult`: Round results with correct answer and scores
- `gameOver`: Final game results

## Development

### Adding New Screens

1. Create screen component in `screens/`
2. Add to navigation stack in `App.tsx`
3. Update `RootStackParamList` type

### Styling

Uses NativeWind for Tailwind-like styling:
```tsx
<View className="bg-primary p-4 rounded-lg">
  <Text className="text-white font-bold">Hello World</Text>
</View>
```

### Audio Handling

Audio playback is managed in `GameScreen.tsx` using Expo AV:
```typescript
const { sound } = await Audio.Sound.createAsync(
  { uri: audioUrl },
  { shouldPlay: true }
);
```

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

## Troubleshooting

### Audio Issues
- Ensure audio URLs are accessible
- Check device volume and permissions
- Test with different audio formats

### Connection Issues
- Verify server URL and port
- Check network connectivity
- Ensure server is running

### Performance
- Use React DevTools for debugging
- Monitor memory usage during audio playback
- Test on physical devices for accurate performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
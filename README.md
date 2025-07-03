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

- **Runtime**: Bun (JavaScript runtime and package manager)
- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation
- **Real-time Communication**: Socket.io Client
- **Audio**: Expo AV
- **Storage**: AsyncStorage

## Prerequisites

- Bun (v1.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
- Expo CLI (`bun add -g @expo/cli`)
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
bun install
```

3. Start the development server:
```bash
bun start
```

4. Run on your preferred platform:
```bash
# iOS
bun run ios

# Android
bun run android

# Web
bun run web
```

## Bun Configuration

This project is configured to use Bun as the JavaScript runtime and package manager. Bun provides:

- **Faster installation**: Up to 25x faster than npm
- **Built-in bundler**: No need for additional build tools
- **TypeScript support**: Native TypeScript execution
- **Hot reloading**: Fast development experience

### Bun-specific files:
- `bunfig.toml`: Bun configuration file
- `bun.lockb`: Bun lockfile (binary format)

### Available scripts:
```bash
bun start      # Start Expo development server
bun run dev    # Alias for start
bun run ios    # Run on iOS simulator
bun run android # Run on Android emulator
bun run web    # Run in web browser
bun run build  # Build the project
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
2. Add to appropriate navigation stack in `AppNavigator.tsx`
3. Update `AuthStackParamList` or `AuthenticatedStackParamList` type

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
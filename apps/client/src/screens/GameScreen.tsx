import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useSocket } from '../contexts/SocketContext';
import { SOCKET_EVENTS, GAME_CONSTANTS } from 'shared';
import { StatusBar } from 'expo-status-bar';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const route = useRoute<GameScreenRouteProp>();
  const { socket } = useSocket();
  
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  
  const soundRef = useRef<Audio.Sound>();
  const roundTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENTS.START_ROUND, async ({ roundNumber, snippetURL, options: roundOptions }) => {
      setCurrentRound(roundNumber);
      setOptions(roundOptions);
      setSelectedAnswer(null);
      playSnippet(snippetURL);
    });

    socket.on(SOCKET_EVENTS.ROUND_RESULT, ({ correctAnswer, scores: newScores }) => {
      setScores(newScores);
      // Show correct/wrong feedback
      if (selectedAnswer === correctAnswer) {
        // TODO: Show success animation
      }
    });

    socket.on(SOCKET_EVENTS.GAME_OVER, ({ finalScores, winner }) => {
      navigation.replace('Results', { matchId: route.params.matchId });
    });

    socket.on(SOCKET_EVENTS.OPPONENT_LEFT, () => {
      // TODO: Show opponent left message
      navigation.replace('Lobby');
    });

    return () => {
      socket.off(SOCKET_EVENTS.START_ROUND);
      socket.off(SOCKET_EVENTS.ROUND_RESULT);
      socket.off(SOCKET_EVENTS.GAME_OVER);
      socket.off(SOCKET_EVENTS.OPPONENT_LEFT);
      cleanupAudio();
    };
  }, [socket, navigation, route.params.matchId]);

  const playSnippet = async (snippetURL: string) => {
    try {
      await cleanupAudio();
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: snippetURL },
        { shouldPlay: true }
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
      
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      // Start round timer
      roundTimerRef.current = setTimeout(() => {
        handleAnswer(null); // Auto-submit if no answer selected
      }, GAME_CONSTANTS.ROUND_TIMEOUT_SECONDS * 1000);

    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const cleanupAudio = async () => {
    if (roundTimerRef.current) {
      clearTimeout(roundTimerRef.current);
    }
    
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
    }
  };

  const handleAnswer = (answer: string | null) => {
    if (!socket || selectedAnswer) return;

    setSelectedAnswer(answer);
    socket.emit(SOCKET_EVENTS.PLAYER_GUESS, {
      roundNumber: currentRound,
      guess: answer,
      timestamp: Date.now()
    });
  };

  return (
    <View className="flex-1 bg-background p-4">
      <StatusBar style="dark" />

      {/* Round Info */}
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-primary">
          Round {currentRound}/{GAME_CONSTANTS.ROUNDS_PER_MATCH}
        </Text>
        <Text className="text-lg text-gray-600">
          {isPlaying ? 'Playing snippet...' : 'Choose your answer!'}
        </Text>
      </View>

      {/* Audio Status */}
      <View className="items-center mb-8">
        {isPlaying ? (
          <ActivityIndicator size="large" color="#FF4B91" />
        ) : (
          <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
            <Text className="text-white text-2xl">🎵</Text>
          </View>
        )}
      </View>

      {/* Answer Options */}
      <View className="flex-1 justify-center">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswer(option)}
            disabled={!!selectedAnswer || isPlaying}
            className={`
              mb-4 p-4 rounded-xl
              ${selectedAnswer === option ? 'bg-primary' : 'bg-white'}
              ${(!!selectedAnswer || isPlaying) ? 'opacity-50' : ''}
            `}
          >
            <Text 
              className={`
                text-lg text-center font-medium
                ${selectedAnswer === option ? 'text-white' : 'text-gray-800'}
              `}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scores */}
      <View className="mt-4">
        <Text className="text-center text-gray-600">
          Score: {Object.values(scores)[0] || 0}
        </Text>
      </View>
    </View>
  );
}
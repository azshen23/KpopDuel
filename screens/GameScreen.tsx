import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import SocketManager from '../socket';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

interface RoundData {
  roundNumber: number;
  snippetURL: string;
  options: string[];
  timeLimit: number;
}

interface RoundResult {
  correctAnswer: string;
  scores: { [playerId: string]: number };
  playerAnswers: { [playerId: string]: string };
}

const { width } = Dimensions.get('window');

const GameScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentRound, setCurrentRound] = useState<RoundData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { matchId, opponent } = route.params;

  useEffect(() => {
    setupGameListeners();
    return () => {
      cleanup();
    };
  }, []);

  const setupGameListeners = () => {
    SocketManager.onRoundStart((roundData: RoundData) => {
      setGameStarted(true);
      setCurrentRound(roundData);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(roundData.timeLimit || 15);
      playAudioSnippet(roundData.snippetURL);
      startTimer(roundData.timeLimit || 15);
    });

    SocketManager.onRoundResult((result: RoundResult) => {
      setLastResult(result);
      setScores(result.scores);
      setShowResult(true);
      stopAudio();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    });

    SocketManager.onGameOver((gameResult) => {
      cleanup();
      navigation.replace('Results', {
        finalScores: gameResult.finalScores,
        winner: gameResult.winner,
        playerName: gameResult.playerName
      });
    });
  };

  const startTimer = (duration: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playAudioSnippet = async (url: string) => {
    try {
      await stopAudio();
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume: 1.0 }
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', 'Failed to play audio snippet');
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(false);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentRound) return;
    
    setSelectedAnswer(answer);
    SocketManager.submitGuess(currentRound.roundNumber, answer);
  };

  const cleanup = () => {
    stopAudio();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    SocketManager.removeAllListeners();
  };

  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>🎵 Get Ready!</Text>
          <Text style={styles.opponentText}>VS {opponent.name}</Text>
          <Text style={styles.subtitle}>Game starting soon...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>You: {scores[Object.keys(scores)[0]] || 0}</Text>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.scoreText}>{opponent.name}: {scores[Object.keys(scores)[1]] || 0}</Text>
        </View>
        
        {currentRound && (
          <Text style={styles.roundText}>Round {currentRound.roundNumber}/5</Text>
        )}
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
        <View style={styles.timerBar}>
          <View 
            style={[styles.timerProgress, { width: `${(timeLeft / 15) * 100}%` }]} 
          />
        </View>
      </View>

      {/* Audio Controls */}
      <View style={styles.audioContainer}>
        <Text style={styles.audioText}>
          {isPlaying ? '🎵 Playing...' : '🎵 Audio snippet'}
        </Text>
      </View>

      {/* Answer Options */}
      {currentRound && (
        <View style={styles.optionsContainer}>
          <Text style={styles.questionText}>Which song is this?</Text>
          {currentRound.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showResult && lastResult?.correctAnswer === option;
            const isWrong = showResult && selectedAnswer === option && !isCorrect;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                  isCorrect && styles.correctOption,
                  isWrong && styles.wrongOption,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <Text style={[
                  styles.optionText,
                  (isSelected || isCorrect) && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Result Display */}
      {showResult && lastResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Correct Answer: {lastResult.correctAnswer}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 32,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  opponentText: {
    fontSize: 24,
    color: '#4ECDC4',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: 16,
    color: '#FFE66D',
    fontWeight: 'bold',
  },
  roundText: {
    fontSize: 16,
    color: '#4ECDC4',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 24,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerBar: {
    width: width - 40,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#FF6B9D',
  },
  audioContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  audioText: {
    fontSize: 18,
    color: '#FFE66D',
  },
  optionsContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  optionButton: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#4ECDC4',
    backgroundColor: '#4ECDC4',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#FFE66D',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GameScreen;
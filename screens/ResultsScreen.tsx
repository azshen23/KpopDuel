import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import SocketManager from '../socket';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

interface Props {
  navigation: ResultsScreenNavigationProp;
  route: ResultsScreenRouteProp;
}

const { width } = Dimensions.get('window');

const ResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { finalScores, winner, playerName } = route.params;
  
  const playerIds = Object.keys(finalScores);
  const playerScore = finalScores[playerIds[0]] || 0;
  const opponentScore = finalScores[playerIds[1]] || 0;
  const isWinner = winner === playerName;
  
  const handlePlayAgain = () => {
    SocketManager.disconnect();
    navigation.replace('Lobby', { playerName });
  };
  
  const handleExit = () => {
    SocketManager.disconnect();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Result Header */}
      <View style={styles.header}>
        <Text style={styles.gameOverText}>Game Over!</Text>
        <Text style={[styles.resultText, isWinner ? styles.winText : styles.loseText]}>
          {isWinner ? '🎉 You Won!' : '😔 You Lost!'}
        </Text>
      </View>

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={[styles.scoreValue, isWinner && styles.winnerScore]}>
            {playerScore}
          </Text>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Opponent</Text>
          <Text style={[styles.scoreValue, !isWinner && styles.winnerScore]}>
            {opponentScore}
          </Text>
        </View>
      </View>

      {/* Performance Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Match Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total Rounds: 5</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Your Accuracy: {Math.round((playerScore / 5) * 100)}%
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Score Difference: {Math.abs(playerScore - opponentScore)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={handlePlayAgain}
        >
          <Text style={styles.playAgainButtonText}>🎮 Play Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExit}
        >
          <Text style={styles.exitButtonText}>Exit to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Motivational Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          {isWinner 
            ? "🎵 Great job! You know your K-pop!" 
            : "🎶 Keep practicing! You'll get them next time!"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  gameOverText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  winText: {
    color: '#4CAF50',
  },
  loseText: {
    color: '#F44336',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerScore: {
    color: '#FFE66D',
  },
  vsContainer: {
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  summaryTitle: {
    fontSize: 20,
    color: '#FFE66D',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  playAgainButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#666',
    fontSize: 16,
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#4ECDC4',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ResultsScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import SocketManager from '../socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LobbyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Lobby'>;
type LobbyScreenRouteProp = RouteProp<RootStackParamList, 'Lobby'>;

interface Props {
  navigation: LobbyScreenNavigationProp;
  route: LobbyScreenRouteProp;
}

const LobbyScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [playerName] = useState(route.params.playerName);
  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    loadPlayerId();
    return () => {
      // Clean up socket listeners when leaving lobby
      SocketManager.removeAllListeners();
    };
  }, []);

  const loadPlayerId = async () => {
    try {
      const id = await AsyncStorage.getItem('playerId');
      if (id) {
        setPlayerId(id);
      }
    } catch (error) {
      console.error('Failed to load player ID:', error);
    }
  };

  const handleFindOpponent = async () => {
    if (!playerId) {
      Alert.alert('Error', 'Player ID not found');
      return;
    }

    setIsSearching(true);
    
    try {
      // Connect to socket
      const socket = SocketManager.connect(playerId, playerName);
      
      // Set up game event listeners
      SocketManager.onOpponentFound((gameData) => {
        setIsSearching(false);
        navigation.replace('Game', {
          matchId: gameData.matchId,
          opponent: gameData.opponent
        });
      });

      // Handle connection errors
      socket.on('connect_error', () => {
        setIsSearching(false);
        Alert.alert('Connection Error', 'Failed to connect to game server');
      });

      socket.on('matchmaking_error', (error) => {
        setIsSearching(false);
        Alert.alert('Matchmaking Error', error.message);
      });

      // Start looking for opponent
      SocketManager.findOpponent();
      
    } catch (error) {
      setIsSearching(false);
      Alert.alert('Error', 'Failed to start matchmaking');
    }
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    SocketManager.disconnect();
  };

  const handleLogout = () => {
    SocketManager.disconnect();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {playerName}! 👋</Text>
        <Text style={styles.subtitle}>Ready to battle?</Text>
      </View>

      <View style={styles.content}>
        {!isSearching ? (
          <>
            <TouchableOpacity
              style={styles.findButton}
              onPress={handleFindOpponent}
            >
              <Text style={styles.findButtonText}>🎯 Find Opponent</Text>
            </TouchableOpacity>
            
            <View style={styles.gameInfo}>
              <Text style={styles.infoTitle}>How to Play:</Text>
              <Text style={styles.infoText}>• 5 rounds of K-pop song guessing</Text>
              <Text style={styles.infoText}>• 4 options per round</Text>
              <Text style={styles.infoText}>• Points for speed and accuracy</Text>
              <Text style={styles.infoText}>• Beat your opponent to win!</Text>
            </View>
          </>
        ) : (
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="large" color="#FF6B9D" />
            <Text style={styles.searchingText}>Looking for opponent...</Text>
            <Text style={styles.searchingSubtext}>This may take a moment</Text>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSearch}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4ECDC4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  findButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 25,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  findButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameInfo: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE66D',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 24,
  },
  searchingContainer: {
    alignItems: 'center',
  },
  searchingText: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  searchingSubtext: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: '#666',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default LobbyScreen;
import React, { useState, useEffect } from "react";
import {
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import SocketManager from "../../socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../../services/authService";
import { Container, Button, Typography, Card, Layout } from "../../components";

// No more styled components needed - using reusable components!

type LobbyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Lobby"
>;
type LobbyScreenRouteProp = RouteProp<RootStackParamList, "Lobby">;

interface Props {
  navigation: LobbyScreenNavigationProp;
  route: LobbyScreenRouteProp;
}

const LobbyScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [playerName] = useState(route.params.playerName);
  const [playerId, setPlayerId] = useState<string>("");

  useEffect(() => {
    loadPlayerId();
    return () => {
      // Clean up socket listeners when leaving lobby
      SocketManager.removeAllListeners();
    };
  }, []);

  const loadPlayerId = async () => {
    try {
      const id = await AsyncStorage.getItem("playerId");
      if (id) {
        setPlayerId(id);
      }
    } catch (error) {
      console.error("Failed to load player ID:", error);
    }
  };

  const handleFindOpponent = async () => {
    if (!playerId) {
      Alert.alert("Error", "Player ID not found");
      return;
    }

    setIsSearching(true);

    try {
      // Connect to socket
      const socket = SocketManager.connect(playerId, playerName);

      // Set up game event listeners
      SocketManager.onOpponentFound((gameData) => {
        setIsSearching(false);
        navigation.replace("Game", {
          matchId: gameData.matchId,
          opponent: gameData.opponent,
        });
      });

      // Handle connection errors
      socket.on("connect_error", () => {
        setIsSearching(false);
        Alert.alert("Connection Error", "Failed to connect to game server");
      });

      socket.on("matchmaking_error", (error) => {
        setIsSearching(false);
        Alert.alert("Matchmaking Error", error.message);
      });

      // Start looking for opponent
      SocketManager.findOpponent();
    } catch (error) {
      setIsSearching(false);
      Alert.alert("Error", "Failed to start matchmaking");
    }
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    SocketManager.disconnect();
  };

  const handleLogout = async () => {
    try {
      SocketManager.disconnect();
      await signOut(auth);
      // The auth state listener in LoginScreen will handle navigation
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <Container variant="primary">
      <Layout variant="header" spacing="large">
        <Typography variant="heading" weight="bold" className="mb-2">
          Welcome, {playerName}! 👋
        </Typography>
        <Typography variant="subtitle" color="secondary">
          Ready to battle?
        </Typography>
      </Layout>

      <Layout variant="content">
        {!isSearching ? (
          <>
            <Button 
              variant="primary" 
              size="large" 
              onPress={handleFindOpponent}
              className="py-5 mb-10"
            >
              🎯 Find Opponent
            </Button>

            <Card variant="rules">
              <Typography variant="subtitle" color="accent" weight="bold" className="mb-4">
                How to Play:
              </Typography>
              <Typography className="mb-2 leading-6">• 5 rounds of K-pop song guessing</Typography>
              <Typography className="mb-2 leading-6">• 4 options per round</Typography>
              <Typography className="mb-2 leading-6">• Points for speed and accuracy</Typography>
              <Typography className="mb-2 leading-6">• Beat your opponent to win!</Typography>
            </Card>
          </>
        ) : (
          <Layout variant="center">
            <ActivityIndicator size="large" color="#FF6B9D" />
            <Typography variant="button" className="mt-5 mb-2">
              Looking for opponent...
            </Typography>
            <Typography color="gray" className="mb-8">
              This may take a moment
            </Typography>

            <Button variant="cancel" onPress={handleCancelSearch}>
              Cancel
            </Button>
          </Layout>
        )}
      </Layout>

      <Layout variant="footer">
        <Button variant="logout" onPress={handleLogout}>
          Logout
        </Button>
      </Layout>
    </Container>
  );
};

export default LobbyScreen;

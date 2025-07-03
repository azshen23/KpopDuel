import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
import { styled } from "nativewind";

// Styled components
const StyledContainer = styled(View, "flex-1 bg-[#1a1a2e] p-5");
const StyledHeader = styled(View, "items-center mt-5 mb-10");
const StyledWelcomeText = styled(Text, "text-2xl font-bold text-white mb-2");
const StyledSubText = styled(Text, "text-lg text-[#4ECDC4]");
const StyledContent = styled(View, "flex-1 justify-center");
const StyledFindButton = styled(
  TouchableOpacity,
  "bg-[#FF6B9D] rounded-3xl py-5 items-center mb-10 shadow-lg"
);
const StyledButtonText = styled(Text, "text-white text-xl font-bold");
const StyledRulesContainer = styled(View, "bg-[#16213e] rounded-2xl p-5");
const StyledRulesTitle = styled(Text, "text-lg font-bold text-[#FFE66D] mb-4");
const StyledRuleText = styled(Text, "text-base text-white mb-2 leading-6");
const StyledSearchingContainer = styled(View, "items-center");
const StyledSearchingText = styled(Text, "text-xl text-white mt-5 mb-2");
const StyledSearchingSubText = styled(Text, "text-base text-gray-400 mb-8");
const StyledCancelButton = styled(
  TouchableOpacity,
  "bg-gray-600 rounded-2xl py-3 px-8"
);
const StyledCancelText = styled(Text, "text-white text-base");
const StyledFooter = styled(View, "items-center mb-5");
const StyledLogoutButton = styled(
  TouchableOpacity,
  "bg-transparent border border-gray-600 rounded-2xl py-2 px-8"
);
const StyledLogoutText = styled(Text, "text-gray-600 text-base");

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
    <StyledContainer>
      <StyledHeader>
        <StyledWelcomeText>Welcome, {playerName}! 👋</StyledWelcomeText>
        <StyledSubText>Ready to battle?</StyledSubText>
      </StyledHeader>

      <StyledContent>
        {!isSearching ? (
          <>
            <StyledFindButton onPress={handleFindOpponent}>
              <StyledButtonText>🎯 Find Opponent</StyledButtonText>
            </StyledFindButton>

            <StyledRulesContainer>
              <StyledRulesTitle>How to Play:</StyledRulesTitle>
              <StyledRuleText>• 5 rounds of K-pop song guessing</StyledRuleText>
              <StyledRuleText>• 4 options per round</StyledRuleText>
              <StyledRuleText>• Points for speed and accuracy</StyledRuleText>
              <StyledRuleText>• Beat your opponent to win!</StyledRuleText>
            </StyledRulesContainer>
          </>
        ) : (
          <StyledSearchingContainer>
            <ActivityIndicator size="large" color="#FF6B9D" />
            <StyledSearchingText>Looking for opponent...</StyledSearchingText>
            <StyledSearchingSubText>
              This may take a moment
            </StyledSearchingSubText>

            <StyledCancelButton onPress={handleCancelSearch}>
              <StyledCancelText>Cancel</StyledCancelText>
            </StyledCancelButton>
          </StyledSearchingContainer>
        )}
      </StyledContent>

      <StyledFooter>
        <StyledLogoutButton onPress={handleLogout}>
          <StyledLogoutText>Logout</StyledLogoutText>
        </StyledLogoutButton>
      </StyledFooter>
    </StyledContainer>
  );
};

export default LobbyScreen;

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { User } from "firebase/auth";
import { authService } from "../services/authService";
import LoginScreen from "./Login";
import LobbyScreen from "./Lobby";
import GameScreen from "./Game";
import ResultsScreen from "./Results";

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
};

// Authenticated Stack Types
export type AuthenticatedStackParamList = {
  Lobby: { playerName: string; playerPhoto?: string };
  Game: { matchId: string; opponent: { name: string; photo?: string } };
  Results: {
    finalScores: { [playerId: string]: number };
    winner: string;
    playerName: string;
  };
};

// Combined type for navigation (backward compatibility)
export type RootStackParamList = AuthStackParamList & AuthenticatedStackParamList;

const AuthStack = createStackNavigator<AuthStackParamList>();
const AuthenticatedStack = createStackNavigator<AuthenticatedStackParamList>();

// Auth Stack Navigator
const AuthStackNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
    </AuthStack.Navigator>
  );
};

// Authenticated Stack Navigator
const AuthenticatedStackNavigator: React.FC = () => {
  return (
    <AuthenticatedStack.Navigator
      initialRouteName="Lobby"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF6B9D",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <AuthenticatedStack.Screen
        name="Lobby"
        component={LobbyScreen}
        options={{ title: "KpopDuel Lobby" }}
      />
      <AuthenticatedStack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: "Battle Arena", headerLeft: () => null }}
      />
      <AuthenticatedStack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: "Game Results", headerLeft: () => null }}
      />
    </AuthenticatedStack.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user: User | null) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    // You can return a loading screen here if needed
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <AuthenticatedStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

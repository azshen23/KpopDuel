import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LobbyScreen from "../Lobby";
import GameScreen from "../Game";
import ResultsScreen from "../Results";

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

const AuthenticatedStack = createStackNavigator<AuthenticatedStackParamList>();

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

export default AuthenticatedStackNavigator;
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "./Login";
import LobbyScreen from "./Lobby";
import GameScreen from "./Game";
import ResultsScreen from "./Results";

export type RootStackParamList = {
  Login: undefined;
  Lobby: { playerName: string; playerPhoto?: string };
  Game: { matchId: string; opponent: { name: string; photo?: string } };
  Results: {
    finalScores: { [playerId: string]: number };
    winner: string;
    playerName: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Lobby"
          component={LobbyScreen}
          options={{ title: "KpopDuel Lobby" }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: "Battle Arena", headerLeft: () => null }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ title: "Game Results", headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { User } from "firebase/auth";
import { authService } from "../../services/authService";
import AuthStackNavigator, { AuthStackParamList } from "./AuthStack";
import AuthenticatedStackNavigator, {
  AuthenticatedStackParamList,
} from "./AuthenticatedStack";

// Combined type for type safety
export type RootStackParamList = AuthStackParamList &
  AuthenticatedStackParamList;

// Re-export types for convenience
export type { AuthStackParamList, AuthenticatedStackParamList };

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

import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
} from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../../services/authService";
import { Container, Button, Typography, Input, Layout } from "../../components";
import * as Google from 'expo-auth-session/providers/google';

// No more styled components needed - using reusable components!

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Set up Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  // Handle authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthSuccess(response);
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (authResponse: any) => {
    setIsLoading(true);
    try {
      const user = await authService.signInWithGoogleResponse(authResponse);
      if (user) {
        // Authentication successful - AppNavigator will handle the redirect
        console.log('Google Sign-In successful:', user.email);
      }
    } catch (error: any) {
      let errorMessage = "Google Sign-In failed";
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with the same email address but different sign-in credentials";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials. Please try again";
      } else {
        errorMessage = error.message || "Google Sign-In failed";
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await promptAsync();
    } catch (error: any) {
      Alert.alert("Error", "Failed to start Google Sign-In");
      setIsLoading(false);
    }
  };

  return (
    <Container safeArea className="flex-1">
      <View className="flex-1 justify-center px-5">
        <Layout variant="center" spacing="large" className="mb-16">
          <Typography
            variant="title"
            color="primary"
            weight="bold"
            className="mb-2 text-4xl"
          >
            🎵 KpopDuel
          </Typography>
          <Typography variant="subtitle" color="secondary" align="center">
            Real-time K-pop Battle Game
          </Typography>
        </Layout>

        <Layout spacing="large" className="mb-16">
          <Typography variant="subtitle" align="center" className="mb-8">
            Sign in to start playing
          </Typography>

          <Button
            variant="outline"
            size="large"
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            className="border-2 border-[#4285F4] bg-white py-4"
            textClassName="text-[#4285F4] font-semibold text-lg"
          >
            {isLoading ? "Signing in..." : "🔍 Continue with Google"}
          </Button>
        </Layout>

        <Layout variant="center">
          <Typography color="accent" align="center" className="leading-6">
            🎤 Guess K-pop songs faster than your opponent!
          </Typography>
        </Layout>
      </View>
    </Container>
  );
};

export default LoginScreen;

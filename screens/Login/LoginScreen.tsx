import React, { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile, User } from "firebase/auth";
import { auth, authService } from "../../services/authService";
import { Container, Button, Typography, Input, Layout } from "../../components";

// No more styled components needed - using reusable components!

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Authentication state is now managed in AppNavigator
  // No need for useEffect here

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    if (isSignUp && !displayName.trim()) {
      Alert.alert("Error", "Please enter a display name");
      return;
    }

    setIsLoading(true);

    try {
      let user;
      if (isSignUp) {
        // Create new account
        user = await authService.signUp(email.trim(), password);

        // Update the user's display name
        await updateProfile(user, {
          displayName: displayName.trim(),
        });

        Alert.alert("Success", "Account created successfully!");
      } else {
        // Sign in existing user
        user = await authService.signIn(email.trim(), password);
      }

      // Store user data in AsyncStorage
      const playerName =
        user.displayName || user.email?.split("@")[0] || "Player";
      await AsyncStorage.setItem("playerId", user.uid);
      await AsyncStorage.setItem("playerName", playerName);
    } catch (error: any) {
      let errorMessage = "Authentication failed";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container safeArea className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Layout variant="center" spacing="large" className="mb-12">
            <Typography
              variant="title"
              color="primary"
              weight="bold"
              className="mb-2"
            >
              🎵 KpopDuel
            </Typography>
            <Typography variant="subtitle" color="secondary" align="center">
              Real-time K-pop Battle Game
            </Typography>
          </Layout>

          <Layout spacing="large" className="mb-12">
            <Typography variant="subtitle" align="center" className="mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </Typography>

            <Input
              variant="rounded"
              size="large"
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="mb-5"
            />

            <Input
              variant="rounded"
              size="large"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              className="mb-5"
            />

            {isSignUp && (
              <Input
                variant="rounded"
                size="large"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Display name"
                maxLength={20}
                autoCapitalize="words"
                className="mb-5"
              />
            )}

            <Button
              variant="primary"
              size="large"
              onPress={handleAuth}
              disabled={isLoading}
              className={isLoading ? "bg-gray-400" : ""}
            >
              {isLoading
                ? isSignUp
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>

            <Button
              variant="outline"
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="mt-5 bg-transparent border-0"
              textClassName="text-[#4ECDC4] underline"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </Layout>

          <Layout variant="center">
            <Typography color="accent" align="center" className="leading-6">
              🎤 Guess K-pop songs faster than your opponent!
            </Typography>
          </Layout>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default LoginScreen;

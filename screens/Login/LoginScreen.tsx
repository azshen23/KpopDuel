import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfile, User } from "firebase/auth";
import { auth, authService } from "../../services/authService";
import { styled } from "nativewind";

// Styled components
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView, "flex-1 bg-[#1a1a2e]");
const StyledHeaderView = styled(View, "items-center mb-12");
const StyledTitle = styled(Text, "text-5xl font-bold text-[#FF6B9D] mb-2");
const StyledSubtitle = styled(Text, "text-lg text-[#4ECDC4] text-center");
const StyledFormView = styled(View, "mb-12");
const StyledFormTitle = styled(Text, "text-lg text-white mb-2 text-center");
const StyledTextInput = styled(TextInput, "bg-white rounded-3xl px-5 py-4 text-base mb-5 text-center");
const StyledButton = styled(TouchableOpacity, "rounded-3xl py-4 items-center shadow-lg");
const StyledButtonText = styled(Text, "text-white text-lg font-bold");
const StyledLinkButton = styled(TouchableOpacity, "mt-5 items-center");
const StyledLinkText = styled(Text, "text-[#4ECDC4] text-base underline");
const StyledFooterView = styled(View, "items-center");
const StyledFooterText = styled(Text, "text-base text-[#FFE66D] text-center leading-6");

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
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

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        // User is signed in, navigate to lobby
        const playerName = user.displayName || user.email?.split('@')[0] || 'Player';
        await AsyncStorage.setItem("playerId", user.uid);
        await AsyncStorage.setItem("playerName", playerName);
        
        navigation.replace("Lobby", {
          playerName: playerName,
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

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
      if (isSignUp) {
        // Create new account
        const user = await authService.signUp(email.trim(), password);
        
        // Update the user's display name
        await updateProfile(user, {
          displayName: displayName.trim(),
        });
        
        Alert.alert("Success", "Account created successfully!");
      } else {
        // Sign in existing user
        await authService.signIn(email.trim(), password);
      }
    } catch (error: any) {
      let errorMessage = "Authentication failed";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters";
          break;
        case 'auth/invalid-email':
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
    <StyledKeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', padding: 20}}>
        <StyledHeaderView>
          <StyledTitle>🎵 KpopDuel</StyledTitle>
          <StyledSubtitle>Real-time K-pop Battle Game</StyledSubtitle>
        </StyledHeaderView>

        <StyledFormView>
          <StyledFormTitle>
            {isSignUp ? "Create Account" : "Sign In"}
          </StyledFormTitle>
          
          <StyledTextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <StyledTextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
          />

          {isSignUp && (
            <StyledTextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Display name"
              placeholderTextColor="#999"
              maxLength={20}
              autoCapitalize="words"
            />
          )}

          <StyledButton
            className={isLoading ? 'bg-gray-400' : 'bg-[#FF6B9D]'}
            onPress={handleAuth}
            disabled={isLoading}
          >
            <StyledButtonText>
              {isLoading 
                ? (isSignUp ? "Creating Account..." : "Signing In...") 
                : (isSignUp ? "Create Account" : "Sign In")
              }
            </StyledButtonText>
          </StyledButton>

          <StyledLinkButton
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            <StyledLinkText>
              {isSignUp 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Sign Up"
              }
            </StyledLinkText>
          </StyledLinkButton>
        </StyledFormView>

        <StyledFooterView>
          <StyledFooterText>
            🎤 Guess K-pop songs faster than your opponent!
          </StyledFooterText>
        </StyledFooterView>
      </ScrollView>
     </StyledKeyboardAvoidingView>
   );
};

export default LoginScreen;

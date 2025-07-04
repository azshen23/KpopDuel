import {
  getAuth,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "kpopduel",
});
// Complete the auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Auth service functions
export const authService = {
  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Create Google auth request (to be used in components)
  createGoogleAuthRequest: () => {
    return Google.useAuthRequest({
      iosClientId: "YOUR_IOS_CLIENT_ID",
      androidClientId: "YOUR_ANDROID_CLIENT_ID",
      webClientId: "YOUR_WEB_CLIENT_ID",
      redirectUri,
    });
  },

  // Sign in with Google using the response from auth request
  signInWithGoogleResponse: async (response: any) => {
    try {
      if (response?.type === "success") {
        const { id_token, access_token } = response.params;

        const credential = GoogleAuthProvider.credential(
          id_token,
          access_token
        );
        const result = await signInWithPopup(auth, credential);
        return result.user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // This method is no longer needed with expo-auth-session approach
  handleRedirectResult: async () => {
    // This method is deprecated for Expo apps
    // Authentication is now handled directly in signInWithGoogle
    return null;
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
  },
};

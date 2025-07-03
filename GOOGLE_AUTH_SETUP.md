# Google Authentication Setup for Expo

This guide will help you set up Google Authentication for your KpopDuel Expo app using the proper Expo-compatible method.

## Overview

The app now uses `expo-auth-session` with `expo-web-browser` for Google authentication instead of Firebase's redirect-based methods, which are not compatible with React Native/Expo environments.

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"

### 2. Create OAuth Client IDs

You need to create **3 different OAuth client IDs**:

#### Web Client ID
- Application type: **Web application**
- Authorized redirect URIs: `https://auth.expo.io/@YOUR_EXPO_USERNAME/YOUR_APP_SLUG`
- Replace `YOUR_EXPO_USERNAME` with your Expo username
- Replace `YOUR_APP_SLUG` with your app's slug from `app.json`

#### iOS Client ID
- Application type: **iOS**
- Bundle ID: Get this by running `npx expo prebuild` and checking `ios/KpopDuel.xcodeproj/project.pbxproj`
- Or set it manually in your `app.json` under `expo.ios.bundleIdentifier`

#### Android Client ID
- Application type: **Android**
- Package name: Get this from your `app.json` under `expo.android.package`
- SHA-1 certificate fingerprint: Get this by running `eas credentials -p android`

### 3. Configure App Scheme

The app now includes a custom scheme (`kpopduel`) in `app.json` which is required for production builds and deep linking. This scheme is used for:
- Handling authentication redirects
- Deep linking functionality
- Preventing app crashes in production

The scheme is already configured in your `app.json`:
```json
{
  "expo": {
    "scheme": "kpopduel",
    // ... other config
  }
}
```

### 4. Update Your Code

Replace the placeholder client IDs in the following files:

#### In `services/authService.ts`:
```typescript
createGoogleAuthRequest: () => {
  return Google.useAuthRequest({
    iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID_HERE', 
    webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
  });
},
```

#### In `screens/Login/LoginScreen.tsx`:
```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID_HERE',
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
});
```

### 5. Firebase Configuration

1. In Firebase Console, go to Authentication → Sign-in method
2. Enable Google sign-in
3. Add your **Web Client ID** and **Client Secret** from Google Cloud Console

### 6. Testing

- **Expo Go**: Use the Web Client ID for testing in Expo Go
- **Development Build**: All three client IDs will be used based on the platform
- **Production**: Make sure to use the production SHA-1 fingerprint for Android

## Troubleshooting

### Common Issues:

1. **"getRedirectResult is not a function"** - This error is now fixed by using the Expo-compatible authentication method

2. **Authentication not working in Expo Go** - Make sure you're using the correct Web Client ID and that your redirect URI is properly configured

3. **Android authentication fails** - Verify your SHA-1 fingerprint is correct and matches your build

4. **iOS authentication fails** - Check that your Bundle ID matches exactly

### Getting Client IDs:

You can find your client IDs in Google Cloud Console under:
**APIs & Services** → **Credentials** → **OAuth 2.0 Client IDs**

## Security Notes

- Client IDs are not sensitive and can be committed to your repository
- Never commit client secrets to your repository
- Use environment variables for sensitive configuration in production

## Next Steps

After setting up the client IDs:
1. Test authentication in Expo Go
2. Create a development build for full testing
3. Test on both iOS and Android platforms
4. Deploy to production with proper certificates
# Google Sign-In Setup Guide

## Overview

This guide helps you set up Google Sign-In for your KpopDuel app using Firebase's web-based authentication. The implementation uses `signInWithRedirect` which is compatible with React Native and Expo Go.

## Firebase Console Setup

1. **Go to Firebase Console**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Select your `kpopduel` project

2. **Enable Google Sign-In**
   - Go to **Authentication** > **Sign-in method**
   - Click on **Google** provider
   - Toggle **Enable** to turn it on
   - Add your project support email
   - Click **Save**

3. **Configure Authorized Domains**
   - In the same Authentication settings, go to **Settings** tab
   - Under **Authorized domains**, make sure your development domains are listed:
     - `localhost` (for local development)
     - Your Expo development URL (e.g., `exp://192.168.x.x:8081`)
     - Any production domains you plan to use

## Testing

After setup:
1. Restart your development server
2. Test the Google Sign-In button in your app
3. The sign-in will work in web browsers and Expo Go

## Platform Compatibility

- ✅ **Web**: Full support with redirect-based authentication
- ✅ **Expo Go**: Works with web-based authentication
- ⚠️ **Native builds**: For production native apps, you may need additional configuration

## Troubleshooting

- **"Sign-in failed"**: Check that Google provider is enabled in Firebase
- **"Unauthorized domain"**: Ensure your domain is listed in Firebase authorized domains
- **Redirect issues**: If redirect authentication fails, check your authorized domains configuration

## Security Notes

- The web-based approach uses Firebase's built-in security
- No additional client IDs or secrets needed in your code
- Firebase handles the OAuth flow securely
- For production, ensure proper domain authorization in Firebase Console
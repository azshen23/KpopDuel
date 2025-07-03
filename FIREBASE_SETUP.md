# Firebase Setup Guide

## Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication in your Firebase project
3. Enable Email/Password authentication method

## Configuration

1. In your Firebase project, go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web platform (</>) 
4. Register your app and copy the configuration object
5. Replace the placeholder values in `firebaseConfig.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};
```

## Authentication Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Optionally enable "Email link (passwordless sign-in)" if desired

## Security Rules (Optional)

If you plan to use Firestore for storing user data:

1. Go to Firestore Database > Rules
2. Set up appropriate security rules for your use case

## Testing

1. Run your app: `npm start` or `bun start`
2. Try creating a new account with email/password
3. Test signing in with existing credentials
4. Verify that logout functionality works properly

## Troubleshooting

- Make sure your Firebase configuration is correct
- Check that Email/Password authentication is enabled in Firebase Console
- Verify that your app domain is authorized in Firebase Authentication settings
- Check the browser console for any Firebase-related errors
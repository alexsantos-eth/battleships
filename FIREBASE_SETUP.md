# Firebase Setup for Armada.io

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication
4. In Authentication > Sign-in method, enable "Anonymous" authentication
5. Enable Firestore Database
6. In Firestore Database > Rules, set the following security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
7. Go to Project Settings > General
8. Scroll down to "Your apps" section
9. Add a web app if you haven't already
10. Copy the configuration values to your `.env` file

## Features

- Anonymous authentication for seamless gameplay
- No user registration required
- Persistent session across browser refreshes
- User profile display with sign out functionality
- **User statistics tracking** (games played, wins, losses, accuracy)
- **Game history** with detailed information
- **User preferences** (sound, music, difficulty, theme)
- **Achievements system** (ready for future implementation)
- **Real-time data synchronization** with Firestore 
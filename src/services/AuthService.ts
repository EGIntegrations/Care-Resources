import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: '1041606516821-e14glejnuoadi0frr8kv7kjp6mhnm138.apps.googleusercontent.com', // Web client ID from Firebase
        iosClientId: '1041606516821-3srnqsjb1pbp0p8jsq96ma1oskefb5se.apps.googleusercontent.com', // iOS client ID from GoogleService-Info.plist
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing AuthService:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      await this.initialize();

      // Check if device supports Google Play Services (skip for iOS)
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      } catch (playServicesError) {
        // Continue - this is expected on iOS
      }

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      
      // Try to get idToken from different possible locations
      let idToken = signInResult.idToken;
      if (!idToken && signInResult.data) {
        idToken = signInResult.data.idToken;
      }
      if (!idToken && signInResult.user) {
        idToken = signInResult.user.idToken;
      }

      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const user = auth().currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();

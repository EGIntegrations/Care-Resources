import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AppAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppAuthContext = createContext<AppAuthContextType | undefined>(undefined);

export const useAppAuth = (): AppAuthContextType => {
  const context = useContext(AppAuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AppAuthProvider');
  }
  return context;
};

interface AppAuthProviderProps {
  children: ReactNode;
}

export const AppAuthProvider: React.FC<AppAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      console.log('Firebase auth state changed:', user ? user.email : 'no user');
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // Save auth status to AsyncStorage
        AsyncStorage.setItem('userAuthenticated', 'true');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        AsyncStorage.removeItem('userAuthenticated');
      }
      
      setIsLoading(false);
    });

    return unsubscribe; // Unsubscribe on unmount
  }, []);


  const login = async () => {
    try {
      await AsyncStorage.setItem('userAuthenticated', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth status:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Sign out from Google first (if signed in)
      try {
        const isGoogleSignedIn = await GoogleSignin.isSignedIn();
        if (isGoogleSignedIn) {
          console.log('Signing out from Google...');
          await GoogleSignin.signOut();
        }
      } catch (googleError) {
        console.error('Error signing out from Google:', googleError);
        // Continue with Firebase logout even if Google logout fails
      }
      
      // Sign out from Firebase
      console.log('Signing out from Firebase...');
      await auth().signOut();
      
      // Remove local auth status
      console.log('Clearing local auth status...');
      await AsyncStorage.removeItem('userAuthenticated');
      
      // Firebase auth listener will handle setting isAuthenticated to false
      console.log('Logout completed successfully');
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there are errors
      await AsyncStorage.removeItem('userAuthenticated');
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  return (
    <AppAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppAuthContext.Provider>
  );
};
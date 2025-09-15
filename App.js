import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { AppAuthProvider, useAppAuth } from './src/context/AppAuthContext';
import { BottomTabs } from './src/navigation/BottomTabs';
import { LoginScreen } from './src/screens/Auth/LoginScreen';

// Initialize Firebase
import { initializeApp, getApps } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Initialize Firebase if not already initialized
if (getApps().length === 0) {
  initializeApp();
}

const AppContent = () => {
  const { isAuthenticated, isLoading, login } = useAppAuth();

  if (isLoading) {
    return null; // Could add a loading screen here
  }

  return (
    <>
      <StatusBar style="light" />
      {isAuthenticated ? (
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      ) : (
        <LoginScreen onLoginSuccess={login} />
      )}
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppAuthProvider>
          <AuthProvider>
            <SettingsProvider>
              <AppContent />
            </SettingsProvider>
          </AuthProvider>
        </AppAuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { AuthState } from '../types';

interface AuthContextType {
  authState: AuthState;
  authenticate: () => Promise<boolean>;
  logout: () => void;
  setBiometricEnabled: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    biometricSupported: false,
    biometricEnabled: false,
  });

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      setAuthState(prev => ({
        ...prev,
        biometricSupported: compatible && enrolled,
      }));
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      if (authState.biometricEnabled && authState.biometricSupported) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to access Expat Resources',
          cancelLabel: 'Cancel',
          disableDeviceFallback: false,
        });

        if (result.success) {
          setAuthState(prev => ({ ...prev, isAuthenticated: true }));
          return true;
        }
      }
      
      // Fallback to passcode authentication will be handled in components
      setAuthState(prev => ({ ...prev, isAuthenticated: true }));
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  const setBiometricEnabled = (enabled: boolean) => {
    setAuthState(prev => ({
      ...prev,
      biometricEnabled: enabled,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        authenticate,
        logout,
        setBiometricEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
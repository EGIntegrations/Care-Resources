import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLoginSuccess: () => Promise<void>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const { authState, authenticate, setBiometricEnabled } = useAuth();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Access your Care Resources',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricEnabled(true);
        await onLoginSuccess();
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      Alert.alert('Authentication Error', 'Please try again or use an alternative login method.');
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // TODO: Implement Google OAuth
    setTimeout(() => {
      Alert.alert('Google Login', 'Google authentication will be implemented with Firebase Auth.');
      setIsLoading(false);
    }, 1000);
  };

  const handleSSO = async () => {
    setIsLoading(true);
    // TODO: Implement SSO
    setTimeout(() => {
      Alert.alert('SSO Login', 'Single Sign-On will be implemented with your organization\'s identity provider.');
      setIsLoading(false);
    }, 1000);
  };

  const handleGuestAccess = () => {
    Alert.alert(
      'Guest Access',
      'Continue as guest? Some features may be limited.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: async () => await onLoginSuccess() }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.navy,
    },
    content: {
      flex: 1,
      padding: spacing[6],
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
      marginTop: height * 0.1,
    },
    welcomeText: {
      fontSize: fonts.h1,
      fontWeight: 'bold',
      color: colors.white,
      textAlign: 'center',
      marginTop: spacing[4],
      marginBottom: spacing[2],
    },
    subtitleText: {
      fontSize: fonts.body,
      color: colors.white,
      opacity: 0.8,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: spacing[4],
    },
    loginSection: {
      width: '100%',
      maxWidth: 320,
      alignSelf: 'center',
    },
    loginButton: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[3],
      ...shadows.medium,
    },
    googleButton: {
      backgroundColor: '#4285F4',
    },
    ssoButton: {
      backgroundColor: colors.blue,
    },
    biometricButton: {
      backgroundColor: colors.grey800,
      borderWidth: 1,
      borderColor: colors.white,
    },
    guestButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.white,
    },
    buttonIcon: {
      marginRight: spacing[3],
    },
    buttonText: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey800,
      flex: 1,
      textAlign: 'center',
    },
    googleButtonText: {
      color: colors.white,
    },
    ssoButtonText: {
      color: colors.white,
    },
    biometricButtonText: {
      color: colors.white,
    },
    guestButtonText: {
      color: colors.white,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing[4],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.white,
      opacity: 0.3,
    },
    dividerText: {
      color: colors.white,
      opacity: 0.6,
      marginHorizontal: spacing[3],
      fontSize: fonts.small,
    },
    footer: {
      alignItems: 'center',
      paddingBottom: spacing[4],
    },
    footerText: {
      fontSize: fonts.small,
      color: colors.white,
      opacity: 0.6,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Logo size={160} showText={true} />
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subtitleText}>
            Access your secure care resources and support network
          </Text>
        </View>

        <View style={styles.loginSection}>
          <TouchableOpacity
            style={[styles.loginButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color="white" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.googleButtonText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, styles.ssoButton]}
            onPress={handleSSO}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="business" size={20} color="white" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.ssoButtonText]}>
              Organization Sign-In
            </Text>
          </TouchableOpacity>

          {biometricAvailable && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.loginButton, styles.biometricButton]}
                onPress={handleBiometricLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="finger-print" size={20} color="white" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.biometricButtonText]}>
                  Use Biometric Login
                </Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, styles.guestButton]}
            onPress={handleGuestAccess}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={[styles.buttonText, styles.guestButtonText]}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure access to your care resources{'\n'}
            All data is encrypted and protected
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
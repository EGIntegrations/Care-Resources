import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 120 }) => {
  const { colors, fonts } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      width: size,
      height: size * 0.6,
      backgroundColor: colors.white,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    logoText: {
      fontSize: size * 0.2,
      fontWeight: 'bold',
      color: colors.navy,
    },
    brandText: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.white,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>AGWM</Text>
      </View>
      <Text style={styles.brandText}>Expat Resources</Text>
    </View>
  );
};
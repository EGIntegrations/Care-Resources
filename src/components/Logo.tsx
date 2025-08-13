import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 120, showText = true }) => {
  const { colors, fonts, radii } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: showText ? 8 : 0,
    },
    globeContainer: {
      width: size * 0.35,
      height: size * 0.35,
      backgroundColor: colors.white,
      borderRadius: (size * 0.35) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: size * 0.08,
      shadowColor: colors.navy,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    logoText: {
      fontSize: size * 0.25,
      fontWeight: 'bold',
      color: colors.white,
      letterSpacing: -1,
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
        <View style={styles.globeContainer}>
          <Ionicons name="earth" size={size * 0.2} color={colors.navy} />
        </View>
        <Text style={styles.logoText}>CR</Text>
      </View>
      {showText && <Text style={styles.brandText}>Care Resources</Text>}
    </View>
  );
};
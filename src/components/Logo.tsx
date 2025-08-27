import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  showGlobeOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 120, showGlobeOnly = false }) => {
  const logoSource = require('../../assets/logo.png');

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImage: {
      width: showGlobeOnly ? size * 0.6 : size,
      height: showGlobeOnly ? size * 0.6 : size,
      resizeMode: 'contain',
    },
  });

  return (
    <View style={styles.container}>
      <Image source={logoSource} style={styles.logoImage} />
    </View>
  );
};
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Pathway } from '../types';

interface PathwayCardProps {
  pathway: Pathway;
  onPress: () => void;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({ pathway, onPress }) => {
  const { colors, fonts, radii, shadows } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: pathway.color,
      borderRadius: radii.md,
      padding: 16,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      ...shadows.medium,
    },
    iconContainer: {
      marginRight: 16,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.white,
      marginBottom: 4,
    },
    description: {
      fontSize: fonts.small,
      color: colors.white,
      opacity: 0.9,
    },
    chevron: {
      marginLeft: 12,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={pathway.icon as keyof typeof Ionicons.glyphMap} 
          size={32} 
          color={colors.white} 
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{pathway.name}</Text>
        <Text style={styles.description}>{pathway.description}</Text>
      </View>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={24} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
};
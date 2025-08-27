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
  const { colors, fonts, radii, shadows, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
      marginVertical: spacing[2],
      flexDirection: 'row',
      alignItems: 'center',
      borderLeftWidth: 6,
      borderLeftColor: pathway.color,
      ...shadows.medium,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: pathway.color,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing[4],
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[1],
    },
    description: {
      fontSize: fonts.small,
      color: colors.grey700,
      opacity: 0.8,
      lineHeight: 18,
    },
    chevron: {
      marginLeft: spacing[3],
      padding: spacing[2],
      borderRadius: radii.sm,
      backgroundColor: pathway.color,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={pathway.icon as keyof typeof Ionicons.glyphMap} 
          size={24} 
          color={colors.white} 
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{pathway.name}</Text>
        <Text style={styles.description}>{pathway.description}</Text>
      </View>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={20} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
};
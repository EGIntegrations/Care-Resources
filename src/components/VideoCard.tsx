import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onPress: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const { colors, fonts, radii, shadows } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 6,
      backgroundColor: colors.white,
      borderRadius: radii.md,
      ...shadows.medium,
    },
    imageContainer: {
      position: 'relative',
      borderTopLeftRadius: radii.md,
      borderTopRightRadius: radii.md,
      overflow: 'hidden',
    },
    thumbnail: {
      width: '100%',
      height: 120,
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 30,
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    duration: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    durationText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '500',
    },
    content: {
      padding: 12,
    },
    title: {
      fontSize: fonts.small,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: 4,
    },
    category: {
      fontSize: 12,
      color: colors.blue,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: video.thumb }} style={styles.thumbnail} />
        <View style={styles.playOverlay}>
          <View style={styles.playIcon}>
            <Ionicons name="play" size={24} color={colors.navy} />
          </View>
        </View>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        {video.category && (
          <Text style={styles.category}>{video.category}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
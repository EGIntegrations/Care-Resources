import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../theme/ThemeProvider';
import { VideoCard } from '../../components/VideoCard';
import { VideosStackParamList } from '../../navigation/stacks/VideosStack';
import { Video } from '../../types';
import { apiService } from '../../services/api';

type VideosScreenNavigationProp = StackNavigationProp<VideosStackParamList, 'Videos'>;

const VideosScreen: React.FC = () => {
  const navigation = useNavigation<VideosScreenNavigationProp>();
  const { colors, fonts, spacing } = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const videosFromApi = await apiService.getVideos();
      setVideos(videosFromApi);
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback to local data if API fails
      const localVideos = require('../../data/videos.json');
      setVideos(localVideos);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const handleVideoPress = (video: Video) => {
    navigation.navigate('VideoPlayer', { video });
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <VideoCard video={item} onPress={() => handleVideoPress(item)} />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grey100,
    },
    header: {
      backgroundColor: colors.navy,
      padding: spacing[4],
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: fonts.h1,
      fontWeight: 'bold',
      color: colors.white,
    },
    content: {
      flex: 1,
      padding: spacing[2],
    },
    list: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[4],
    },
    emptyText: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Library</Text>
      </View>
      
      <View style={styles.content}>
        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos available</Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.blue}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default VideosScreen;
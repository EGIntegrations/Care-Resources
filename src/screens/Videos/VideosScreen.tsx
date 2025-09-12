import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Security Briefs', 'Mental Health', 'Crisis Care', 'Family', 'Community', 'General'];

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(video => video.category === selectedCategory));
    }
  }, [videos, selectedCategory]);

  const loadVideos = async () => {
    try {
      // Load local data first for immediate display
      const localVideos = require('../../data/videos.json');
      setVideos(localVideos);
      setFilteredVideos(localVideos);
      setLoading(false);
      
      // Then try to sync with API in background
      try {
        const videosFromApi = await apiService.getVideos();
        if (videosFromApi.length > 0) {
          setVideos(videosFromApi);
          setFilteredVideos(videosFromApi);
        }
      } catch (apiError) {
        console.log('API sync failed, using local data:', apiError);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setLoading(false);
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
      backgroundColor: '#051838',
    },
    safeArea: {
      backgroundColor: '#051838',
    },
    header: {
      backgroundColor: '#051838',
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
      backgroundColor: colors.grey100,
      padding: spacing[2],
    },
    categorySection: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[3],
    },
    categoryScroll: {
      paddingHorizontal: spacing[1],
    },
    categoryButton: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      marginHorizontal: spacing[1],
      borderRadius: 20,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.grey300,
    },
    activeCategoryButton: {
      backgroundColor: colors.blue,
      borderColor: colors.blue,
    },
    categoryButtonText: {
      fontSize: fonts.small,
      color: colors.grey700,
      fontWeight: '500',
    },
    activeCategoryButtonText: {
      color: colors.white,
    },
    list: {
      flex: 1,
      paddingTop: spacing[2],
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[4],
    },
    emptyText: {
      fontSize: fonts.body,
      color: colors.navy,
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}><SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Library</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.activeCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading videos...</Text>
          </View>
        ) : filteredVideos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos available in {selectedCategory}</Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={filteredVideos}
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
    </View>
  );
};

export default VideosScreen;
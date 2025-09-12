import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { VideosStackParamList } from '../../navigation/stacks/VideosStack';

type VideoPlayerScreenRouteProp = RouteProp<VideosStackParamList, 'VideoPlayer'>;

const VideoPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<VideoPlayerScreenRouteProp>();
  const { colors, fonts, spacing } = useTheme();
  const { video } = route.params;
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);


  const togglePlayback = () => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        videoRef.current?.pauseAsync();
      } else {
        videoRef.current?.playAsync();
      }
    }
  };

  const handleBack = () => {
    videoRef.current?.pauseAsync();
    navigation.goBack();
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#051838',
    },
    videoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing[4],
    },
    video: {
      width: '90%',
      height: 250,
      borderRadius: 8,
      backgroundColor: '#000',
      borderWidth: 2,
      borderColor: colors.white,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: showControls ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
    },
    topControls: {
      position: 'absolute',
      top: StatusBar.currentHeight || 44,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
      opacity: showControls ? 1 : 0,
    },
    backButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      padding: spacing[2],
    },
    titleContainer: {
      flex: 1,
      marginLeft: spacing[3],
    },
    videoTitle: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.white,
    },
    videoDuration: {
      fontSize: fonts.small,
      color: colors.white,
      opacity: 0.8,
      marginTop: 2,
    },
    centerControls: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -30 }, { translateY: -30 }],
      opacity: showControls ? 1 : 0,
    },
    playButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 30,
      padding: spacing[4],
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: spacing[4],
      opacity: showControls ? 1 : 0,
    },
    description: {
      fontSize: fonts.body,
      color: colors.white,
      lineHeight: 20,
    },
    category: {
      fontSize: fonts.small,
      color: colors.yellow,
      fontWeight: '600',
      marginTop: spacing[2],
    },
    expandButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 15,
      padding: spacing[2],
    },
    // Fullscreen modal styles
    fullscreenModal: {
      flex: 1,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fullscreenVideo: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    fullscreenOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
    },
    fullscreenCloseButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 20,
      padding: 10,
      zIndex: 1000,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      
      <TouchableOpacity style={styles.videoContainer} onPress={toggleControls} activeOpacity={1}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: video.url }}
          useNativeControls={false}
          resizeMode="contain"
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          shouldPlay={false}
          onError={(error) => {
            console.error('Video error:', error);
            console.error('Video URL:', video.url);
          }}
          onLoad={() => console.log('Video loaded:', video.url)}
        />
        
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {video.title}
              </Text>
              <Text style={styles.videoDuration}>{video.duration}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setIsFullscreen(true)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="expand" 
                size={20} 
                color={colors.white} 
              />
            </TouchableOpacity>
          </View>

          {!status.isPlaying && (
            <TouchableOpacity
              style={styles.centerControls}
              onPress={togglePlayback}
              activeOpacity={0.7}
            >
              <View style={styles.playButton}>
                <Ionicons name="play" size={32} color={colors.navy} />
              </View>
            </TouchableOpacity>
          )}

          {video.description && (
            <View style={styles.bottomInfo}>
              <Text style={styles.description}>{video.description}</Text>
              {video.category && (
                <Text style={styles.category}>{video.category}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={isFullscreen}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarHidden={true}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setIsFullscreen(false)}
      >
        <View style={styles.fullscreenModal}>
          <Video
            ref={videoRef}
            style={styles.fullscreenVideo}
            source={{ uri: video.url }}
            useNativeControls={false}
            resizeMode="contain"
            isLooping={false}
            shouldPlay={true}
            onPlaybackStatusUpdate={setStatus}
          />
          
          <View style={styles.fullscreenOverlay}>
            <TouchableOpacity
              style={styles.fullscreenCloseButton}
              onPress={() => setIsFullscreen(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default VideoPlayerScreen;
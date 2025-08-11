import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideosScreen from '../../screens/Videos/VideosScreen';
import VideoPlayerScreen from '../../screens/Videos/VideoPlayerScreen';
import { Video } from '../../types';

export type VideosStackParamList = {
  Videos: undefined;
  VideoPlayer: { video: Video };
};

const Stack = createStackNavigator<VideosStackParamList>();

export const VideosStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Videos" component={VideosScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
    </Stack.Navigator>
  );
};
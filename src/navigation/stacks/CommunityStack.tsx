import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../../screens/Community/CommunityScreen';

export type CommunityStackParamList = {
  Community: undefined;
};

const Stack = createStackNavigator<CommunityStackParamList>();

export const CommunityStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  );
};
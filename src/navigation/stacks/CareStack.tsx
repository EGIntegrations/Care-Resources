import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CareScreen from '../../screens/Care/CareScreen';
import PathwayDetailScreen from '../../screens/Care/PathwayDetailScreen';
import { Pathway } from '../../types';

export type CareStackParamList = {
  Care: undefined;
  PathwayDetail: { pathway: Pathway };
};

const Stack = createStackNavigator<CareStackParamList>();

export const CareStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Care" component={CareScreen} />
      <Stack.Screen name="PathwayDetail" component={PathwayDetailScreen} />
    </Stack.Navigator>
  );
};
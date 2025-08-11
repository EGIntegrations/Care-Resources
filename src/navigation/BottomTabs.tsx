import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { HomeStack } from './stacks/HomeStack';
import { VideosStack } from './stacks/VideosStack';
import { CareStack } from './stacks/CareStack';
import { ContactsStack } from './stacks/ContactsStack';
import { CommunityStack } from './stacks/CommunityStack';
import { SettingsStack } from './stacks/SettingsStack';

export type BottomTabParamList = {
  HomeStack: undefined;
  VideosStack: undefined;
  CareStack: undefined;
  ContactsStack: undefined;
  CommunityStack: undefined;
  SettingsStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeStack':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'VideosStack':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;
            case 'CareStack':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'ContactsStack':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'CommunityStack':
              iconName = focused ? 'globe' : 'globe-outline';
              break;
            case 'SettingsStack':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.grey700,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.grey200,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="VideosStack"
        component={VideosStack}
        options={{
          tabBarLabel: 'Videos',
        }}
      />
      <Tab.Screen
        name="CareStack"
        component={CareStack}
        options={{
          tabBarLabel: 'Care',
        }}
      />
      <Tab.Screen
        name="ContactsStack"
        component={ContactsStack}
        options={{
          tabBarLabel: 'Contacts',
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          tabBarLabel: 'Community',
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};
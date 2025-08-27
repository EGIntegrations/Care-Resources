import React, { memo, useMemo } from 'react';
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

// Memoized icon component to prevent unnecessary rerenders
const TabBarIcon = memo(({ route, focused, color, size }: {
  route: { name: string };
  focused: boolean;
  color: string;
  size: number;
}) => {
  const iconName = useMemo(() => {
    switch (route.name) {
      case 'HomeStack':
        return focused ? 'home' : 'home-outline';
      case 'VideosStack':
        return focused ? 'play-circle' : 'play-circle-outline';
      case 'CareStack':
        return focused ? 'heart' : 'heart-outline';
      case 'ContactsStack':
        return focused ? 'people' : 'people-outline';
      case 'CommunityStack':
        return focused ? 'globe' : 'globe-outline';
      case 'SettingsStack':
        return focused ? 'settings' : 'settings-outline';
      default:
        return 'help-outline';
    }
  }, [route.name, focused]);

  return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
});

TabBarIcon.displayName = 'TabBarIcon';

export const BottomTabs: React.FC = memo(() => {
  const { colors } = useTheme();

  // Memoize screen options to prevent recreation on every render
  const getScreenOptions = useMemo(() => 
    ({ route }: { route: { name: string } }) => ({
      tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
        <TabBarIcon route={route} focused={focused} color={color} size={size} />
      ),
      tabBarActiveTintColor: colors.navy,
      tabBarInactiveTintColor: colors.grey700,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopColor: colors.grey200,
        elevation: 8,
        shadowColor: colors.grey700,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      headerShown: false,
      lazy: true, // Enable lazy loading for better performance
    }), [colors]
  );

  return (
    <Tab.Navigator
      screenOptions={getScreenOptions}
      sceneContainerStyle={{ backgroundColor: colors.grey100 }}
      backBehavior="history"
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          unmountOnBlur: false, // Keep screens mounted for better performance
        }}
      />
      <Tab.Screen
        name="VideosStack"
        component={VideosStack}
        options={{
          tabBarLabel: 'Videos',
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="CareStack"
        component={CareStack}
        options={{
          tabBarLabel: 'Care',
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="ContactsStack"
        component={ContactsStack}
        options={{
          tabBarLabel: 'Contacts',
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          tabBarLabel: 'Community',
          unmountOnBlur: false,
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          unmountOnBlur: false,
        }}
      />
    </Tab.Navigator>
  );
});

BottomTabs.displayName = 'BottomTabs';
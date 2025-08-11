import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ContactsScreen from '../../screens/Contacts/ContactsScreen';

export type ContactsStackParamList = {
  Contacts: undefined;
};

const Stack = createStackNavigator<ContactsStackParamList>();

export const ContactsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Contacts" component={ContactsScreen} />
    </Stack.Navigator>
  );
};
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Contact } from '../types';

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const { colors, fonts, radii, shadows, spacing } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contact.email}`);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
      marginVertical: spacing[2],
      flexDirection: 'row',
      alignItems: 'center',
      ...shadows.medium,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: spacing[4],
    },
    content: {
      flex: 1,
    },
    name: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: 2,
    },
    title: {
      fontSize: fonts.small,
      color: colors.blue,
      marginBottom: 2,
    },
    department: {
      fontSize: fonts.small - 2,
      color: colors.grey700,
      opacity: 0.7,
    },
    actions: {
      flexDirection: 'row',
      marginLeft: spacing[3],
    },
    actionButton: {
      backgroundColor: colors.grey100,
      borderRadius: radii.sm,
      padding: spacing[2],
      marginHorizontal: spacing[1],
    },
    callButton: {
      backgroundColor: colors.green,
    },
    emailButton: {
      backgroundColor: colors.blue,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={{ uri: contact.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.title}>{contact.title}</Text>
        {contact.department && (
          <Text style={styles.department}>{contact.department}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={18} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.emailButton]}
          onPress={handleEmail}
          activeOpacity={0.7}
        >
          <Ionicons name="mail" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
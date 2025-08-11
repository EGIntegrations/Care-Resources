import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSettings } from '../../context/SettingsContext';
import { ContactCard } from '../../components/ContactCard';
import { PasscodeModal } from '../../components/PasscodeModal';
import { Contact } from '../../types';
import { apiService } from '../../services/api';

const ContactsScreen: React.FC = () => {
  const { colors, fonts, spacing } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  useEffect(() => {
    if (settings.contactsUnlocked) {
      loadContacts();
    } else {
      setShowPasscodeModal(true);
    }
  }, [settings.contactsUnlocked]);

  const loadContacts = async () => {
    try {
      const contactsFromApi = await apiService.getContacts();
      setContacts(contactsFromApi);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handlePasscodeSuccess = () => {
    setShowPasscodeModal(false);
    updateSettings({ contactsUnlocked: true });
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <ContactCard contact={item} />
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
      padding: spacing[4],
    },
    description: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      marginBottom: spacing[4],
      lineHeight: 22,
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
    lockedContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[4],
    },
    lockedText: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      marginBottom: spacing[4],
    },
  });

  if (!settings.contactsUnlocked) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>
        </View>
        
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>
            This directory contains sensitive contact information.
            Please enter the shared passcode to access.
          </Text>
        </View>

        <PasscodeModal
          visible={showPasscodeModal}
          onSuccess={handlePasscodeSuccess}
          title="Access Contacts"
          message="Enter the shared passcode to view the contact directory."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Your support network of regional directors, counselors, and care coordinators. 
          Tap to call or email directly.
        </Text>
        
        {contacts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No contacts available</Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ContactsScreen;
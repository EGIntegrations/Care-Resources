import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../theme/ThemeProvider';
import { useSettings } from '../../context/SettingsContext';
import { ContactCard } from '../../components/ContactCard';
import { PasscodeModal } from '../../components/PasscodeModal';
import { Contact } from '../../types';
import { apiService } from '../../services/api';

const ContactsScreen: React.FC = () => {
  const { colors, fonts, spacing, radii } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    if (settings.contactsUnlocked) {
      loadContacts();
    } else {
      attemptBiometricAuth();
    }
  }, [settings.contactsUnlocked]);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const attemptBiometricAuth = async () => {
    if (biometricAvailable && settings.biometricEnabled) {
      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Access secure contact directory',
          cancelLabel: 'Use Passcode',
          disableDeviceFallback: false,
        });

        if (result.success) {
          updateSettings({ contactsUnlocked: true });
          return;
        }
      } catch (error) {
        console.error('Biometric auth error:', error);
      }
    }
    
    setShowPasscodeModal(true);
  };

  const loadContacts = async () => {
    try {
      const contactsFromApi = await apiService.getContacts();
      setContacts(contactsFromApi);
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Fallback to local data if API fails
      const localContacts = require('../../data/contacts.json');
      setContacts(localContacts);
    }
  };

  const handlePasscodeSuccess = () => {
    setShowPasscodeModal(false);
    updateSettings({ contactsUnlocked: true });
  };

  const handlePasscodeCancel = () => {
    setShowPasscodeModal(false);
    // Could navigate back or show alternative content
  };

  const handleRetryBiometric = () => {
    attemptBiometricAuth();
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <ContactCard contact={item} />
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
    biometricButton: {
      alignItems: 'center',
      padding: spacing[4],
      backgroundColor: '#051838',
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.blue,
      marginTop: spacing[4],
    },
    biometricButtonText: {
      fontSize: fonts.body,
      color: colors.blue,
      marginTop: spacing[2],
      fontWeight: '600',
    },
  });

  if (!settings.contactsUnlocked) {
    return (
      <View style={styles.container}><SafeAreaView style={styles.safeArea} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contacts</Text>
        </View>
        
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedText}>
            This directory contains sensitive contact information.
            Please authenticate to access.
          </Text>
          
          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleRetryBiometric}
              activeOpacity={0.7}
            >
              <Ionicons name="finger-print" size={32} color={colors.blue} />
              <Text style={styles.biometricButtonText}>Use Biometric Authentication</Text>
            </TouchableOpacity>
          )}
        </View>

        <PasscodeModal
          visible={showPasscodeModal}
          onSuccess={handlePasscodeSuccess}
          onCancel={handlePasscodeCancel}
          title="Access Contacts"
          message="Enter the shared passcode to view the contact directory."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}><SafeAreaView style={styles.safeArea} />
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
    </View>
  );
};

export default ContactsScreen;
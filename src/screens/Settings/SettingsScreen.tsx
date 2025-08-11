import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen: React.FC = () => {
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { authState, setBiometricEnabled, logout } = useAuth();

  const handleBiometricToggle = (enabled: boolean) => {
    if (enabled && !authState.biometricSupported) {
      Alert.alert(
        'Biometric Authentication',
        'Biometric authentication is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setBiometricEnabled(enabled);
    updateSettings({ biometricEnabled: enabled });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? You will need to authenticate again to access the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            resetSettings();
          },
        },
      ]
    );
  };

  const handleContactsReset = () => {
    Alert.alert(
      'Reset Contacts Access',
      'This will require you to re-enter the passcode to access contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => updateSettings({ contactsUnlocked: false }),
        },
      ]
    );
  };

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
    section: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      marginBottom: spacing[4],
      ...shadows.small,
    },
    sectionTitle: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.grey700,
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.grey200,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: colors.grey200,
    },
    lastSettingItem: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: spacing[3],
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: fonts.body,
      fontWeight: '500',
      color: colors.grey700,
    },
    settingDescription: {
      fontSize: fonts.small,
      color: colors.grey700,
      opacity: 0.7,
      marginTop: 2,
    },
    settingControl: {
      marginLeft: spacing[2],
    },
    logoutButton: {
      backgroundColor: colors.danger,
      borderRadius: radii.md,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.medium,
    },
    logoutButtonText: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.white,
      marginLeft: spacing[2],
    },
    resetButton: {
      backgroundColor: colors.orange,
      borderRadius: radii.sm,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    resetButtonText: {
      fontSize: fonts.small,
      fontWeight: '600',
      color: colors.white,
    },
    disabledText: {
      opacity: 0.5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="finger-print-outline"
                size={24}
                color={authState.biometricSupported ? colors.blue : colors.grey700}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle,
                !authState.biometricSupported && styles.disabledText
              ]}>
                Biometric Authentication
              </Text>
              <Text style={styles.settingDescription}>
                {authState.biometricSupported
                  ? 'Use Face ID or Touch ID to unlock the app'
                  : 'Not available on this device'
                }
              </Text>
            </View>
            <View style={styles.settingControl}>
              <Switch
                value={settings.biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: colors.grey200, true: colors.blue }}
                thumbColor={colors.white}
                disabled={!authState.biometricSupported}
              />
            </View>
          </View>

          <View style={[styles.settingItem, styles.lastSettingItem]}>
            <View style={styles.settingIcon}>
              <Ionicons name="people-outline" size={24} color={colors.blue} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Contacts Access</Text>
              <Text style={styles.settingDescription}>
                {settings.contactsUnlocked ? 'Unlocked' : 'Locked - requires passcode'}
              </Text>
            </View>
            {settings.contactsUnlocked && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleContactsReset}
                activeOpacity={0.7}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={24} color={colors.blue} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive important updates and reminders
              </Text>
            </View>
            <View style={styles.settingControl}>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
                trackColor={{ false: colors.grey200, true: colors.blue }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          <View style={[styles.settingItem, styles.lastSettingItem]}>
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={24} color={colors.blue} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Use dark theme (coming soon)
              </Text>
            </View>
            <View style={styles.settingControl}>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSettings({ darkMode: value })}
                trackColor={{ false: colors.grey200, true: colors.blue }}
                thumbColor={colors.white}
                disabled
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.white} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
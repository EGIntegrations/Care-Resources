import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme/ThemeProvider';
import { Logo } from '../../components/Logo';
import { BottomTabParamList } from '../../navigation/BottomTabs';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, fonts, spacing, radii, shadows } = useTheme();

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
    content: {
      flex: 1,
      padding: spacing[4],
    },
    welcomeSection: {
      alignItems: 'center',
      marginBottom: spacing[5],
    },
    welcomeTitle: {
      fontSize: fonts.h1,
      fontWeight: 'bold',
      color: colors.grey700,
      textAlign: 'center',
      marginBottom: spacing[2],
    },
    welcomeText: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      lineHeight: 22,
      marginHorizontal: spacing[3],
    },
    buttonsSection: {
      marginBottom: spacing[5],
    },
    primaryButton: {
      backgroundColor: colors.blue,
      borderRadius: radii.md,
      padding: spacing[4],
      alignItems: 'center',
      marginBottom: spacing[3],
      ...shadows.medium,
    },
    secondaryButton: {
      backgroundColor: colors.yellow,
      borderRadius: radii.md,
      padding: spacing[4],
      alignItems: 'center',
      marginBottom: spacing[3],
      ...shadows.medium,
    },
    buttonText: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.white,
    },
    quickLinksSection: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[4],
    },
    quickLinksGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    quickLinkCard: {
      width: '48%',
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
      alignItems: 'center',
      marginBottom: spacing[3],
      ...shadows.small,
    },
    quickLinkTitle: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey700,
      textAlign: 'center',
    },
    quickLinkDescription: {
      fontSize: fonts.small,
      color: colors.grey700,
      textAlign: 'center',
      marginTop: spacing[1],
      opacity: 0.8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size={100} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Expat Resources</Text>
          <Text style={styles.welcomeText}>
            Your comprehensive support system for life and ministry abroad. 
            Access videos, care pathways, and connect with your support network.
          </Text>
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('VideosStack')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Watch Videos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('CareStack')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickLinksSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          <View style={styles.quickLinksGrid}>
            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('CommunityStack')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickLinkTitle}>Community</Text>
              <Text style={styles.quickLinkDescription}>
                Events & Groups
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('ContactsStack')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickLinkTitle}>Contacts</Text>
              <Text style={styles.quickLinkDescription}>
                Support Network
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('VideosStack')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickLinkTitle}>Training</Text>
              <Text style={styles.quickLinkDescription}>
                Video Library
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('SettingsStack')}
              activeOpacity={0.7}
            >
              <Text style={styles.quickLinkTitle}>Settings</Text>
              <Text style={styles.quickLinkDescription}>
                Preferences
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
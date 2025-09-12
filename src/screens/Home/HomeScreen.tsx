import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme/ThemeProvider';
import { Logo } from '../../components/Logo';
import { BottomTabParamList } from '../../navigation/BottomTabs';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const [showAllQuickAccess, setShowAllQuickAccess] = useState(true);

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
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      alignItems: 'center',
      minHeight: 60,
    },
    content: {
      flex: 1,
      backgroundColor: colors.grey100,
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    secondaryButton: {
      backgroundColor: colors.yellow,
      borderRadius: radii.md,
      padding: spacing[4],
      alignItems: 'center',
      marginBottom: spacing[3],
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonText: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.white,
    },
    quickLinksSection: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[3],
    },
    sectionTitle: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.navy,
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <Logo size={180} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Care Resources</Text>
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
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowAllQuickAccess(!showAllQuickAccess)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <Ionicons 
              name={showAllQuickAccess ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={colors.grey700} 
            />
          </TouchableOpacity>
          
          <View style={styles.quickLinksGrid}>
            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('ContactsStack')}
              activeOpacity={0.7}
            >
              <Ionicons name="people-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
              <Text style={styles.quickLinkTitle}>Contacts</Text>
              <Text style={styles.quickLinkDescription}>
                Support Network
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickLinkCard}
              onPress={() => navigation.navigate('CareStack', { 
                screen: 'CarePathwayDetails', 
                params: { pathwayId: 'tck-care' } 
              })}
              activeOpacity={0.7}
            >
              <Ionicons name="people-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
              <Text style={styles.quickLinkTitle}>TCK Care</Text>
              <Text style={styles.quickLinkDescription}>
                Family & Education
              </Text>
            </TouchableOpacity>

            {showAllQuickAccess && (
              <>
                <TouchableOpacity
                  style={styles.quickLinkCard}
                  onPress={() => navigation.navigate('VideosStack')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="play-circle-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
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
                  <Ionicons name="settings-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
                  <Text style={styles.quickLinkTitle}>Settings</Text>
                  <Text style={styles.quickLinkDescription}>
                    Preferences
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLinkCard}
                  onPress={() => navigation.navigate('CareStack', { 
                    screen: 'CarePathwayDetails', 
                    params: { pathwayId: 'wellness' } 
                  })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="leaf-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
                  <Text style={styles.quickLinkTitle}>Wellness</Text>
                  <Text style={styles.quickLinkDescription}>
                    Reentry & Life Support
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLinkCard}
                  onPress={() => navigation.navigate('CareStack', { 
                    screen: 'CarePathwayDetails', 
                    params: { pathwayId: 'mental-health' } 
                  })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="heart-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
                  <Text style={styles.quickLinkTitle}>Mental Health</Text>
                  <Text style={styles.quickLinkDescription}>
                    Counseling Support
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLinkCard}
                  onPress={() => navigation.navigate('CareStack', { 
                    screen: 'CarePathwayDetails', 
                    params: { pathwayId: 'global-security' } 
                  })}
                  activeOpacity={0.7}
                >
                  <Ionicons name="shield-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
                  <Text style={styles.quickLinkTitle}>Global Security</Text>
                  <Text style={styles.quickLinkDescription}>
                    Safety & Crisis Support
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLinkCard}
                  onPress={() => navigation.navigate('CommunityStack')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={24} color={colors.blue} style={{ marginBottom: spacing[1] }} />
                  <Text style={styles.quickLinkTitle}>Events</Text>
                  <Text style={styles.quickLinkDescription}>
                    Upcoming Events
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
}

const upcomingEvents: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Expat Family Webinar',
    date: '2024-02-15',
    time: '7:00 PM EST',
    location: 'Virtual',
    description: 'Supporting children through cultural transitions',
  },
  {
    id: 'e2',
    title: 'Regional Prayer Meeting',
    date: '2024-02-20',
    time: '9:00 AM EST',
    location: 'Virtual',
    description: 'Monthly prayer and fellowship time',
  },
  {
    id: 'e3',
    title: 'Mental Health Workshop',
    date: '2024-02-25',
    time: '2:00 PM EST',
    location: 'Virtual',
    description: 'Building resilience while serving abroad',
  },
];

const localGroups: CommunityGroup[] = [
  {
    id: 'g1',
    name: 'European Expats',
    description: 'Connect with families serving across Europe',
    image: 'https://picsum.photos/150/100?random=41',
    memberCount: 45,
  },
  {
    id: 'g2',
    name: 'Asian Ministry Network',
    description: 'Support network for Asian ministry families',
    image: 'https://picsum.photos/150/100?random=42',
    memberCount: 32,
  },
  {
    id: 'g3',
    name: 'Africa Connect',
    description: 'Serving families across the African continent',
    image: 'https://picsum.photos/150/100?random=43',
    memberCount: 28,
  },
];

const CommunityScreen: React.FC = () => {
  const { colors, fonts, spacing, radii, shadows } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleVisitForum = () => {
    Linking.openURL('https://community.agwm.org');
  };

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
    },
    section: {
      padding: spacing[4],
    },
    sectionTitle: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[4],
    },
    eventCard: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
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
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing[2],
    },
    eventTitle: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey700,
      flex: 1,
      marginRight: spacing[2],
    },
    eventDate: {
      fontSize: fonts.small,
      color: colors.blue,
      fontWeight: '600',
    },
    eventDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    eventTime: {
      fontSize: fonts.small,
      color: colors.grey700,
      marginRight: spacing[3],
    },
    eventLocation: {
      fontSize: fonts.small,
      color: colors.grey700,
      marginLeft: spacing[1],
    },
    eventDescription: {
      fontSize: fonts.small,
      color: colors.grey700,
      opacity: 0.8,
    },
    groupsContainer: {
      paddingHorizontal: spacing[4],
    },
    groupsList: {
      flexDirection: 'row',
      marginBottom: spacing[4],
    },
    groupCard: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[3],
      marginRight: spacing[3],
      width: 150,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    groupImage: {
      width: '100%',
      height: 80,
      borderRadius: radii.sm,
      marginBottom: spacing[2],
    },
    groupName: {
      fontSize: fonts.small,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[1],
    },
    groupDescription: {
      fontSize: 12,
      color: colors.grey700,
      opacity: 0.8,
      marginBottom: spacing[1],
    },
    memberCount: {
      fontSize: 12,
      color: colors.blue,
      fontWeight: '500',
    },
    forumSection: {
      padding: spacing[4],
    },
    forumButton: {
      backgroundColor: colors.blue,
      borderRadius: radii.md,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    forumButtonText: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.white,
      marginLeft: spacing[2],
    },
  });

  return (
    <View style={styles.container}><SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
              </View>
              
              <View style={styles.eventDetails}>
                <Ionicons name="time-outline" size={14} color={colors.grey700} />
                <Text style={styles.eventTime}>{event.time}</Text>
                <Ionicons name="location-outline" size={14} color={colors.grey700} />
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
              
              <Text style={styles.eventDescription}>{event.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.groupsContainer}>
          <Text style={styles.sectionTitle}>Local Groups</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.groupsList}>
              {localGroups.map((group) => (
                <View key={group.id} style={styles.groupCard}>
                  <Image source={{ uri: group.image }} style={styles.groupImage} />
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                  <Text style={styles.memberCount}>{group.memberCount} members</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.forumSection}>
          <TouchableOpacity
            style={styles.forumButton}
            onPress={handleVisitForum}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={24} color={colors.white} />
            <Text style={styles.forumButtonText}>Visit Community Forum</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityScreen;
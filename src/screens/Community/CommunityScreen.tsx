import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { eventsService, Event } from '../../services/EventsService';

interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}


const CommunityScreen: React.FC = () => {
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const upcomingEvents = await eventsService.getUpcomingEvents();
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    eventsService.clearCache();
    await loadEvents();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
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
      color: colors.white,
      marginBottom: spacing[4],
    },
    eventCard: {
      backgroundColor: colors.navy,
      borderRadius: radii.md,
      padding: spacing[4],
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.blue,
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
      color: colors.white,
      flex: 1,
      marginRight: spacing[2],
    },
    eventDate: {
      fontSize: fonts.small,
      color: colors.yellow,
      fontWeight: '600',
    },
    eventDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    eventTime: {
      fontSize: fonts.small,
      color: colors.white,
      marginRight: spacing[3],
    },
    eventLocation: {
      fontSize: fonts.small,
      color: colors.white,
      marginLeft: spacing[1],
    },
    eventDescription: {
      fontSize: fonts.small,
      color: colors.white,
      opacity: 0.8,
      marginBottom: spacing[2],
    },
    registerSection: {
      marginTop: spacing[2],
      paddingTop: spacing[2],
      borderTopWidth: 1,
      borderTopColor: colors.blue,
    },
    registerText: {
      fontSize: fonts.small,
      color: colors.blue,
      fontWeight: '600',
      textAlign: 'center',
    },
    loadingText: {
      fontSize: fonts.body,
      color: colors.white,
      textAlign: 'center',
      fontWeight: '500',
    },
    emptyText: {
      fontSize: fonts.body,
      color: colors.white,
      textAlign: 'center',
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}><SafeAreaView style={styles.safeArea} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading events...</Text>
          ) : events.length === 0 ? (
            <Text style={styles.emptyText}>No new events at this time</Text>
          ) : (
            events.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => {
                if (event.registrationUrl) {
                  Linking.openURL(event.registrationUrl);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
              </View>
              
              <View style={styles.eventDetails}>
                <Ionicons name="time-outline" size={14} color={colors.white} />
                <Text style={styles.eventTime}>{event.time}</Text>
                <Ionicons name="location-outline" size={14} color={colors.white} />
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
              
              <Text style={styles.eventDescription}>{event.description}</Text>
              
              {event.registrationUrl && (
                <View style={styles.registerSection}>
                  <Text style={styles.registerText}>Tap to register →</Text>
                </View>
              )}
            </TouchableOpacity>
            ))
          )}
        </View>


      </ScrollView>
    </View>
  );
};

export default CommunityScreen;
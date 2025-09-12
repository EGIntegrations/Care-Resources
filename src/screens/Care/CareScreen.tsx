import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { PathwayCard } from '../../components/PathwayCard';
import { CareStackParamList } from '../../navigation/stacks/CareStack';
import { Pathway } from '../../types';
import { apiService } from '../../services/api';

type CareScreenNavigationProp = StackNavigationProp<CareStackParamList, 'Care'>;

const CareScreen: React.FC = () => {
  const navigation = useNavigation<CareScreenNavigationProp>();
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use focus effect to prevent crashes when navigating quickly
  useFocusEffect(
    useCallback(() => {
      if (pathways.length === 0) {
        loadPathways();
      }
    }, [])
  );

  const loadPathways = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Load local pathways first
      const localPathways = require('../../data/pathways.json');
      
      // Load actual contacts and map them to pathways
      try {
        const contacts = await apiService.getContacts();
        const updatedPathways = localPathways.map((pathway: any) => {
          if (pathway.contact && pathway.contact.id) {
            const matchingContact = contacts.find(c => c.id === pathway.contact.id);
            if (matchingContact) {
              return {
                ...pathway,
                contact: matchingContact
              };
            }
          }
          return pathway;
        });
        setPathways(updatedPathways);
      } catch (contactError) {
        console.log('Using local pathway contacts, API sync failed:', contactError);
        setPathways(localPathways);
      }
      
      // TODO: API only has 2 pathways, use local data until DynamoDB is updated
      // try {
      //   const pathwaysFromApi = await apiService.getPathways();
      //   if (pathwaysFromApi && pathwaysFromApi.length >= localPathways.length) {
      //     setPathways(pathwaysFromApi);
      //   }
      // } catch (apiError) {
      //   console.log('API not available, using local data:', apiError);
      // }
    } catch (error) {
      console.error('Error loading pathways:', error);
      setError('Unable to load care pathways');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handlePathwayPress = useCallback((pathway: Pathway) => {
    try {
      navigation.navigate('PathwayDetail', { pathway });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to open pathway details');
    }
  }, [navigation]);


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
      backgroundColor: colors.grey100,
      paddingTop: spacing[4],
    },
    titleSection: {
      backgroundColor: colors.white,
      marginHorizontal: spacing[4],
      marginBottom: spacing[5],
      padding: spacing[4],
      borderRadius: radii.md,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    title: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.navy,
      marginBottom: spacing[2],
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fonts.body,
      color: colors.navy,
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '500',
    },
    pathwaysSection: {
      marginBottom: spacing[5],
      paddingHorizontal: spacing[4],
    },
    errorContainer: {
      alignItems: 'center',
      padding: spacing[4],
      backgroundColor: colors.white,
      borderRadius: radii.md,
      marginBottom: spacing[3],
    },
    errorText: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      marginTop: spacing[2],
      marginBottom: spacing[3],
    },
    retryButton: {
      backgroundColor: colors.blue,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: radii.sm,
    },
    retryButtonText: {
      color: colors.white,
      fontSize: fonts.small,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Care & Support</Text>
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.titleSection}>
          <Text style={styles.title}>How do I access care?</Text>
          <Text style={styles.subtitle}>
            Choose the area where you need support. Each pathway provides 
            specialized resources and direct access to trained professionals.
          </Text>
        </View>

        <View style={styles.pathwaysSection}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color={colors.orange} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadPathways}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            pathways.map((pathway) => (
              <PathwayCard
                key={pathway.id}
                pathway={pathway}
                onPress={() => handlePathwayPress(pathway)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CareScreen;
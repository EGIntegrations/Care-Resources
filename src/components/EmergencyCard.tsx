import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { locationService } from '../services/LocationService';

interface EmergencyNumber {
  label: string;
  number: string;
  urgent: boolean;
}

interface EmergencyCardProps {
  onError?: (error: string) => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({ onError }) => {
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const [emergencyInfo, setEmergencyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencyInfo();
  }, []);

  const loadEmergencyInfo = async () => {
    try {
      const info = await locationService.getEmergencyContactCard();
      setEmergencyInfo(info);
    } catch (error) {
      console.error('Error loading emergency info:', error);
      onError?.('Unable to load emergency information');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCall = (number: string, label: string) => {
    Alert.alert(
      'Emergency Call',
      `Call ${label} at ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          style: 'destructive',
          onPress: () => Linking.openURL(`tel:${number}`)
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
      marginVertical: spacing[2],
      borderLeftWidth: 4,
      borderLeftColor: colors.danger,
      ...shadows.medium,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing[3],
    },
    headerIcon: {
      backgroundColor: colors.danger,
      borderRadius: 20,
      padding: spacing[2],
      marginRight: spacing[3],
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.grey800,
    },
    location: {
      fontSize: fonts.small,
      color: colors.grey700,
      marginTop: 2,
    },
    emergencyNumber: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing[2],
      borderBottomWidth: 1,
      borderBottomColor: colors.grey200,
    },
    numberInfo: {
      flex: 1,
    },
    numberLabel: {
      fontSize: fonts.body,
      fontWeight: '500',
      color: colors.grey800,
    },
    numberValue: {
      fontSize: fonts.h3,
      fontWeight: 'bold',
      color: colors.danger,
      marginTop: 2,
    },
    callButton: {
      backgroundColor: colors.danger,
      borderRadius: radii.sm,
      padding: spacing[2],
      minWidth: 60,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    resourcesSection: {
      marginTop: spacing[3],
      paddingTop: spacing[3],
      borderTopWidth: 1,
      borderTopColor: colors.grey200,
    },
    resourcesTitle: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[2],
    },
    resourceItem: {
      fontSize: fonts.small,
      color: colors.grey700,
      lineHeight: 18,
      marginBottom: spacing[1],
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading emergency information...</Text>
      </View>
    );
  }

  if (!emergencyInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Emergency information unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="warning" size={20} color={colors.white} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{emergencyInfo.title}</Text>
          <Text style={styles.location}>{emergencyInfo.location}</Text>
        </View>
      </View>

      {emergencyInfo.numbers.map((number: EmergencyNumber, index: number) => (
        <View key={index} style={styles.emergencyNumber}>
          <View style={styles.numberInfo}>
            <Text style={styles.numberLabel}>{number.label}</Text>
            <Text style={styles.numberValue}>{number.number}</Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleEmergencyCall(number.number, number.label)}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      ))}

      {emergencyInfo.resources && (
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Local Resources</Text>
          {emergencyInfo.resources.embassy && (
            <Text style={styles.resourceItem}>• {emergencyInfo.resources.embassy}</Text>
          )}
          {emergencyInfo.resources.localHospitals?.map((hospital: string, index: number) => (
            <Text key={index} style={styles.resourceItem}>• {hospital}</Text>
          ))}
        </View>
      )}
    </View>
  );
};
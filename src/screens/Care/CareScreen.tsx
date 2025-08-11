import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  useEffect(() => {
    loadPathways();
  }, []);

  const loadPathways = async () => {
    try {
      const pathwaysFromApi = await apiService.getPathways();
      setPathways(pathwaysFromApi);
    } catch (error) {
      console.error('Error loading pathways:', error);
    }
  };

  const handlePathwayPress = (pathway: Pathway) => {
    navigation.navigate('PathwayDetail', { pathway });
  };

  const handleEmergencyCall = () => {
    Linking.openURL('tel:+1-800-CRISIS-1');
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
    titleSection: {
      marginBottom: spacing[5],
    },
    title: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[2],
      textAlign: 'center',
    },
    subtitle: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      lineHeight: 22,
    },
    pathwaysSection: {
      marginBottom: spacing[5],
    },
    emergencyBanner: {
      backgroundColor: colors.orange,
      borderRadius: radii.md,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      ...shadows.medium,
    },
    emergencyContent: {
      flex: 1,
    },
    emergencyTitle: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.white,
      marginBottom: spacing[1],
    },
    emergencyText: {
      fontSize: fonts.body,
      color: colors.white,
      opacity: 0.9,
    },
    emergencyButton: {
      backgroundColor: colors.white,
      borderRadius: radii.sm,
      padding: spacing[3],
      marginLeft: spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },
    emergencyButtonText: {
      fontSize: fonts.small,
      fontWeight: '600',
      color: colors.orange,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Care & Support</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>How do I access care?</Text>
          <Text style={styles.subtitle}>
            Choose the area where you need support. Each pathway provides 
            specialized resources and direct access to trained professionals.
          </Text>
        </View>

        <View style={styles.pathwaysSection}>
          {pathways.map((pathway) => (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              onPress={() => handlePathwayPress(pathway)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.emergencyBanner}
          onPress={handleEmergencyCall}
          activeOpacity={0.8}
        >
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Need immediate assistance?</Text>
            <Text style={styles.emergencyText}>
              24/7 Crisis Support Available
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={16} color={colors.orange} />
            <Text style={styles.emergencyButtonText}>Call Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CareScreen;
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { Accordion } from '../../components/Accordion';
import { EmergencyCard } from '../../components/EmergencyCard';
import { CareStackParamList } from '../../navigation/stacks/CareStack';

type PathwayDetailScreenRouteProp = RouteProp<CareStackParamList, 'PathwayDetail'>;

const PathwayDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<PathwayDetailScreenRouteProp>();
  const { colors, fonts, spacing, radii, shadows } = useTheme();
  const { pathway } = route.params;

  const handleCall = () => {
    if (pathway.contact?.phone) {
      Linking.openURL(`tel:${pathway.contact.phone}`);
    }
  };

  const handleEmail = () => {
    if (pathway.contact?.email) {
      Linking.openURL(`mailto:${pathway.contact.email}`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.grey100,
    },
    header: {
      backgroundColor: pathway.color,
      padding: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
      padding: spacing[2],
      marginRight: spacing[3],
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcon: {
      marginRight: spacing[3],
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: fonts.h1,
      fontWeight: 'bold',
      color: colors.white,
    },
    headerSubtitle: {
      fontSize: fonts.body,
      color: colors.white,
      opacity: 0.9,
      marginTop: spacing[1],
    },
    content: {
      flex: 1,
      padding: spacing[4],
    },
    faqSection: {
      marginBottom: spacing[5],
    },
    sectionTitle: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[4],
    },
    contactSection: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      padding: spacing[4],
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    contactTitle: {
      fontSize: fonts.h3,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[3],
    },
    contactInfo: {
      marginBottom: spacing[4],
    },
    contactName: {
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey700,
      marginBottom: spacing[1],
    },
    contactRole: {
      fontSize: fonts.small,
      color: colors.blue,
      marginBottom: spacing[1],
    },
    contactDepartment: {
      fontSize: fonts.small,
      color: colors.grey700,
      opacity: 0.7,
    },
    contactButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    contactButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[3],
      borderRadius: radii.sm,
      marginHorizontal: spacing[1],
    },
    callButton: {
      backgroundColor: colors.green,
    },
    emailButton: {
      backgroundColor: colors.blue,
    },
    contactButtonText: {
      color: colors.white,
      fontSize: fonts.body,
      fontWeight: '600',
      marginLeft: spacing[2],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons
              name={pathway.icon as keyof typeof Ionicons.glyphMap}
              size={32}
              color={colors.white}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{pathway.name}</Text>
            <Text style={styles.headerSubtitle}>{pathway.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Show emergency card for Crisis Care pathway */}
        {pathway.id === 'crisis-care' && (
          <View style={{ marginBottom: spacing[4] }}>
            <EmergencyCard />
          </View>
        )}

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {pathway.faqs.map((faq, index) => (
            <Accordion
              key={faq.id}
              title={faq.question}
              initialExpanded={index === 0}
            >
              {faq.answer}
            </Accordion>
          ))}
        </View>

        {pathway.contact && (
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Need Help?</Text>
            
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{pathway.contact.name}</Text>
              <Text style={styles.contactRole}>{pathway.contact.title}</Text>
              {pathway.contact.department && (
                <Text style={styles.contactDepartment}>
                  {pathway.contact.department}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.contactButton, styles.emailButton]}
              onPress={handleEmail}
              activeOpacity={0.7}
            >
              <Ionicons name="mail" size={18} color={colors.white} />
              <Text style={styles.contactButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PathwayDetailScreen;
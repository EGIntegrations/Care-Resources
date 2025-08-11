import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  initialExpanded?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  initialExpanded = false,
}) => {
  const { colors, fonts, radii, spacing, shadows } = useTheme();
  const [expanded, setExpanded] = useState(initialExpanded);
  const [rotateValue] = useState(new Animated.Value(initialExpanded ? 1 : 0));

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    
    Animated.timing(rotateValue, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: radii.md,
      marginVertical: spacing[1],
      ...shadows.small,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[4],
      borderBottomWidth: expanded ? 1 : 0,
      borderBottomColor: colors.grey200,
    },
    title: {
      flex: 1,
      fontSize: fonts.body,
      fontWeight: '600',
      color: colors.grey700,
    },
    icon: {
      marginLeft: spacing[2],
    },
    content: {
      padding: spacing[4],
    },
    contentText: {
      fontSize: fonts.body,
      color: colors.grey700,
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded} activeOpacity={0.7}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={[styles.icon, { transform: [{ rotate }] }]}>
          <Ionicons name="chevron-down" size={20} color={colors.grey700} />
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {typeof children === 'string' ? (
            <Text style={styles.contentText}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
};
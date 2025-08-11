import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { SHARED_PASSCODE } from '../types';

interface PasscodeModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  message?: string;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  visible,
  onSuccess,
  onCancel,
  title = 'Enter Passcode',
  message = 'Please enter the shared passcode to access this content.',
}) => {
  const { colors, fonts, radii, spacing, shadows } = useTheme();
  const [passcode, setPasscode] = useState('');
  const [isError, setIsError] = useState(false);
  const shakeAnimation = useState(new Animated.Value(0))[0];

  const handleSubmit = () => {
    if (passcode === SHARED_PASSCODE) {
      setPasscode('');
      setIsError(false);
      onSuccess();
    } else {
      setIsError(true);
      shakeAnimation.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      
      setTimeout(() => {
        setIsError(false);
        setPasscode('');
      }, 1000);
    }
  };

  const handleCancel = () => {
    setPasscode('');
    setIsError(false);
    onCancel?.();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.white,
      borderRadius: radii.lg,
      padding: spacing[5],
      margin: spacing[4],
      width: '80%',
      maxWidth: 320,
      ...shadows.medium,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: spacing[4],
    },
    title: {
      fontSize: fonts.h2,
      fontWeight: '600',
      color: colors.grey700,
      textAlign: 'center',
      marginBottom: spacing[2],
    },
    message: {
      fontSize: fonts.body,
      color: colors.grey700,
      textAlign: 'center',
      marginBottom: spacing[5],
      lineHeight: 22,
    },
    inputContainer: {
      marginBottom: spacing[5],
    },
    input: {
      borderWidth: 2,
      borderColor: isError ? colors.danger : colors.grey200,
      borderRadius: radii.sm,
      padding: spacing[4],
      fontSize: fonts.body,
      textAlign: 'center',
      letterSpacing: 2,
      fontWeight: '600',
      backgroundColor: isError ? '#FFEBEE' : colors.grey100,
    },
    errorText: {
      color: colors.danger,
      fontSize: fonts.small,
      textAlign: 'center',
      marginTop: spacing[2],
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      borderRadius: radii.sm,
      padding: spacing[4],
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.grey200,
      marginRight: spacing[2],
    },
    submitButton: {
      backgroundColor: colors.blue,
      marginLeft: spacing[2],
    },
    cancelButtonText: {
      color: colors.grey700,
      fontSize: fonts.body,
      fontWeight: '600',
    },
    submitButtonText: {
      color: colors.white,
      fontSize: fonts.body,
      fontWeight: '600',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="lock-closed"
              size={48}
              color={isError ? colors.danger : colors.blue}
            />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={passcode}
              onChangeText={setPasscode}
              placeholder="Enter passcode"
              secureTextEntry
              autoFocus
              maxLength={20}
              onSubmitEditing={handleSubmit}
            />
            {isError && (
              <Text style={styles.errorText}>
                Incorrect passcode. Please try again.
              </Text>
            )}
          </View>
          
          <View style={styles.buttons}>
            {onCancel && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
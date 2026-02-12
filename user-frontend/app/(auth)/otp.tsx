import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { authService } from '../../src/api/authService';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying OTP...');
      console.log('Email:', email);
      console.log('OTP:', otp);
      console.log('OTP Length:', otp.length);
      
      const response = await authService.verifyEmailOTP(email, otp);
      
      console.log('Verification response:', response);
      
      if (response.success) {
        // Save token and user data
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect immediately without alert
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    setResending(true);
    try {
      const response = await authService.sendEmailOTP(email);
      
      if (response.success) {
        setTimer(60);
        Alert.alert('Success', 'OTP resent to your email!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify OTP</Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={40} color={colors.surface} />
          </View>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>OTP Code</Text>
            <View style={styles.otpInputWrapper}>
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                placeholderTextColor={colors.textLight}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}>
            <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
            <Text style={styles.verifyButtonText}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          {/* Timer and Resend */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in <Text style={styles.timerCount}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resending}>
                <Text style={styles.resendText}>
                  {resending ? 'Resending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.warning} />
            <Text style={styles.infoText}>
              OTP is valid for 10 minutes. Check your spam folder if you don't see it.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  email: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  otpInputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.medium,
  },
  otpInput: {
    paddingVertical: spacing.lg,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 8,
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
    ...shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerCount: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  resendText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.warning,
    lineHeight: 18,
  },
});

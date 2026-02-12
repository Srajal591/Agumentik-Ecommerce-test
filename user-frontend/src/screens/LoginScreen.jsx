import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { authService } from '../api/authService';
import { colors, spacing, borderRadius } from '../theme/colors';

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.sendOTP(mobile);
      if (response.success) {
        setOtpSent(true);
        Alert.alert(
          'OTP Sent',
          `OTP has been sent to ${mobile}${
            response.data.otp ? `\n\nDev Mode OTP: ${response.data.otp}` : ''
          }`
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOTP(mobile, otp);
      if (response.success) {
        // Navigate to home screen
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    handleSendOTP();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Fashion E-Commerce</Text>

        {!otpSent ? (
          <>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <Text style={styles.hint}>OTP sent to {mobile}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setOtpSent(false);
                setOtp('');
              }}
              disabled={loading}
            >
              <Text style={styles.changeNumberText}>Change Mobile Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textGray,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  changeNumberText: {
    color: colors.textGray,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default LoginScreen;

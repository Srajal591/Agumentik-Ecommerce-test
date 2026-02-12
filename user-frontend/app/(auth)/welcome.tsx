import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="shirt" size={60} color={colors.surface} />
          </View>
          <Text style={styles.appName}>Fashion Store</Text>
          <Text style={styles.tagline}>Your Premium Fashion Destination</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Latest Fashion Trends</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Secure Shopping</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            <Text style={styles.featureText}>Fast Delivery</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    marginTop: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  featureText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

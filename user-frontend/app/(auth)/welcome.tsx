import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.gradient}>
        {/* Logo/Brand Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>👕</Text>
          </View>
          <Text style={styles.brandName}>Fashion Store</Text>
          <Text style={styles.tagline}>Your Style, Your Way</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/300x300/FFFFFF/704F38?text=Fashion' }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>I Already Have an Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  logoText: {
    fontSize: 50,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.7,
  },
  actionSection: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.medium,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});

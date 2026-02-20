import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery Section */}
        <Animated.View 
          style={[
            styles.imageSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Main Large Image - Left */}
          <View style={styles.mainImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop' }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {/* Decorative Element */}
            <View style={styles.decorativeCircle} />
          </View>

          {/* Side Images - Right */}
          <View style={styles.sideImagesContainer}>
            <View style={styles.topImageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop' }}
                style={styles.topImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.bottomImageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop' }}
                style={styles.bottomImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </Animated.View>

        {/* Content Section */}
        <Animated.View 
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>
            The <Text style={styles.titleHighlight}>Fashion App</Text> That{'\n'}
            Makes You Look Your Best
          </Text>
          
          <Text style={styles.description}>
            Discover the latest trends and shop your perfect style with ease — all in one place.
          </Text>

          {/* Let's Get Started Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Let's Get Started</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  imageSection: {
    flexDirection: 'row',
    height: height * 0.55,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  mainImageContainer: {
    flex: 1.2,
    position: 'relative',
    marginRight: spacing.md,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl * 2,
    backgroundColor: colors.backgroundDark,
  },
  decorativeCircle: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  sideImagesContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topImageContainer: {
    flex: 1,
    marginBottom: spacing.md,
  },
  topImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl * 1.5,
    backgroundColor: colors.backgroundDark,
  },
  bottomImageContainer: {
    flex: 1,
  },
  bottomImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl * 1.5,
    backgroundColor: colors.backgroundDark,
  },
  contentSection: {
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 38,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  titleHighlight: {
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

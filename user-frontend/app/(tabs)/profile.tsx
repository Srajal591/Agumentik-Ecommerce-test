import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { authService } from '../../src/api/authService';
import { profileService } from '../../src/api/profileService';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    ordersCount: 0,
    wishlistCount: 0,
    addressesCount: 0,
  });

  useEffect(() => {
    loadUserData();
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await profileService.getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setUser(response.data);
      // Also update stored user
      await authService.storeUser(response.data);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to stored user
      const storedUser = await authService.getStoredUser();
      setUser(storedUser);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const image = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        };

        setUploading(true);
        const response = await profileService.uploadProfileImage(image);
        setUser(response.data);
        await authService.storeUser(response.data);
        Alert.alert('Success', 'Profile image updated successfully');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              router.replace('/(auth)/welcome');
            } catch (error) {
              console.error('Logout error:', error);
              router.replace('/(auth)/welcome');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: '1',
      title: 'Your profile',
      icon: 'person-outline',
      onPress: () => router.push('/edit-profile'),
    },
    {
      id: '2',
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => Alert.alert('Coming Soon', 'Payment methods feature coming soon'),
    },
    {
      id: '3',
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => router.push('/(tabs)/orders'),
    },
    {
      id: '4',
      title: 'Support Tickets',
      icon: 'ticket-outline',
      onPress: () => router.push('/tickets'),
    },
    {
      id: '5',
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
    },
    {
      id: '6',
      title: 'Help Center',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help Center', 'Contact us at support@fashionstore.com'),
    },
    {
      id: '7',
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy coming soon'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ 
                  uri: user?.profileImage || `https://via.placeholder.com/100/704F38/FFFFFF?text=${user?.name?.charAt(0) || 'U'}` 
                }}
                style={styles.avatar}
              />
              <TouchableOpacity 
                style={styles.editAvatarBtn}
                onPress={handleImagePick}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Ionicons name="camera" size={16} color={colors.surface} />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
            <Text style={styles.userPhone}>{user?.mobile || 'No mobile'}</Text>
          </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/(tabs)/orders')}>
            <Text style={styles.statValue}>{stats.ordersCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/wishlist')}>
            <Text style={styles.statValue}>{stats.wishlistCount}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/address')}>
            <Text style={styles.statValue}>{stats.addressesCount}</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.medium,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 110, // Floating tab bar height + extra padding
  },
  profileCard: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.large,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundDark,
    borderWidth: 4,
    borderColor: colors.background,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md + 2,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.medium,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    ...shadows.small,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: 12,
    color: colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

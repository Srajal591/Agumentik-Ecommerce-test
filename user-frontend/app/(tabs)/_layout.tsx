import { Tabs, useRouter, useSegments } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getCartTotal } from '../../src/utils/cartStorage';
import { authService } from '../../src/api/authService';

const colors = {
  primary: '#704F38',
  background: '#FFFFFF',
  inactive: '#FFFFFF',
  tabBarBg: '#2C2C2E',
  error: '#FF3B30',
};

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsChecking(true);
      const isLoggedIn = await authService.isLoggedIn();
      setIsAuthenticated(isLoggedIn);
      
      // Only redirect if not authenticated and we're in the tabs route
      if (!isLoggedIn && segments[0] === '(tabs)') {
        setTimeout(() => {
          router.replace('/(auth)/welcome');
        }, 100);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCartCount();
    }, [])
  );

  const loadCartCount = async () => {
    try {
      const { itemCount } = await getCartTotal();
      setCartCount(itemCount);
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  // Show loading only briefly
  if (isChecking || isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Don't render tabs if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: colors.tabBarBg,
          borderRadius: 35,
          height: 70,
          paddingBottom: 0,
          paddingTop: 0,
          paddingHorizontal: 20,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="home" size={24} color={focused ? colors.background : colors.inactive} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            loadCartCount();
          },
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="shirt" size={24} color={focused ? colors.background : colors.inactive} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            loadCartCount();
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="cart" size={24} color={focused ? colors.background : colors.inactive} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            loadCartCount();
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="receipt" size={24} color={focused ? colors.background : colors.inactive} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            loadCartCount();
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name="person" size={24} color={focused ? colors.background : colors.inactive} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            loadCartCount();
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeIconContainer: {
    backgroundColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

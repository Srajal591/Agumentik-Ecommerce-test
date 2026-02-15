import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';

export default function OrdersScreen() {
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-02-08',
      status: 'delivered',
      total: 7498,
      items: 2,
      image: 'https://via.placeholder.com/60x80/704F38/FFFFFF?text=Order',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-02-07',
      status: 'shipped',
      total: 4999,
      items: 1,
      image: 'https://via.placeholder.com/60x80/8A6A52/FFFFFF?text=Order',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-02-06',
      status: 'pending',
      total: 2499,
      items: 1,
      image: 'https://via.placeholder.com/60x80/5C3F2E/FFFFFF?text=Order',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'shipped':
        return colors.info;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'shipped':
        return 'airplane';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.ordersList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersListContent}>
        {orders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) + '20' },
                ]}>
                <Ionicons
                  name={getStatusIcon(order.status) as any}
                  size={14}
                  color={getStatusColor(order.status)}
                />
                <Text
                  style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.orderBody}>
              <Image source={{ uri: order.image }} style={styles.orderImage} />
              <View style={styles.orderDetails}>
                <Text style={styles.itemsCount}>{order.items} item(s)</Text>
                <Text style={styles.orderTotal}>₹{order.total}</Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]}>
                <Text style={[styles.actionBtnText, styles.actionBtnTextOutline]}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  ordersList: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  ordersListContent: {
    paddingBottom: 110, // Floating tab bar height + extra padding
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md + 2,
    marginBottom: spacing.md,
    ...shadows.large,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderBody: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  orderImage: {
    width: 60,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundDark,
  },
  orderDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  itemsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionBtnText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnTextOutline: {
    color: colors.primary,
  },
});

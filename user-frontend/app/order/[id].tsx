import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { orderService } from '../../src/api/orderService';
import { formatPrice } from '../../src/utils/formatPrice';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: any;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  returnStatus?: string;
  returnId?: string;
  trackingNumber?: string;
  createdAt: string;
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id as string);
      setOrder(response.data);
    } catch (error: any) {
      console.error('Failed to load order:', error.message);
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
        return colors.info;
      case 'shipped':
        return colors.primary;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'confirmed':
        return 'checkmark-circle-outline';
      case 'shipped':
        return 'airplane-outline';
      case 'delivered':
        return 'checkmark-done-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getReturnStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return colors.warning;
      case 'approved':
        return colors.info;
      case 'rejected':
        return colors.error;
      case 'picked_up':
        return colors.primary;
      case 'completed':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getReturnStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return 'time-outline';
      case 'approved':
        return 'checkmark-circle-outline';
      case 'rejected':
        return 'close-circle-outline';
      case 'picked_up':
        return 'cube-outline';
      case 'completed':
        return 'checkmark-done-circle-outline';
      default:
        return 'return-down-back-outline';
    }
  };

  const renderTrackingStep = (step: string, isActive: boolean, isCompleted: boolean) => (
    <View style={styles.trackingStep}>
      <View style={styles.trackingIconContainer}>
        <View
          style={[
            styles.trackingIcon,
            isCompleted && styles.trackingIconCompleted,
            isActive && styles.trackingIconActive,
            step === 'Return' && isActive && styles.trackingIconReturn,
          ]}
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={16} color={colors.surface} />
          ) : (
            <View style={styles.trackingDot} />
          )}
        </View>
        {step !== 'Delivered' && step !== 'Return' && <View style={styles.trackingLine} />}
      </View>
      <View style={styles.trackingContent}>
        <Text style={[styles.trackingLabel, isActive && styles.trackingLabelActive]}>
          {step}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return null;
  }

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);
  
  // Add return step if return status exists
  const allSteps = order.returnStatus 
    ? [...statusSteps, 'return'] 
    : statusSteps;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.orderStatus) + '20' }]}>
              <Ionicons name={getStatusIcon(order.orderStatus) as any} size={18} color={getStatusColor(order.orderStatus)} />
              <Text style={[styles.statusText, { color: getStatusColor(order.orderStatus) }]}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </Text>
            </View>
          </View>

          {/* Tracking */}
          {order.orderStatus !== 'cancelled' && (
            <View style={styles.trackingContainer}>
              {allSteps.map((step, index) => {
                let isCompleted, isActive;
                
                if (step === 'return') {
                  // Return step logic
                  const returnStatuses = ['requested', 'approved', 'picked_up', 'completed'];
                  const currentReturnIndex = returnStatuses.indexOf(order.returnStatus || '');
                  isCompleted = currentReturnIndex === returnStatuses.length - 1; // completed
                  isActive = order.returnStatus && !isCompleted;
                } else {
                  // Regular order steps
                  isCompleted = index < currentStepIndex;
                  isActive = index === currentStepIndex;
                }
                
                return (
                  <View key={step}>
                    {renderTrackingStep(
                      step.charAt(0).toUpperCase() + step.slice(1),
                      isActive,
                      isCompleted
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {order.trackingNumber && (
            <View style={styles.trackingNumberCard}>
              <Ionicons name="cube-outline" size={20} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.trackingNumberLabel}>Tracking Number</Text>
                <Text style={styles.trackingNumberValue}>{order.trackingNumber}</Text>
              </View>
            </View>
          )}

          {/* Return Status Info */}
          {order.returnStatus && (
            <View style={styles.returnInfoCard}>
              <View style={styles.returnInfoHeader}>
                <Ionicons name="information-circle" size={18} color={colors.warning} />
                <Text style={styles.returnInfoText}>
                  Return Status: <Text style={styles.returnInfoStatus}>
                    {order.returnStatus.charAt(0).toUpperCase() + order.returnStatus.slice(1).replace('_', ' ')}
                  </Text>
                </Text>
              </View>
              {order.returnId && (
                <TouchableOpacity 
                  style={styles.viewReturnLink}
                  onPress={() => router.push('/returns')}
                >
                  <Text style={styles.viewReturnLinkText}>View Return Details</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image
                source={{ uri: item.image || 'https://via.placeholder.com/80' }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                {item.size && <Text style={styles.itemMeta}>Size: {item.size}</Text>}
                {item.color && <Text style={styles.itemMeta}>Color: {item.color}</Text>}
                <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressCard}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <View style={styles.addressContent}>
              <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
              <Text style={styles.addressText}>{order.shippingAddress.mobile}</Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
              </Text>
              <Text style={styles.addressText}>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{order.subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>₹{order.shippingCharge}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>₹{order.tax}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelTotal}>Total</Text>
              <Text style={styles.summaryValueTotal}>₹{order.total}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Method</Text>
              <Text style={styles.summaryValue}>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment Status</Text>
              <View
                style={[
                  styles.paymentStatusBadge,
                  { backgroundColor: order.paymentStatus === 'completed' ? colors.successLight : colors.warningLight },
                ]}
              >
                <Text
                  style={[
                    styles.paymentStatusText,
                    { color: order.paymentStatus === 'completed' ? colors.success : colors.warning },
                  ]}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {order.orderStatus === 'delivered' && !order.returnStatus && (
          <TouchableOpacity 
            style={styles.returnButton}
            onPress={() => router.push(`/return/${order._id}`)}
          >
            <Ionicons name="return-down-back-outline" size={20} color={colors.surface} />
            <Text style={styles.returnButtonText}>Return Order</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => router.push(`/chat?orderId=${order._id}`)}
        >
          <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
    marginHorizontal: 2, // Prevent overflow
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  orderNumber: {
    fontSize: 18,
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
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  trackingContainer: {
    marginTop: spacing.md,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  trackingIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  trackingIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingIconCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  trackingIconActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  trackingIconReturn: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  trackingLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  trackingContent: {
    paddingVertical: 4,
  },
  trackingLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  trackingLabelActive: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  trackingNumberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  trackingNumberLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trackingNumberValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  returnInfoCard: {
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  returnInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  returnInfoText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  returnInfoStatus: {
    fontWeight: 'bold',
    color: colors.warning,
  },
  viewReturnLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  viewReturnLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.small,
  },
  addressContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  paymentStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  returnButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  returnButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.surface,
  },
  helpButton: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  helpButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { orderService } from '../../src/api/orderService';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  description: string;
}

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: 'cash-outline',
      enabled: true,
      description: 'Pay when you receive',
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: 'logo-google',
      enabled: false,
      description: 'Coming Soon',
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: 'phone-portrait-outline',
      enabled: false,
      description: 'Coming Soon',
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: 'wallet-outline',
      enabled: false,
      description: 'Coming Soon',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'card-outline',
      enabled: false,
      description: 'Coming Soon',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'qr-code-outline',
      enabled: false,
      description: 'Coming Soon',
    },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setLoading(true);

      // Parse cart items and address
      const cartItems = JSON.parse(params.cartItems as string);
      const addressData = JSON.parse(params.addressData as string);

      // Calculate totals
      const subtotal = cartItems.reduce((sum: number, item: any) => {
        const price = item.discountPrice || item.price;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
      }, 0);
      
      const shippingCharge = 0; // Free shipping
      const tax = 0; // No tax for now
      const total = subtotal + shippingCharge + tax;

      // Prepare order data
      const orderData = {
        items: cartItems.map((item: any) => ({
          product: item._id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity || 1,
          size: item.selectedSize || '',
          color: item.selectedColor || '',
          image: item.images?.[0] || '',
        })),
        shippingAddress: {
          fullName: addressData.fullName,
          mobile: addressData.mobile,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2 || '',
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
        },
        subtotal,
        shippingCharge,
        tax,
        total,
        paymentMethod: selectedMethod,
      };

      // Create order
      const response = await orderService.createOrder(orderData);

      // Navigate to confirmation
      router.replace({
        pathname: '/checkout/confirmation',
        params: {
          orderId: response.data._id,
          orderNumber: response.data.orderNumber,
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.methodCard,
        selectedMethod === method.id && styles.methodCardSelected,
        !method.enabled && styles.methodCardDisabled,
      ]}
      onPress={() => method.enabled && setSelectedMethod(method.id)}
      disabled={!method.enabled}
    >
      <View style={styles.radioContainer}>
        <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]}>
          {selectedMethod === method.id && <View style={styles.radioDot} />}
        </View>
      </View>

      <View style={[styles.methodIcon, !method.enabled && styles.methodIconDisabled]}>
        <Ionicons name={method.icon as any} size={24} color={method.enabled ? colors.primary : colors.textLight} />
      </View>

      <View style={styles.methodContent}>
        <Text style={[styles.methodName, !method.enabled && styles.methodNameDisabled]}>
          {method.name}
        </Text>
        <Text style={styles.methodDescription}>{method.description}</Text>
      </View>

      {!method.enabled && (
        <View style={styles.disabledBadge}>
          <Text style={styles.disabledText}>Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* COD Info */}
        {selectedMethod === 'cod' && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={colors.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Cash on Delivery</Text>
              <Text style={styles.infoText}>
                Pay with cash when your order is delivered to your doorstep.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color={colors.surface} />
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </>
          )}
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
    paddingBottom: 120,
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
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.small,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    ...shadows.medium,
  },
  methodCardDisabled: {
    opacity: 0.6,
  },
  radioContainer: {
    marginRight: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodIconDisabled: {
    backgroundColor: colors.backgroundDark,
  },
  methodContent: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  methodNameDisabled: {
    color: colors.textLight,
  },
  methodDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  disabledBadge: {
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  disabledText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.info,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.info,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
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
  },
  placeOrderButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.large,
  },
  placeOrderButtonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
  },
});

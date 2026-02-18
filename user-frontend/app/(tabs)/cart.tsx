import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCartTotal,
  clearCart,
  CartItem,
} from '../../src/utils/cartStorage';

export default function CartScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await getCart();
      const total = await getCartTotal();
      setCartItems(items);
      setSubtotal(total.subtotal);
      setItemCount(total.itemCount);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartShopping = () => {
    // Navigate to the home tab (index)
    if (navigation && navigation.navigate) {
      navigation.navigate('index' as never);
    } else {
      router.push('/(tabs)/');
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeFromCart(item._id, item.selectedSize, item.selectedColor);
            if (success) {
              await loadCart();
            }
          },
        },
      ]
    );
  };

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }

    const success = await updateCartQuantity(
      item._id,
      newQuantity,
      item.selectedSize,
      item.selectedColor
    );
    if (success) {
      await loadCart();
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await clearCart();
            if (success) {
              await loadCart();
            }
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }

    Alert.alert(
      'Checkout',
      `Total: ₹${subtotal}\nItems: ${itemCount}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            // TODO: Navigate to checkout
            console.log('Proceeding to checkout...');
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const displayPrice = item.discountPrice || item.price;
    const itemTotal = displayPrice * item.quantity;

    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
          
          <View style={styles.itemVariants}>
            {item.selectedSize && (
              <View style={styles.variantChip}>
                <Text style={styles.variantText}>Size: {item.selectedSize}</Text>
              </View>
            )}
            {item.selectedColor && (
              <View style={styles.variantChip}>
                <Text style={styles.variantText}>Color: {item.selectedColor}</Text>
              </View>
            )}
          </View>

          <View style={styles.itemFooter}>
            <Text style={styles.itemPrice}>₹{itemTotal}</Text>
            
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemoveItem(item)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add items to get started</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={handleStartShopping}
          >
            <Ionicons name="bag-handle" size={24} color={colors.surface} />
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => `${item._id}-${item.selectedSize}-${item.selectedColor}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Summary */}
      <View style={styles.bottomSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({itemCount} items)</Text>
          <Text style={styles.summaryValue}>₹{subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>FREE</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{subtotal}</Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward-circle" size={24} color={colors.surface} />
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.xl * 1.5,
    borderBottomRightRadius: borderRadius.xl * 1.5,
    ...shadows.large,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 280,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl * 1.5,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.large,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemImage: {
    width: 100,
    height: 120,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.backgroundDark,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  itemBrand: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  itemVariants: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  variantChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variantText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  quantityBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.medium,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
  },
  removeBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: 150,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl * 1.5,
    textAlign: 'center',
  },
  shopButton: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl * 1.5,
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.large,
    elevation: 10,
  },
  shopButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.surface,
    letterSpacing: 0.5,
  },
  bottomSummary: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: borderRadius.xl * 1.5,
    borderTopRightRadius: borderRadius.xl * 1.5,
    ...shadows.large,
    elevation: 20,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    ...shadows.large,
    elevation: 10,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.surface,
    letterSpacing: 0.5,
  },
});

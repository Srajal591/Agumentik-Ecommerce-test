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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../src/theme/colors';
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
  WishlistItem,
} from '../src/utils/wishlistStorage';

export default function WishlistScreen() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const success = await removeFromWishlist(productId);
            if (success) {
              await loadWishlist();
            }
          },
        },
      ]
    );
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            const success = await clearWishlist();
            if (success) {
              await loadWishlist();
            }
          },
        },
      ]
    );
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => {
    const displayPrice = item.discountPrice || item.price;
    const hasDiscount = item.discountPrice && item.discountPrice < item.price;
    const discountPercent = hasDiscount
      ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.wishlistItem}
        onPress={() => router.push(`/product/${item._id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
            style={styles.itemImage}
          />
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
          
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>₹{displayPrice}</Text>
            {hasDiscount && <Text style={styles.originalPrice}>₹{item.price}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemoveItem(item._id)}
        >
          <Ionicons name="heart" size={24} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist ({wishlistItems.length})</Text>
        {wishlistItems.length > 0 && (
          <TouchableOpacity onPress={handleClearWishlist}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
        {wishlistItems.length === 0 && <View style={styles.headerRight} />}
      </View>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtext}>Save items you love for later</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/products' as any)}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  listContent: {
    padding: spacing.md,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 120,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundDark,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  removeBtn: {
    padding: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  shopButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});

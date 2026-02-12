import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating?: number;
  };
  onPress: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      {onToggleWishlist && (
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={colors.error}
          />
        </TouchableOpacity>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        {product.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        )}
        
        <Text style={styles.price}>₹{product.price}</Text>
        
        {onAddToCart && (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}>
            <Ionicons name="cart-outline" size={18} color={colors.surface} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundDark,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  addToCartText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { productService } from '../../src/api/productService';
import { categoryService } from '../../src/api/categoryService';
import { toggleWishlist, isInWishlist } from '../../src/utils/wishlistStorage';

export default function CategoryProductsScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (products.length > 0) {
      loadWishlistStatus();
    }
  }, [products]);

  const loadWishlistStatus = async () => {
    try {
      const wishlistSet = new Set<string>();
      for (const product of products) {
        const inWishlist = await isInWishlist(product._id);
        if (inWishlist) {
          wishlistSet.add(product._id);
        }
      }
      setWishlistItems(wishlistSet);
    } catch (error) {
      console.error('Error loading wishlist status:', error);
    }
  };

  const handleToggleWishlist = async (product: any, e: any) => {
    e.stopPropagation();
    try {
      const result = await toggleWishlist(product);
      
      setWishlistItems(prev => {
        const newSet = new Set(prev);
        if (result.added) {
          newSet.add(product._id);
        } else {
          newSet.delete(product._id);
        }
        return newSet;
      });

      Alert.alert('Success', result.message);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCategory(), fetchProducts()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await categoryService.getCategoryById(id as string);
      if (response.success) {
        setCategory(response.data);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts({ category: id });
      if (response.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderProduct = ({ item }: any) => {
    const displayPrice = item.discountPrice || item.price;
    const hasDiscount = item.discountPrice && item.discountPrice < item.price;
    const discountPercent = hasDiscount
      ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
      : 0;
    const inWishlist = wishlistItems.has(item._id);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item._id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.images?.[0] || 'https://via.placeholder.com/300x400/704F38/FFFFFF?text=Product',
            }}
            style={styles.productImage}
          />
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.wishlistBtn} 
            activeOpacity={0.7}
            onPress={(e) => handleToggleWishlist(item, e)}
          >
            <Ionicons 
              name={inWishlist ? "heart" : "heart-outline"} 
              size={20} 
              color={inWishlist ? colors.error : colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.brand && (
            <Text style={styles.productBrand} numberOfLines={1}>
              {item.brand}
            </Text>
          )}
          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={colors.warning} />
              <Text style={styles.ratingText}>{item.rating || 4.0}</Text>
            </View>
            <Text style={styles.reviewCount}>({item.reviewCount || 0})</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{displayPrice}</Text>
            {hasDiscount && <Text style={styles.originalPrice}>₹{item.price}</Text>}
          </View>
        </View>
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
          <Text style={styles.headerTitle}>{name || 'Products'}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
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
        <Text style={styles.headerTitle}>{category?.name || name || 'Products'}</Text>
        <TouchableOpacity style={styles.headerRight}>
          <Ionicons name="search" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Banner */}
      {category?.image && (
        <View style={styles.categoryBanner}>
          <Image source={{ uri: category.image }} style={styles.categoryImage} />
          <View style={styles.categoryOverlay}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {category.description}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Products Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="shirt-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Check back later for new arrivals</Text>
          </View>
        }
      />
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
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBanner: {
    height: 180,
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.surface,
    opacity: 0.9,
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  productsList: {
    padding: spacing.sm,
    paddingBottom: 100,
  },
  productCard: {
    flex: 1,
    margin: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundDark,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: 'bold',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

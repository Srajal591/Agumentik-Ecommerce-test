import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { productService } from '../../src/api/productService';
import { categoryService } from '../../src/api/categoryService';
import { toggleWishlist, isInWishlist } from '../../src/utils/wishlistStorage';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
    loadWishlistStatus();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistStatus = async () => {
    try {
      const allProducts = [...featuredProducts, ...newArrivals];
      const wishlistSet = new Set<string>();
      
      for (const product of allProducts) {
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
    e.stopPropagation(); // Prevent navigation to product details
    
    try {
      const result = await toggleWishlist(product);
      
      // Update local state
      const newWishlistItems = new Set(wishlistItems);
      if (result.added) {
        newWishlistItems.add(product._id);
      } else {
        newWishlistItems.delete(product._id);
      }
      setWishlistItems(newWishlistItems);
      
      // Show feedback
      Alert.alert('Success', result.message);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts({ limit: 10 });
      if (response.success) {
        const products = response.data.products;
        setFeaturedProducts(products.slice(0, 5));
        setNewArrivals(products.slice(5, 10));
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

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('men') && !name.includes('women')) return 'man';
    if (name.includes('women')) return 'woman';
    if (name.includes('kid')) return 'happy';
    if (name.includes('accessor')) return 'watch';
    if (name.includes('shoe')) return 'footsteps';
    if (name.includes('bag')) return 'bag-handle';
    return 'pricetag';
  };

  const renderProductCard = ({ item }: any) => {
    const displayPrice = item.discountPrice || item.price;
    const hasDiscount = item.discountPrice && item.discountPrice < item.price;
    const isWishlisted = wishlistItems.has(item._id);
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => router.push(`/product/${item._id}`)}>
        <Image 
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x400/704F38/FFFFFF?text=Product' }} 
          style={styles.productImage} 
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
            </Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.wishlistBtn}
          onPress={(e) => handleToggleWishlist(item, e)}
          activeOpacity={0.7}>
          <Ionicons 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={20} 
            color={isWishlisted ? colors.error : colors.textPrimary} 
          />
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{item.rating || 4.0}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{displayPrice}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>₹{item.price}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.addToCartBtn}>
            <Ionicons name="cart-outline" size={18} color={colors.surface} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.welcomeText}>Welcome to Fashion Store</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.wishlistHeaderBtn}
              onPress={() => router.push('/wishlist' as any)}>
              <Ionicons name="heart-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }>
          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {categories.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}>
                {categories.map((category) => (
                  <TouchableOpacity 
                    key={category._id} 
                    style={styles.categoryCard}
                    onPress={() => router.push(`/category/${category._id}?name=${encodeURIComponent(category.name)}`)}>
                    <View style={styles.categoryIcon}>
                      <Ionicons name={getCategoryIcon(category.name) as any} size={28} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No categories available</Text>
            )}
          </View>

          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Summer Sale</Text>
              <Text style={styles.bannerSubtitle}>Up to 50% OFF</Text>
              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {featuredProducts.length > 0 ? (
              <FlatList
                data={featuredProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
            ) : (
              <Text style={styles.emptyText}>No products available</Text>
            )}
          </View>

          {/* New Arrivals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Arrivals</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {newArrivals.length > 0 ? (
              <FlatList
                data={newArrivals}
                renderItem={renderProductCard}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
            ) : (
              <Text style={styles.emptyText}>No new arrivals</Text>
            )}
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.medium,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  wishlistHeaderBtn: {
    position: 'relative',
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 52,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  filterBtn: {
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 110, // Floating tab bar height + extra padding
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesScroll: {
    paddingRight: spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    minWidth: 70,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...shadows.medium,
  },
  categoryName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  banner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    height: 180,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    ...shadows.large,
  },
  bannerContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: colors.surface,
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  bannerBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
    ...shadows.small,
  },
  bannerBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  productsList: {
    paddingRight: spacing.md,
  },
  productCard: {
    width: 190,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.large,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 220,
    backgroundColor: colors.backgroundDark,
    resizeMode: 'cover',
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
    zIndex: 1,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
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
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    zIndex: 1,
  },
  discountText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: 'bold',
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
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  addToCartText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '600',
  },
});

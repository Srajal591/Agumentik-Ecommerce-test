import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
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
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState('Guest');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 12, seconds: 56 });
  const scrollViewRef = useRef<ScrollView>(null);

  const bannerData = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      title: 'New Collection',
      subtitle: 'Discount 50% for\nthe first transaction',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      title: 'Summer Sale',
      subtitle: 'Up to 70% OFF\non selected items',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      title: 'Trending Now',
      subtitle: 'Explore the latest\nfashion trends',
    },
  ];

  useEffect(() => {
    fetchData();
    loadWishlistStatus();
    loadUserName();
  }, []);

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches 0
          hours = 2;
          minutes = 12;
          seconds = 56;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerData.length;
        
        // Scroll to next banner
        if (scrollViewRef.current) {
          const screenWidth = Dimensions.get('window').width - spacing.md * 2;
          scrollViewRef.current.scrollTo({
            x: nextIndex * screenWidth,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const loadUserName = async () => {
    try {
      const { authService } = await import('../../src/api/authService');
      const user = await authService.getStoredUser();
      if (user && user.name) {
        setUserName(user.name);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

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
      const response = await productService.getProducts({ limit: 20 });
      if (response.success) {
        const products = response.data.products;
        // Shuffle products for variety
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 6));
        setNewArrivals(shuffled.slice(6, 12));
        setFlashSaleProducts(shuffled.slice(12, 18));
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
        <View style={styles.productImageContainer}>
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
              size={22} 
              color={isWishlisted ? colors.error : colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
          </View>
          <Text style={styles.productPrice}>₹{displayPrice}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>₹{item.price}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.welcomeText}>Welcome, {userName}</Text>
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
            placeholder={`Search products, ${userName}...`}
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={colors.surface} />
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
              <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {categories.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}>
                {categories.slice(0, 6).map((category) => (
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

          {/* Banner Carousel */}
          <View style={styles.bannerContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
                );
                setCurrentBannerIndex(index);
              }}
              scrollEventThrottle={16}>
              {bannerData.map((banner) => (
                <View key={banner.id} style={styles.banner}>
                  <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                  <View style={styles.bannerOverlay} />
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                    <TouchableOpacity style={styles.bannerBtn}>
                      <Text style={styles.bannerBtnText}>Shop Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {bannerData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentBannerIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Flash Sale Section */}
          <View style={styles.section}>
            <View style={styles.flashSaleHeader}>
              <View style={styles.flashSaleLeft}>
                <Ionicons name="flash" size={24} color={colors.error} />
                <Text style={styles.flashSaleTitle}>Flash Sale</Text>
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>Closing in:</Text>
                <View style={styles.timerBoxes}>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerNumber}>{String(timeLeft.hours).padStart(2, '0')}</Text>
                  </View>
                  <Text style={styles.timerColon}>:</Text>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerNumber}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
                  </View>
                  <Text style={styles.timerColon}>:</Text>
                  <View style={styles.timerBox}>
                    <Text style={styles.timerNumber}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
                  </View>
                </View>
              </View>
            </View>
            {flashSaleProducts.length > 0 ? (
              <FlatList
                data={flashSaleProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
              />
            ) : (
              <Text style={styles.emptyText}>No flash sale products</Text>
            )}
          </View>

          {/* Featured Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
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
              <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 20,
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
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
  bannerContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    height: 200,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.large,
    position: 'relative',
  },
  banner: {
    width: Dimensions.get('window').width - spacing.md * 2,
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(112, 79, 56, 0.7)',
  },
  bannerContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 15,
    color: colors.surface,
    fontWeight: '400',
    lineHeight: 22,
  },
  bannerBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    ...shadows.small,
  },
  bannerBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 15,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: colors.surface,
    width: 24,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  productsList: {
    paddingRight: spacing.md,
  },
  productCard: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#F5F0E8',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  productInfo: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 4,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
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
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  flashSaleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  flashSaleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timerBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerBox: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    minWidth: 32,
    alignItems: 'center',
  },
  timerNumber: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerColon: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

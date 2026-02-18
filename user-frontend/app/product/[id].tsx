import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { productService } from '../../src/api/productService';
import { addToCart } from '../../src/utils/cartStorage';
import { toggleWishlist, isInWishlist } from '../../src/utils/wishlistStorage';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      checkWishlistStatus();
      // Animate content in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [product]);

  const checkWishlistStatus = async () => {
    if (product) {
      const status = await isInWishlist(product._id);
      setInWishlist(status);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    try {
      const result = await toggleWishlist(product);
      setInWishlist(result.added);
      Alert.alert('Success', result.message);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id as string);
      if (response.success) {
        setProduct(response.data);
        // Set default selections
        if (response.data.sizes?.length > 0) {
          setSelectedSize(response.data.sizes[0].size);
        }
        if (response.data.colors?.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      Alert.alert('Select Size', 'Please select a size before buying');
      return;
    }
    if (!selectedColor && product?.colors?.length > 0) {
      Alert.alert('Select Color', 'Please select a color before buying');
      return;
    }

    // Navigate to checkout or cart
    Alert.alert(
      'Buy Now',
      `Product: ${product.name}\nSize: ${selectedSize}\nColor: ${selectedColor}\nQuantity: ${quantity}\nPrice: ₹${(product.discountPrice || product.price) * quantity}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed to Checkout',
          onPress: () => {
            // TODO: Navigate to checkout
            console.log('Proceeding to checkout...');
          },
        },
      ]
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      Alert.alert('Select Size', 'Please select a size');
      return;
    }
    if (!selectedColor && product?.colors?.length > 0) {
      Alert.alert('Select Color', 'Please select a color');
      return;
    }

    try {
      const success = await addToCart(product, selectedSize, selectedColor, quantity);
      if (success) {
        Alert.alert(
          'Added to Cart',
          `${product.name} has been added to your cart`,
          [
            { text: 'Continue Shopping', style: 'cancel' },
            { text: 'View Cart', onPress: () => router.push('/cart' as any) },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}>
        {/* Image Gallery with Main Image */}
        <View style={styles.imageGallery}>
          {/* Main Image */}
          <Animated.View style={{ opacity: scaleAnim }}>
            <Image 
              source={{ uri: product.images?.[selectedImageIndex] || 'https://via.placeholder.com/400' }} 
              style={styles.productImage} 
            />
          </Animated.View>

          {/* Discount Badge */}
          {hasDiscount && (
            <Animated.View 
              style={[
                styles.discountBadge,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.discountText}>{discountPercent}% OFF</Text>
            </Animated.View>
          )}

          {/* Header Buttons */}
          <SafeAreaView edges={['top']} style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerBtn} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerBtn} 
              onPress={handleToggleWishlist}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={inWishlist ? "heart" : "heart-outline"} 
                size={24} 
                color={inWishlist ? colors.error : colors.textPrimary} 
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Image Thumbnails */}
        {product.images?.length > 1 && (
          <Animated.View 
            style={[
              styles.thumbnailContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <FlatList
              data={product.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.thumbnailList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedImageIndex(index);
                    // Animate image change
                    Animated.sequence([
                      Animated.timing(scaleAnim, {
                        toValue: 0.95,
                        duration: 100,
                        useNativeDriver: true,
                      }),
                      Animated.spring(scaleAnim, {
                        toValue: 1,
                        friction: 8,
                        useNativeDriver: true,
                      }),
                    ]).start();
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.selectedThumbnail,
                    ]}
                  >
                    <Image source={{ uri: item }} style={styles.thumbnailImage} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        )}

        {/* Product Info */}
        <Animated.View 
          style={[
            styles.productInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Brand & Rating */}
          <View style={styles.topRow}>
            {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.ratingText}>{product.rating || 4.0}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount || 0} reviews)</Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{displayPrice}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.originalPrice}>₹{product.price}</Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>Save ₹{product.price - product.discountPrice}</Text>
                </View>
              </>
            )}
          </View>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.sizeContainer}>
                {product.sizes.map((sizeObj: any) => (
                  <TouchableOpacity
                    key={sizeObj.size}
                    style={[
                      styles.sizeButton,
                      selectedSize === sizeObj.size && styles.selectedSizeButton,
                      sizeObj.stock === 0 && styles.outOfStockButton,
                    ]}
                    onPress={() => sizeObj.stock > 0 && setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === sizeObj.size && styles.selectedSizeText,
                        sizeObj.stock === 0 && styles.outOfStockText,
                      ]}
                    >
                      {sizeObj.size}
                    </Text>
                    {sizeObj.stock === 0 && (
                      <View style={styles.strikethrough} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Color</Text>
              <View style={styles.colorContainer}>
                {product.colors.map((color: string) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      selectedColor === color && styles.selectedColorButton,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.colorText,
                        selectedColor === color && styles.selectedColorText,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Product Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            {product.material && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Material:</Text>
                <Text style={styles.detailValue}>{product.material}</Text>
              </View>
            )}
            {product.category?.name && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{product.category.name}</Text>
              </View>
            )}
            {product.tags?.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tags:</Text>
                <View style={styles.tagsContainer}>
                  {product.tags.map((tag: string, index: number) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View 
        style={[
          styles.bottomBar,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.addToCartBtn} 
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <Ionicons name="cart-outline" size={24} color={colors.primary} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buyNowBtn} 
          onPress={handleBuyNow}
          activeOpacity={0.7}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  imageGallery: {
    height: 450,
    position: 'relative',
    backgroundColor: colors.backgroundDark,
  },
  productImage: {
    width: width,
    height: 450,
    resizeMode: 'cover',
  },
  thumbnailContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumbnailList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 70,
    height: 90,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: spacing.sm,
  },
  selectedThumbnail: {
    borderColor: colors.primary,
    ...shadows.medium,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeIndicator: {
    backgroundColor: colors.surface,
    width: 24,
  },
  discountBadge: {
    position: 'absolute',
    top: 70,
    left: 16,
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    ...shadows.large,
  },
  discountText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  productInfo: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl * 1.5,
    borderTopRightRadius: borderRadius.xl * 1.5,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.lg,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 18,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  saveText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    minWidth: 60,
    alignItems: 'center',
    position: 'relative',
  },
  selectedSizeButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  outOfStockButton: {
    opacity: 0.5,
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectedSizeText: {
    color: colors.primary,
  },
  outOfStockText: {
    color: colors.textSecondary,
  },
  strikethrough: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    backgroundColor: colors.error,
    transform: [{ rotate: '-15deg' }],
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedColorButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  selectedColorText: {
    color: colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.large,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  buyNowBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
});

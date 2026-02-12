import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'apps', count: 245 },
    { id: 'men', name: 'Men', icon: 'man', count: 89 },
    { id: 'women', name: 'Women', icon: 'woman', count: 112 },
    { id: 'kids', name: 'Kids', icon: 'happy', count: 44 },
    { id: 'accessories', name: 'Accessories', icon: 'watch', count: 67 },
    { id: 'shoes', name: 'Shoes', icon: 'footsteps', count: 53 },
  ];

  const products = [
    {
      id: '1',
      name: 'Classic Leather Jacket',
      price: 4999,
      image: 'https://via.placeholder.com/200x250/704F38/FFFFFF?text=Jacket',
      category: 'men',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Denim Jeans',
      price: 2499,
      image: 'https://via.placeholder.com/200x250/8A6A52/FFFFFF?text=Jeans',
      category: 'men',
      rating: 4.2,
    },
    {
      id: '3',
      name: 'Summer Dress',
      price: 3499,
      image: 'https://via.placeholder.com/200x250/5C3F2E/FFFFFF?text=Dress',
      category: 'women',
      rating: 4.8,
    },
    {
      id: '4',
      name: 'Cotton T-Shirt',
      price: 799,
      image: 'https://via.placeholder.com/200x250/704F38/FFFFFF?text=T-Shirt',
      category: 'men',
      rating: 4.3,
    },
  ];

  const renderCategoryCard = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === item.id && styles.categoryCardActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}>
      <View
        style={[
          styles.categoryIconContainer,
          selectedCategory === item.id && styles.categoryIconActive,
        ]}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={selectedCategory === item.id ? colors.surface : colors.primary}
        />
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.id && styles.categoryNameActive,
        ]}>
        {item.name}
      </Text>
      <Text style={styles.categoryCount}>{item.count} items</Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <TouchableOpacity style={styles.wishlistBtn}>
        <Ionicons name="heart-outline" size={20} color={colors.error} />
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color={colors.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>₹{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsGrid}
        columnWrapperStyle={styles.productRow}
      />
    </View>
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
    paddingTop: 50,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    minWidth: 100,
    ...shadows.small,
  },
  categoryCardActive: {
    backgroundColor: colors.primary,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryIconActive: {
    backgroundColor: colors.primaryLight,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  categoryNameActive: {
    color: colors.surface,
  },
  categoryCount: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  productsGrid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  productImage: {
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
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
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
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

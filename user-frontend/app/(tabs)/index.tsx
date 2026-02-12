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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Dummy featured products
  const featuredProducts = [
    {
      id: '1',
      name: 'Classic Leather Jacket',
      price: 4999,
      image: 'https://via.placeholder.com/300x400/704F38/FFFFFF?text=Jacket',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Denim Jeans',
      price: 2499,
      image: 'https://via.placeholder.com/300x400/8A6A52/FFFFFF?text=Jeans',
      rating: 4.2,
    },
    {
      id: '3',
      name: 'Cotton T-Shirt',
      price: 799,
      image: 'https://via.placeholder.com/300x400/5C3F2E/FFFFFF?text=T-Shirt',
      rating: 4.8,
    },
  ];

  const categories = [
    { id: '1', name: 'Men', icon: 'man' },
    { id: '2', name: 'Women', icon: 'woman' },
    { id: '3', name: 'Kids', icon: 'happy' },
    { id: '4', name: 'Accessories', icon: 'watch' },
  ];

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addToCartBtn}>
          <Ionicons name="cart-outline" size={18} color={colors.surface} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.welcomeText}>Welcome to Fashion Store</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon as any} size={28} color={colors.primary} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
          <FlatList
            data={featuredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    ...shadows.small,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 4,
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
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
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
  categoryCard: {
    alignItems: 'center',
    width: '23%',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...shadows.small,
  },
  categoryName: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  banner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    height: 160,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    ...shadows.medium,
  },
  bannerContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.surface,
    marginBottom: spacing.md,
  },
  bannerBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  productsList: {
    paddingRight: spacing.md,
  },
  productCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundDark,
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
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  productPrice: {
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

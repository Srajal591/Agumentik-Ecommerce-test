import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({ limit: 10 }),
        categoryService.getAll(),
      ]);

      if (productsRes.success) {
        setProducts(productsRes.data.products);
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { id: item._id })}
    >
      <View style={styles.productImage}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.discountPrice || item.price}</Text>
          {item.discountPrice && (
            <Text style={styles.originalPrice}>₹{item.price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => navigation.navigate('Products', { categoryId: item._id })}
    >
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fashion Store</Text>
      </View>

      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...shadows.small,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
  },
  categoryName: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: spacing.md,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    width: '48%',
    ...shadows.small,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.textGray,
    fontSize: 12,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: spacing.xs,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textGray,
    textDecorationLine: 'line-through',
  },
});

export default HomeScreen;

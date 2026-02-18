import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { addressService } from '../../src/api/addressService';

interface Address {
  _id: string;
  label: string;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddresses();
      const addressList = response.data || [];
      setAddresses(addressList);
      
      // Auto-select default address
      const defaultAddr = addressList.find((addr: Address) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    const address = addresses.find(addr => addr._id === selectedAddress);
    router.push({
      pathname: '/checkout/payment',
      params: {
        ...params,
        addressId: selectedAddress,
        addressData: JSON.stringify(address),
      },
    });
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[styles.addressCard, selectedAddress === item._id && styles.addressCardSelected]}
      onPress={() => setSelectedAddress(item._id)}
    >
      <View style={styles.radioContainer}>
        <View style={[styles.radio, selectedAddress === item._id && styles.radioSelected]}>
          {selectedAddress === item._id && <View style={styles.radioDot} />}
        </View>
      </View>

      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <View style={styles.labelContainer}>
            <Ionicons
              name={item.label === 'Home' ? 'home' : item.label === 'Office' ? 'briefcase' : 'location'}
              size={18}
              color={colors.primary}
            />
            <Text style={styles.label}>{item.label}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.mobile}>{item.mobile}</Text>
        <Text style={styles.address}>
          {item.addressLine1}
          {item.addressLine2 ? `, ${item.addressLine2}` : ''}
        </Text>
        <Text style={styles.address}>
          {item.city}, {item.state} - {item.pincode}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Address</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Address List */}
      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyText}>No addresses found</Text>
          <Text style={styles.emptySubtext}>Please add a delivery address</Text>
          <TouchableOpacity
            style={styles.addAddressBtn}
            onPress={() => router.push('/address/add')}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
            <Text style={styles.addAddressText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={addresses}
            renderItem={renderAddress}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
          />

          {/* Add New Address Button */}
          <TouchableOpacity
            style={styles.addNewBtn}
            onPress={() => router.push('/address/add')}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addNewText}>Add New Address</Text>
          </TouchableOpacity>

          {/* Continue Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueButton, !selectedAddress && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={!selectedAddress}
            >
              <Text style={styles.continueButtonText}>Continue to Payment</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 180,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.small,
  },
  addressCardSelected: {
    borderColor: colors.primary,
    ...shadows.medium,
  },
  radioContainer: {
    marginRight: spacing.md,
    paddingTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  defaultText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.surface,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  mobile: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  addAddressBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  addAddressText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.surface,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  addNewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.large,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
  },
});

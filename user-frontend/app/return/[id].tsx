import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { checkReturnEligibility, createReturn } from '../../src/api/returnService';

export default function ReturnRequestScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [eligible, setEligible] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(0);

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [returnType, setReturnType] = useState('refund');
  const [reason, setReason] = useState('');
  const [itemReasons, setItemReasons] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    checkEligibility();
  }, [id]);

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const response = await checkReturnEligibility(id as string);
      
      if (response.data.eligible) {
        setEligible(true);
        setOrder(response.data.order);
        setDaysRemaining(response.data.daysRemaining);
      } else {
        setEligible(false);
        setEligibilityMessage(response.data.reason);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to check eligibility');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (item: any) => {
    // Handle both populated and non-populated product references
    const productId = typeof item.product === 'string' ? item.product : item.product?._id;
    const isSelected = selectedItems.some((i) => {
      const selectedProductId = typeof i.product === 'string' ? i.product : i.product?._id;
      return selectedProductId === productId;
    });

    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => {
        const selectedProductId = typeof i.product === 'string' ? i.product : i.product?._id;
        return selectedProductId !== productId;
      }));
      const newReasons = { ...itemReasons };
      delete newReasons[productId];
      setItemReasons(newReasons);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: item.quantity }]);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setSelectedItems(
      selectedItems.map((item) => {
        const productId = typeof item.product === 'string' ? item.product : item.product?._id;
        return productId === itemId ? { ...item, quantity } : item;
      })
    );
  };

  const updateItemReason = (itemId: string, reason: string) => {
    setItemReasons({ ...itemReasons, [itemId]: reason });
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item to return');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for return');
      return;
    }

    // Check if all selected items have reasons
    for (const item of selectedItems) {
      const productId = typeof item.product === 'string' ? item.product : item.product?._id;
      if (!itemReasons[productId]?.trim()) {
        Alert.alert('Error', 'Please provide reason for each selected item');
        return;
      }
    }

    try {
      setSubmitting(true);
      const returnData = {
        order: id,
        type: returnType,
        reason: reason.trim(),
        items: selectedItems.map((item) => {
          const productId = typeof item.product === 'string' ? item.product : item.product?._id;
          return {
            product: productId,
            quantity: item.quantity,
            reason: itemReasons[productId],
          };
        }),
        pickupAddress: order.shippingAddress,
      };

      await createReturn(returnData);
      Alert.alert('Success', 'Return request submitted successfully', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/orders'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking eligibility...</Text>
      </View>
    );
  }

  if (!eligible) {
    return (
      <View style={styles.container}>
        <View style={styles.ineligibleContainer}>
          <Ionicons name="close-circle" size={80} color={colors.error} />
          <Text style={styles.ineligibleTitle}>Return Not Available</Text>
          <Text style={styles.ineligibleMessage}>{eligibilityMessage}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Request</Text>
      </View>

      {/* Eligibility Info */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color={colors.primary} />
        <Text style={styles.infoText}>
          You have {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining to return this order
        </Text>
      </View>

      {/* Order Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Return Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Return Type</Text>
        <View style={styles.typeContainer}>
          {['refund', 'replacement'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                returnType === type && styles.typeButtonActive,
              ]}
              onPress={() => setReturnType(type)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  returnType === type && styles.typeButtonTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Select Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Items to Return</Text>
        {order.items.map((item: any, index: number) => {
          const productId = typeof item.product === 'string' ? item.product : item.product?._id;
          const productImages = typeof item.product === 'object' ? item.product?.images : [];
          const isSelected = selectedItems.some((i) => {
            const selectedProductId = typeof i.product === 'string' ? i.product : i.product?._id;
            return selectedProductId === productId;
          });
          
          return (
            <View key={productId || index} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemCheckbox}
                onPress={() => toggleItemSelection(item)}
              >
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={isSelected ? colors.primary : colors.border}
                />
              </TouchableOpacity>

              <Image
                source={{ uri: item.image || productImages?.[0] }}
                style={styles.itemImage}
              />

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  Size: {item.size} | Color: {item.color}
                </Text>
                <Text style={styles.itemPrice}>₹{item.price?.toFixed(2)}</Text>

                {isSelected && (
                  <>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Quantity:</Text>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          onPress={() => {
                            const selectedItem = selectedItems.find((i) => {
                              const selectedProductId = typeof i.product === 'string' ? i.product : i.product?._id;
                              return selectedProductId === productId;
                            });
                            updateItemQuantity(
                              productId,
                              Math.max(1, (selectedItem?.quantity || 1) - 1)
                            );
                          }}
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>
                          {selectedItems.find((i) => {
                            const selectedProductId = typeof i.product === 'string' ? i.product : i.product?._id;
                            return selectedProductId === productId;
                          })?.quantity || 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            const selectedItem = selectedItems.find((i) => {
                              const selectedProductId = typeof i.product === 'string' ? i.product : i.product?._id;
                              return selectedProductId === productId;
                            });
                            updateItemQuantity(
                              productId,
                              Math.min(
                                item.quantity,
                                (selectedItem?.quantity || 1) + 1
                              )
                            );
                          }}
                          style={styles.quantityButton}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TextInput
                      style={styles.itemReasonInput}
                      placeholder="Reason for returning this item"
                      value={itemReasons[productId] || ''}
                      onChangeText={(text) => updateItemReason(productId, text)}
                      multiline
                    />
                  </>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Overall Reason */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Reason for Return</Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Please describe why you want to return this order..."
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Pickup Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Address</Text>
        <View style={styles.addressCard}>
          <Text style={styles.addressText}>
            {order.shippingAddress.fullName}
            {'\n'}
            {order.shippingAddress.mobile}
            {'\n'}
            {order.shippingAddress.addressLine1}
            {'\n'}
            {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}\n`}
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Return Request</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  ineligibleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  ineligibleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  ineligibleMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  orderInfo: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.primary,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemCheckbox: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemReasonInput: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 60,
  },
  reasonInput: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addressCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

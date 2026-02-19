import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../src/theme/colors';
import { getUserReturns } from '../src/api/returnService';

export default function ReturnsScreen() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReturns();
  }, []);

  const loadReturns = async () => {
    try {
      setLoading(true);
      const response = await getUserReturns();
      
      // Handle the response structure
      if (response && response.success && response.data) {
        setReturns(response.data.returns || []);
      } else if (response && response.data && response.data.returns) {
        // Alternative structure
        setReturns(response.data.returns || []);
      } else {
        console.error('Unexpected response structure:', response);
        setReturns([]);
      }
    } catch (error: any) {
      console.error('Error loading returns:', error.response?.data || error.message);
      setReturns([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReturns();
  };

  const getStatusColor = (status: string) => {
    const statusColors: any = {
      requested: colors.warning,
      approved: colors.info,
      rejected: colors.error,
      picked_up: colors.primary,
      completed: colors.success,
    };
    return statusColors[status] || colors.textSecondary;
  };

  const getTypeColor = (type: string) => {
    const typeColors: any = {
      return: colors.primary,
      refund: colors.success,
      replacement: colors.info,
    };
    return typeColors[type] || colors.textSecondary;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading returns...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Returns</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {returns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="return-down-back-outline" size={80} color={colors.border} />
            <Text style={styles.emptyTitle}>No Returns Yet</Text>
            <Text style={styles.emptyText}>
              You haven't requested any returns. Returns can be requested within 7 days of delivery.
            </Text>
          </View>
        ) : (
          returns.map((returnItem) => (
            <TouchableOpacity
              key={returnItem._id}
              style={styles.returnCard}
              onPress={() => {
                // Navigate to return details if needed
              }}
            >
              <View style={styles.returnHeader}>
                <View>
                  <Text style={styles.returnNumber}>{returnItem.returnNumber}</Text>
                  <Text style={styles.orderNumber}>Order: {returnItem.order?.orderNumber}</Text>
                </View>
                <View style={styles.badges}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: `${getTypeColor(returnItem.type)}20` },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: getTypeColor(returnItem.type) }]}>
                      {returnItem.type}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: `${getStatusColor(returnItem.status)}20` },
                    ]}
                  >
                    <Text
                      style={[styles.badgeText, { color: getStatusColor(returnItem.status) }]}
                    >
                      {returnItem.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.returnInfo}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {new Date(returnItem.createdAt).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    Refund: ₹{returnItem.refundAmount?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{returnItem.items.length} item(s)</Text>
                </View>
              </View>

              <View style={styles.returnReason}>
                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text style={styles.reasonText} numberOfLines={2}>
                  {returnItem.reason}
                </Text>
              </View>

              {returnItem.adminNotes && (
                <View style={styles.adminNotes}>
                  <Ionicons name="information-circle" size={16} color={colors.info} />
                  <Text style={styles.adminNotesText}>{returnItem.adminNotes}</Text>
                </View>
              )}

              {returnItem.pickupScheduledAt && (
                <View style={styles.pickupInfo}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={styles.pickupText}>
                    Pickup scheduled:{' '}
                    {new Date(returnItem.pickupScheduledAt).toLocaleString('en-IN')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  returnCard: {
    backgroundColor: colors.surface,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  returnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  returnNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badges: {
    gap: 4,
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  returnInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  returnReason: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  adminNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.infoLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  adminNotesText: {
    flex: 1,
    fontSize: 12,
    color: colors.info,
    lineHeight: 16,
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 8,
  },
  pickupText: {
    flex: 1,
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});

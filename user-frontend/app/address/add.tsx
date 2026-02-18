import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../src/theme/colors';
import { addressService } from '../../src/api/addressService';

export default function AddAddressScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Home');
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const labels = ['Home', 'Office', 'Other'];

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter full name');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      Alert.alert('Error', 'Please enter valid 10-digit mobile number');
      return;
    }
    if (!formData.addressLine1.trim()) {
      Alert.alert('Error', 'Please enter address');
      return;
    }
    if (!formData.city.trim()) {
      Alert.alert('Error', 'Please enter city');
      return;
    }
    if (!formData.state.trim()) {
      Alert.alert('Error', 'Please enter state');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      Alert.alert('Error', 'Please enter valid 6-digit pincode');
      return;
    }

    try {
      setLoading(true);
      await addressService.addAddress({
        ...formData,
        label: selectedLabel,
      });
      Alert.alert('Success', 'Address added successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Address Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Type</Text>
          <View style={styles.labelContainer}>
            {labels.map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.labelBtn, selectedLabel === label && styles.labelBtnActive]}
                onPress={() => setSelectedLabel(label)}
              >
                <Ionicons
                  name={label === 'Home' ? 'home' : label === 'Office' ? 'briefcase' : 'location'}
                  size={20}
                  color={selectedLabel === label ? colors.surface : colors.textSecondary}
                />
                <Text style={[styles.labelText, selectedLabel === label && styles.labelTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={colors.textLight}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.mobile}
              onChangeText={(text) => setFormData({ ...formData, mobile: text })}
            />
          </View>
        </View>

        {/* Address Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Details</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Address Line 1"
              placeholderTextColor={colors.textLight}
              value={formData.addressLine1}
              onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Address Line 2 (Optional)"
              placeholderTextColor={colors.textLight}
              value={formData.addressLine2}
              onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor={colors.textLight}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Ionicons name="map-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor={colors.textLight}
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor={colors.textLight}
              keyboardType="number-pad"
              maxLength={6}
              value={formData.pincode}
              onChangeText={(text) => setFormData({ ...formData, pincode: text })}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color={colors.surface} />
              <Text style={styles.saveButtonText}>Save Address</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  labelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  labelBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelTextActive: {
    color: colors.surface,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.large,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.surface,
  },
});

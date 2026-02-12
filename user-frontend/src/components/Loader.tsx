import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface LoaderProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({
  size = 'large',
  color = colors.primary,
  text,
  fullScreen = false,
}: LoaderProps) {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

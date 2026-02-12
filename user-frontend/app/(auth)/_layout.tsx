import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}

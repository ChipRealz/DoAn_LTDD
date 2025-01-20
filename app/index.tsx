import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Correct import for expo-router

const SplashScreen = () => {
  const router = useRouter();  // Using useRouter from expo-router for navigation

  useEffect(() => {
    // After 5 seconds, navigate to the HomeScreen
    setTimeout(() => {
      router.push('/(home)/HomeScreen');  // Navigate using router.push
    }, 5000);  // Splash screen for 5 seconds
  }, [router]);

  return (
    <View style={styles.centered}>
      <Text>Splash Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;

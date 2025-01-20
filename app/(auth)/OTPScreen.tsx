import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';  // For navigation

const API_URL = 'http://localhost:3000';  // Your Fastify API URL

const OTPScreen = ({ route }: { route: any }) => {
  const [otp, setOtp] = useState('');
  const [email] = useState(route.params.email);  // Retrieve email from the previous screen
  const [isRegister] = useState(route.params.isRegister);  // Check if this is a registration flow
  const router = useRouter();

  const handleOTPSubmit = async () => {
    try {
      const endpoint = isRegister ? '/verify-register-otp' : '/login';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, otp });

      alert(response.data.message);  // Show success message

      // Redirect based on the flow (Login or Registration)
      if (isRegister) {
        router.push('/HomeScreen');  // Navigate to HomeScreen after successful registration
      } else {
        router.push('/HomeScreen');  // Navigate to HomeScreen after successful login
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Invalid OTP');
      } else {
        alert('Invalid OTP');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter OTP:</Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <Button title="Submit OTP" onPress={handleOTPSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});

export default OTPScreen;

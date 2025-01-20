import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';  // For navigation

const API_URL = 'http://localhost:3000';  // Your Fastify API URL

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    try {
      // Send email to the server to request OTP
      const response = await axios.post(`${API_URL}/sendOTP`, { email });
      alert(response.data.message); // Show success message
      setIsOtpSent(true);  // OTP sent, proceed to OTP screen

      // Navigate to the OTP screen and pass email to it
      router.push({
        pathname: '/OTPScreen',
        params: { email, isRegister: 'false' },  // Set to false for login
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Error sending OTP');
      } else {
        alert('Error sending OTP');
      }
    }
  };

  return (
    <View style={styles.container}>
      {!isOtpSent ? (
        <>
          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button title="Send OTP" onPress={handleEmailSubmit} />
        </>
      ) : (
        <Text>Please check your email for the OTP.</Text>
      )}
      <Link href="/(auth)/ResetPasswordScreen">
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Reset Password</Text>
      </Link>
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

export default LoginScreen;

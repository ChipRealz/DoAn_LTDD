import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';  // For navigation

const API_URL = 'http://localhost:3000';  // Your Fastify API URL

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    try {
      // Register user and request OTP
      const response = await axios.post(`${API_URL}/register`, { email });
      setMessage(response.data.message);  // Show success message

      // Navigate to OTP screen and pass email along with registration flag
      router.push({
        pathname: '/OTPScreen',
        params: { email, isRegister: 'true' },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Registration failed');
      } else {
        alert('Registration failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Register" onPress={handleRegister} />
      {message ? <Text>{message}</Text> : null}
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

export default RegisterScreen;

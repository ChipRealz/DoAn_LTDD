import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3000';  // Your Fastify API URL

const ResetPasswordScreen = () => {
  // Hardcoded values for email and OTP
  const email = 'test@example.com';  // Fake email
  const otp = '123456';  // Fake OTP for testing

  const [newPassword, setNewPassword] = useState('newPassword123');
  const [confirmPassword, setConfirmPassword] = useState('newPassword123');
  const [otpInput, setOtpInput] = useState(otp);  // Pre-filled OTP for testing

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/reset-password`, { email, otp: otpInput, newPassword });
      alert(response.data.message);
      // Normally navigate to Login after reset, but we won't do it here as we're using fake data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Error resetting password');
      } else {
        alert('Error resetting password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Reset Password</Text>
      <Text>OTP:</Text>
      <TextInput
        style={styles.input}
        value={otpInput}
        onChangeText={setOtpInput}
        keyboardType="numeric"
      />
      <Text>New Password:</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Text>Confirm New Password:</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
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

export default ResetPasswordScreen;

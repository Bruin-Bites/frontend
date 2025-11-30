import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../services/authService';

const BRAND_GREEN = '#A8B84C';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigate to Home on success
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Log In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* 3. Wrap password input in a View */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={isPasswordSecure} // 4. Use state here
          />
          {/* 5. Add the icon button */}
          <TouchableOpacity
            onPress={() => setIsPasswordSecure(!isPasswordSecure)}
            style={styles.icon}
          >
            <Ionicons
              name={isPasswordSecure ? 'eye-off' : 'eye'}
              size={24}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Need an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 6. Update styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: { // This is for the username input
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  inputContainer: { // New container for password field + icon
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputField: { // New style for the password text input
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  icon: { // New style for the icon
    paddingHorizontal: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: BRAND_GREEN,
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: BRAND_GREEN,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  signUpText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
  signUpLink: {
    color: BRAND_GREEN,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
});
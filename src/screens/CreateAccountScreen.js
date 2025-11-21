import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_GREEN = '#A8B84C';
const ERROR_RED = '#D9534F';

// 1. A standard regex for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CreateAccountScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateAccount = () => {
    // 2. Check for empty fields first
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    // 3. Check for valid email format
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    // 4. Check for password mismatch
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return; // Stop the function here
    }

    // If all checks pass:
    setErrorMessage(''); // Clear any previous errors

    // No backend connection for now
    console.log('Creating account with:', { username, email, password });
    
    // Navigate to the new Onboarding screen
    navigation.replace('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create an account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={isPasswordSecure}
          />
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={isConfirmPasswordSecure}
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordSecure(!isConfirmPasswordSecure)
            }
            style={styles.icon}
          >
            <Ionicons
              name={isConfirmPasswordSecure ? 'eye-off' : 'eye'}
              size={24}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>
        
        {/* Display the error message if it exists */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

// (Styles remain the same as the previous version)
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
  input: {
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
  inputContainer: {
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
  inputField: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  icon: {
    paddingHorizontal: 15,
  },
  errorText: {
    color: ERROR_RED,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  createButton: {
    width: '100%',
    backgroundColor: BRAND_GREEN,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  loginText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
  loginLink: {
    color: BRAND_GREEN,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
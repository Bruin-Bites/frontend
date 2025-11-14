import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import api from "../services/api";

export default function CreateAccountScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, username, password, confirmPassword } = formData;
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }
    
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    
    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to the Terms of Service and Privacy Policy");
      return false;
    }
    
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { firstName, lastName, email, password } = formData;
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();

      const response = await api.post("/auth/register", {
        email: email.trim(),
        password,
        name,
        isUCLAStudent: false, // You can add a checkbox for this if needed
      });

      // Store token if needed (you might want to use AsyncStorage or a context)
      // For now, just show success and navigate
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.errors && error.response.data.errors.length > 0) {
            errorMessage = error.response.data.errors[0].msg || errorMessage;
          }
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.request) {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  const toggleTermsAgreement = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  return (
    <LinearGradient colors={[colors.loginBg0, colors.loginBg1]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                onPress={handleBackToLogin}
              >
                <Ionicons name="arrow-back" size={24} color={colors.loginTextLight} />
              </Pressable>
              <Text style={styles.headerTitle}>Create Account</Text>
            </View>

            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoDot} />
                <Text style={styles.title}>Join Bruin Bites</Text>
              </View>
              <Text style={styles.subtitle}>
                Create your account to discover the best deals and recipes on campus.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Name Fields */}
              <View style={styles.nameRow}>
                <View style={styles.nameInputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color={colors.loginTextLight} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="First Name"
                      placeholderTextColor={colors.loginTextLight}
                      value={formData.firstName}
                      onChangeText={(value) => handleInputChange('firstName', value)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
                <View style={styles.nameInputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={18} color={colors.loginTextLight} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Last Name"
                      placeholderTextColor={colors.loginTextLight}
                      value={formData.lastName}
                      onChangeText={(value) => handleInputChange('lastName', value)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              </View>

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email Address"
                    placeholderTextColor={colors.loginTextLight}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Username Field */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="at-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor={colors.loginTextLight}
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={colors.loginTextLight}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.loginTextLight}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm Password"
                    placeholderTextColor={colors.loginTextLight}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.loginTextLight}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Terms Agreement */}
              <View style={styles.termsContainer}>
                <Pressable
                  style={styles.checkboxContainer}
                  onPress={toggleTermsAgreement}
                >
                  <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                    {agreeToTerms && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{" "}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {" "}and{" "}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </Pressable>
              </View>

              {/* Create Account Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.createAccountButton,
                  pressed && styles.buttonPressed,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleCreateAccount}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.loginPrimaryGreen, colors.loginSoftGreen]}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text style={styles.createAccountButtonText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Back to Login */}
              <Pressable
                style={styles.backToLoginButton}
                onPress={handleBackToLogin}
              >
                <Text style={styles.backToLoginText}>Already have an account? Sign In</Text>
              </Pressable>
            </View>

            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
              <View style={[styles.decorativeCircle, styles.circle1]} />
              <View style={[styles.decorativeCircle, styles.circle2]} />
              <View style={[styles.decorativeCircle, styles.circle3]} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.loginCardTint,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.loginInk,
  },

  // Brand Section
  brandSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.loginPrimaryGreen,
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.loginInk,
  },
  subtitle: {
    fontSize: 16,
    color: colors.loginText,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  // Form Container
  formContainer: {
    flex: 1,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },

  // Name Row
  nameRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  nameInputContainer: {
    flex: 1,
  },

  // Input Styles
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.loginCardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colors.loginSoftGray,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.loginInk,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },

  // Terms Agreement
  termsContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.loginSoftGray,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.loginPrimaryGreen,
    borderColor: colors.loginPrimaryGreen,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.loginText,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.loginPrimaryGreen,
    fontWeight: "600",
  },

  // Button Styles
  createAccountButton: {
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: colors.loginPrimaryGreen,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  createAccountButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Back to Login Button
  backToLoginButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  backToLoginText: {
    color: colors.loginPrimaryGreen,
    fontSize: 16,
    fontWeight: "600",
  },

  // Decorative Elements
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.1,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: colors.loginAccentOrange,
    top: 100,
    right: -40,
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: colors.loginAccentCoral,
    bottom: 200,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: colors.loginAccentYellow,
    top: 300,
    left: -10,
  },
});

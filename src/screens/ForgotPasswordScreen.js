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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    
    // For demo purposes, just show success message
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  const handleResendEmail = () => {
    Alert.alert("Email Sent", "Reset instructions have been sent again!");
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
              <Text style={styles.headerTitle}>Forgot Password</Text>
            </View>

            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoDot} />
                <Text style={styles.title}>Bruin Bites</Text>
              </View>
            </View>

            {!isSubmitted ? (
              <>
                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>Reset Your Password</Text>
                  <Text style={styles.instructionsText}>
                    Enter your email address and we'll send you instructions to reset your password.
                  </Text>
                </View>

                {/* Email Input */}
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email address"
                        placeholderTextColor={colors.loginTextLight}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                      />
                    </View>
                  </View>

                  {/* Submit Button */}
                  <Pressable
                    style={({ pressed }) => [
                      styles.submitButton,
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={handleSubmit}
                  >
                    <LinearGradient
                      colors={[colors.loginPrimaryGreen, colors.loginSoftGreen]}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.submitButtonText}>Send Reset Instructions</Text>
                      <Ionicons name="send" size={20} color="white" />
                    </LinearGradient>
                  </Pressable>

                  {/* Back to Login */}
                  <Pressable
                    style={styles.backToLoginButton}
                    onPress={handleBackToLogin}
                  >
                    <Text style={styles.backToLoginText}>Back to Login</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {/* Success State */}
                <View style={styles.successContainer}>
                  <View style={styles.successIconContainer}>
                    <Ionicons name="checkmark-circle" size={80} color={colors.loginPrimaryGreen} />
                  </View>
                  <Text style={styles.successTitle}>Check Your Email</Text>
                  <Text style={styles.successText}>
                    We've sent password reset instructions to{" "}
                    <Text style={styles.emailText}>{email}</Text>
                  </Text>
                  
                  <View style={styles.successActions}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.resendButton,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={handleResendEmail}
                    >
                      <Text style={styles.resendButtonText}>Resend Email</Text>
                    </Pressable>
                    
                    <Pressable
                      style={({ pressed }) => [
                        styles.backToLoginSuccessButton,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={handleBackToLogin}
                    >
                      <Text style={styles.backToLoginSuccessText}>Back to Login</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            )}

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
    marginBottom: 40,
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
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.loginInk,
  },

  // Instructions
  instructionsContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  instructionsTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.loginInk,
    marginBottom: 16,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 16,
    color: colors.loginText,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  // Form Container
  formContainer: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },

  // Input Styles
  inputContainer: {
    marginBottom: 24,
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

  // Button Styles
  submitButton: {
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
  submitButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
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

  // Success State
  successContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.loginInk,
    marginBottom: 16,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    color: colors.loginText,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  emailText: {
    fontWeight: "600",
    color: colors.loginInk,
  },
  successActions: {
    width: "100%",
    gap: 16,
  },
  resendButton: {
    backgroundColor: colors.loginCardBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.loginPrimaryGreen,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.loginPrimaryGreen,
  },
  backToLoginSuccessButton: {
    backgroundColor: colors.loginPrimaryGreen,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  backToLoginSuccessText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
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

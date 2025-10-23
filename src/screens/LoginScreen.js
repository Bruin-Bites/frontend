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

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }
    
    // For demo purposes, just navigate to home
    // In a real app, you would validate credentials here
    navigation.navigate("Home");
  };

  const handleUCLALogin = () => {
    // For demo purposes, just navigate to home
    // In a real app, this would integrate with UCLA SSO
    Alert.alert("UCLA Login", "This would integrate with UCLA SSO");
    navigation.navigate("Home");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleCreateAccount = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <LinearGradient colors={[colors.loginBg0, colors.loginBg1]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {/* Brand Header */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoDot} />
                <Text style={styles.title}>Bruin Bites</Text>
              </View>
              <Text style={styles.subtitle}>
                Welcome back! Sign in to discover the best deals and recipes on campus.
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Username or Email"
                    placeholderTextColor={colors.loginTextLight}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.loginTextLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={colors.loginTextLight}
                    value={password}
                    onChangeText={setPassword}
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

              {/* Login Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={[colors.loginPrimaryGreen, colors.loginSoftGreen]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* UCLA Login Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.uclaButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleUCLALogin}
              >
                <View style={styles.uclaButtonContent}>
                  <View style={styles.uclaIconContainer}>
                    <Text style={styles.uclaIcon}>UCLA</Text>
                  </View>
                  <Text style={styles.uclaButtonText}>Login with UCLA Account</Text>
                  <Ionicons name="school-outline" size={20} color={colors.uclaBlue} />
                </View>
              </Pressable>

              {/* Footer Links */}
              <View style={styles.footerLinks}>
                <Pressable style={styles.footerLink} onPress={handleForgotPassword}>
                  <Text style={styles.footerLinkText}>Forgot Password?</Text>
                </Pressable>
                <Pressable style={styles.footerLink} onPress={handleCreateAccount}>
                  <Text style={styles.footerLinkText}>Create Account</Text>
                </Pressable>
              </View>
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
  
  // Brand Section
  brandSection: {
    alignItems: "center",
    marginTop: 60,
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
    justifyContent: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },

  // Input Styles
  inputContainer: {
    marginBottom: 20,
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

  // Button Styles
  loginButton: {
    marginTop: 8,
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
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  // UCLA Button
  uclaButton: {
    backgroundColor: colors.loginCardBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.uclaBlue,
    marginBottom: 32,
    shadowColor: colors.uclaBlue,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  uclaButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  uclaIconContainer: {
    backgroundColor: colors.uclaBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  uclaIcon: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  uclaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.uclaBlue,
    flex: 1,
    textAlign: "center",
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.loginSoftGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.loginTextLight,
    fontSize: 14,
    fontWeight: "500",
  },

  // Footer Links
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  footerLink: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  footerLinkText: {
    color: colors.loginPrimaryGreen,
    fontSize: 14,
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

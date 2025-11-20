import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useUser } from "../contexts/UserContext";
import BottomNavigation from "../components/BottomNavigation";

export default function ProfileScreen({ navigation }) {
  const { user, loading, logout, updateUser } = useUser();
  const [username, setUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const getInitials = (username) => {
    if (!username) return "U";
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUsernameSave = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }
    try {
      await updateUser({ username: username.trim() });
      setEditingUsername(false);
    } catch (error) {
      console.error("Failed to update username:", error);
      Alert.alert("Error", "Failed to update username");
    }
  };

  const handleUsernameEdit = () => {
    if (editingUsername) {
      handleUsernameSave();
    } else {
      setEditingUsername(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.uclaBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.navigate("Home")}
              style={styles.backButton}
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={24} color={colors.ink} />
            </Pressable>
            <Text style={styles.headerTitle}>My account</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>
          <View style={styles.separator} />

          {/* Profile Information Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarText}>
                    {user?.avatar ? "" : getInitials(username || "User")}
                  </Text>
                </View>
              </View>
              <Pressable
                style={styles.editAvatarBadge}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Image
                  source={require("../../assets/Edit Icon.png")}
                  style={{ width: 14, height: 14, tintColor: "#fff" }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <View style={styles.usernameSection}>
              <Text style={styles.usernameLabel}>Username</Text>
              <View style={styles.usernameInputWrapper}>
                <TextInput
                  style={styles.usernameInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="My_super_username"
                  placeholderTextColor={colors.textLight}
                  editable={editingUsername}
                  onBlur={handleUsernameSave}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={handleUsernameEdit}
                  style={styles.usernameEditButton}
                >
                  {editingUsername ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.textLight}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/Edit Icon.png")}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: colors.textLight,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </View>

          {/* Navigation Menu */}
          <View style={styles.menuSection}>
            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Contributions")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={colors.textLight}
                />
              </View>
              <Text style={styles.menuButtonText}>Contributions</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Following")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color={colors.textLight}
                />
              </View>
              <Text style={styles.menuButtonText}>Following</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Notifications")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={colors.textLight}
                />
              </View>
              <Text style={styles.menuButtonText}>Notifications</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Account")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.textLight}
                />
              </View>
              <Text style={styles.menuButtonText}>Account</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("History")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={colors.textLight}
                />
              </View>
              <Text style={styles.menuButtonText}>History</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textLight}
              />
            </Pressable>
          </View>

          {/* Log Out Button */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </Pressable>
        </ScrollView>
        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg0,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: "relative",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  headerRightPlaceholder: {
    position: "absolute",
    right: 16,
    width: 32,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },

  // Profile Section
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
    backgroundColor: "#fff",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eaf6ea",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  avatarInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#7fbf65",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7fbf65",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  usernameSection: {
    flex: 1,
  },
  usernameLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  usernameInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  usernameInput: {
    flex: 1,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 0,
  },
  usernameEditButton: {
    padding: 4,
  },

  // Navigation Menu
  menuSection: {
    paddingHorizontal: 20,
    gap: 14,
    marginBottom: 24,
    marginTop: 18,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
  },

  // Logout Button
  logoutButton: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.error,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.error,
  },
});

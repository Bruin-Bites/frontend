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
  const [username, setUsername] = useState("My_super_username");
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My account</Text>
          </View>
          <View style={styles.separator} />

          {/* Profile Information Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Ionicons
                  name="person"
                  size={50}
                  color="#255633"
                />
              </View>
              <Pressable
                style={styles.editAvatarBadge}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <Image
                  source={require("../../assets/Edit Icon.png")}
                  style={{ width: 19, height: 19, tintColor: "#fff" }}
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
                  placeholderTextColor="#7E7E7E"
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
                      color="#7E7E7E"
                    />
                  ) : (
                    <Image
                      source={require("../../assets/Edit Icon.png")}
                      style={{
                        width: 18,
                        height: 18,
                        tintColor: "#7E7E7E",
                      }}
                      resizeMode="contain"
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.sectionDivider} />

          {/* Navigation Menu */}
          <View style={styles.menuSection}>
            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Contributions")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color="#4B5563"
                />
              </View>
              <Text style={styles.menuButtonText}>Contributions</Text>
              <Ionicons
                name="chevron-forward"
                size={30}
                color="#4B5563"
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Following")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="people-outline"
                  size={30}
                  color="#4B5563"
                />
              </View>
              <Text style={styles.menuButtonText}>Following</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#4B5563"
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Notifications")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color="#4B5563"
                />
              </View>
              <Text style={styles.menuButtonText}>Notifications</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#4B5563"
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("Account")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="settings-outline"
                  size={30}
                  color="#4B5563"
                />
              </View>
              <Text style={styles.menuButtonText}>Account</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#4B5563"
              />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => navigation.navigate("History")}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={30}
                  color="#4B5563"
                />
              </View>
              <Text style={styles.menuButtonText}>History</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#4B5563"
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
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 26,
    paddingBottom: 16,
    paddingHorizontal: 26,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  separator: {
    height: 0, // Handled by header border
  },

  // Profile Section
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 14,
    backgroundColor: "transparent", // bg0 handles it? Design has bg-white for whole page? No, looks like cards on white? Wait, design "Content" is on "User Profile Page: Main" which is white.
  },
  avatarWrapper: {
    position: "relative",
    width: 101,
    height: 101,
  },
  avatar: {
    width: 101,
    height: 101,
    borderRadius: 50.5,
    backgroundColor: "#DCE8D4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8AB644",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  usernameSection: {
    flex: 1,
    height: 60, // Adjust to match layout
    justifyContent: "center",
  },
  usernameLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7E7E7E",
    marginBottom: 7,
  },
  usernameInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    backgroundColor: "#fff",
  },
  usernameInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 0,
  },
  usernameEditButton: {
    padding: 4,
  },

  // Divider
  sectionDivider: {
    height: 1,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 26,
    marginBottom: 20,
  },

  // Navigation Menu
  menuSection: {
    paddingHorizontal: 26,
    gap: 20,
    marginBottom: 35,
    marginTop: 0,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: 45, // Increased to move icons farther out
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  menuIconContainer: {
    width: 30, // Figma size
    height: 30, // Figma size
    alignItems: "center",
    justifyContent: "center",
  },
  menuButtonText: {
    width: 140, // Close to Figma 153, keeping safe
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },

  // Logout Button
  logoutButton: {
    marginHorizontal: 26,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F65952",
    marginBottom: 40,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F65952",
  },
});

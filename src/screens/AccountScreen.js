import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useUser } from "../contexts/UserContext";
import BottomNavigation from "../components/BottomNavigation";

// Reusable Toggle matching hi-fi (gray off / green on)
function Toggle({ value, onChange }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[
        accountStyles.toggleOuter,
        value ? accountStyles.toggleOuterOn : accountStyles.toggleOuterOff,
      ]}
      hitSlop={8}
    >
      <View
        style={[
          accountStyles.toggleInner,
          value ? accountStyles.toggleInnerOn : accountStyles.toggleInnerOff,
        ]}
      />
    </Pressable>
  );
}

export default function AccountScreen({ navigation }) {
  const { user, updateUser } = useUser();
  const [accountData, setAccountData] = useState({
    school: user?.school || "University of California, Los Angeles",
    graduatingYear: user?.graduatingYear || "2029",
    email: user?.email || "user_name@ucla.edu",
    phone: user?.phone || "+1 (123) 456-789",
    twoFactorEnabled: false,
  });
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setAccountData({
        school: user.school || "University of California, Los Angeles",
        graduatingYear: user.graduatingYear || "2029",
        email: user.email || "user_name@ucla.edu",
        phone: user.phone || "+1 (123) 456-789",
        twoFactorEnabled: false,
      });
    }
  }, [user]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = async (field) => {
    setLoading(true);
    try {
      // No network call - update local state only
      setEditingField(null);
      Alert.alert("Success", "Information updated successfully");
    } catch (error) {
      console.error("Failed to update:", error);
      Alert.alert("Error", "Failed to update information");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // No network call
              Alert.alert("Success", "Account deletion would be processed");
            } catch (error) {
              Alert.alert("Error", "Failed to delete account");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.separator} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Education Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>School</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={accountData.school}
                  onChangeText={(text) =>
                    setAccountData({ ...accountData, school: text })
                  }
                  editable={editingField === "school"}
                  onBlur={() =>
                    editingField === "school" && handleSave("school")
                  }
                />
                <Pressable
                  onPress={() =>
                    editingField === "school"
                      ? handleSave("school")
                      : handleEdit("school")
                  }
                >
                  <Image
                    source={require("../../assets/Edit Icon.png")}
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Graduating year</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={accountData.graduatingYear}
                  onChangeText={(text) =>
                    setAccountData({ ...accountData, graduatingYear: text })
                  }
                  editable={editingField === "graduatingYear"}
                  keyboardType="numeric"
                  onBlur={() =>
                    editingField === "graduatingYear" &&
                    handleSave("graduatingYear")
                  }
                />
                <Pressable
                  onPress={() =>
                    editingField === "graduatingYear"
                      ? handleSave("graduatingYear")
                      : handleEdit("graduatingYear")
                  }
                >
                  <Image
                    source={require("../../assets/Edit Icon.png")}
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Account Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account information</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={accountData.email}
                  onChangeText={(text) =>
                    setAccountData({ ...accountData, email: text })
                  }
                  editable={editingField === "email"}
                  keyboardType="email-address"
                  onBlur={() => editingField === "email" && handleSave("email")}
                />
                <Pressable
                  onPress={() =>
                    editingField === "email"
                      ? handleSave("email")
                      : handleEdit("email")
                  }
                >
                  <Image
                    source={require("../../assets/Edit Icon.png")}
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone number</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={accountData.phone}
                  onChangeText={(text) =>
                    setAccountData({ ...accountData, phone: text })
                  }
                  editable={editingField === "phone"}
                  keyboardType="phone-pad"
                  onBlur={() => editingField === "phone" && handleSave("phone")}
                />
                <Pressable
                  onPress={() =>
                    editingField === "phone"
                      ? handleSave("phone")
                      : handleEdit("phone")
                  }
                >
                  <Image
                    source={require("../../assets/Edit Icon.png")}
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputRow}>
                <Text style={styles.passwordText}>••••••••••••</Text>
                <Pressable
                  onPress={() => navigation.navigate("ChangePassword")}
                >
                  <Image
                    source={require("../../assets/Edit Icon.png")}
                    style={styles.editIcon}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Two-Factor Authentication */}
          <View style={styles.section}>
            <View style={styles.twoFactorRow}>
              <Text style={styles.fieldLabel}>Two-factor authentication</Text>
              <Toggle
                value={accountData.twoFactorEnabled}
                onChange={(v) =>
                  setAccountData({ ...accountData, twoFactorEnabled: v })
                }
              />
            </View>
          </View>

          {/* Delete Account */}
          <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete account</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    position: "relative",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
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
  scrollContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 0,
  },
  passwordText: {
    flex: 1,
    fontSize: 16,
    color: colors.ink,
  },
  twoFactorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
  },
});

// Toggle-specific styles (kept separate to avoid name clash)
const accountStyles = StyleSheet.create({
  toggleOuter: {
    width: 44,
    height: 28,
    borderRadius: 16,
    padding: 3,
    justifyContent: "center",
  },
  toggleOuterOff: { backgroundColor: "#e6e6e6" },
  toggleOuterOn: { backgroundColor: colors.loginPrimaryGreen },
  toggleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleInnerOff: { alignSelf: "flex-start" },
  toggleInnerOn: { alignSelf: "flex-end" },
});

// Image edit icon style
const editStyles = StyleSheet.create({
  editIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    tintColor: colors.uclaBlue,
  },
});

// Merge editStyles into styles object so component uses `styles.editIcon`
Object.assign(styles, editStyles);

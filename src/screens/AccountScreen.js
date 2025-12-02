import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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
  const { user } = useUser();
  const [accountData, setAccountData] = useState({
    school: user?.school || "University of California, Los Angeles",
    graduatingYear: user?.graduatingYear || "2029",
    email: user?.email || "user_name@ucla.edu",
    phone: user?.phone || "+1 (123) 456-789",
    twoFactorEnabled: false,
  });
  const [editingField, setEditingField] = useState(null);

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

  const handleSave = async () => {
    try {
      // No network call - update local state only
      setEditingField(null);
      Alert.alert("Success", "Information updated successfully");
    } catch (error) {
      console.error("Failed to update:", error);
      Alert.alert("Error", "Failed to update information");
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
            <Ionicons name="chevron-back" size={18} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={styles.headerSpacer} />
        </View>

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

            <View style={[styles.fieldContainer, styles.lastFieldContainer]}>
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

          {/* Divider Line */}
          <View style={styles.divider} />

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

            <View style={[styles.fieldContainer, styles.lastFieldContainer]}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputRow}>
                <Text style={styles.passwordText}>•••••••••••••••</Text>
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

            {/* Two-Factor Authentication */}
            <View style={styles.twoFactorRow}>
              <Text style={styles.twoFactorLabel}>Two-factor authentication</Text>
              <Toggle
                value={accountData.twoFactorEnabled}
                onChange={(v) =>
                  setAccountData({ ...accountData, twoFactorEnabled: v })
                }
              />
            </View>

            {/* Delete Account */}
            <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Delete account</Text>
            </Pressable>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    paddingTop: 26,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  backButton: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 18,
  },
  scrollContent: {
    paddingBottom: 60,
    paddingTop: 38,
  },
  section: {
    paddingHorizontal: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 13,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  lastFieldContainer: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7E7E7E",
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 0,
  },
  passwordText: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  editIcon: {
    width: 19,
    height: 19,
    tintColor: "#7E7E7E",
  },
  divider: {
    height: 1,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 26,
    marginVertical: 20,
  },
  twoFactorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  twoFactorLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7E7E7E",
  },
  deleteButton: {
    marginHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F65952",
    height: 38,
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#F65952",
  },
});

// Toggle-specific styles (kept separate to avoid name clash)
const accountStyles = StyleSheet.create({
  toggleOuter: {
    width: 36,
    height: 21,
    borderRadius: 23,
    padding: 2.4,
    justifyContent: "center",
  },
  toggleOuterOff: { backgroundColor: "#D9D9D9" },
  toggleOuterOn: { backgroundColor: "#8AB644" },
  toggleInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  toggleInnerOff: { alignSelf: "flex-start" },
  toggleInnerOn: { alignSelf: "flex-end" },
});

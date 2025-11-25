import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import BottomNavigation from "../components/BottomNavigation";

export default function FollowingScreen({ navigation }) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowing();
  }, []);

  const loadFollowing = async () => {
    try {
      setLoading(true);
      // Use mock data - no network calls
      setFollowing([
        {
          id: "1",
          username: "Contributor_username",
          description: "The contributor's description...",
        },
        {
          id: "2",
          username: "Contributor_username",
          description: "The contributor's description...",
        },
        {
          id: "3",
          username: "Contributor_username",
          description: "The contributor's description...",
        },
        {
          id: "4",
          username: "Contributor_username",
          description: "The contributor's description...",
        },
        {
          id: "5",
          username: "Contributor_username",
          description: "The contributor's description...",
        },
        {
          id: "6",
          username: "Contributor_username",
          description: "The contributor's description...",
        },
      ]);
    } catch (error) {
      console.error("Failed to load following:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username) => {
    if (!username) return "U";
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderUser = ({ item }) => (
    <Pressable
      style={styles.userCard}
      onPress={() =>
        navigation.navigate("Contributions", {
          username: item.username,
          userId: item.id,
        })
      }
      android_ripple={{ color: "#eee" }}
    >
      <View style={styles.avatar}>
        <View style={styles.avatarInner}>
          <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
        </View>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
    </Pressable>
  );

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
          <Text style={styles.headerTitle}>Following</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.uclaBlue} />
          </View>
        ) : (
          <FlatList
            data={following}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 27,
    paddingTop: 38,
    paddingBottom: 60,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    height: 85,
  },
  avatar: {
    width: 49,
    height: 49,
    borderRadius: 24.5,
    backgroundColor: "#C8DFC4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 38,
  },
  avatarInner: {
    width: 49,
    height: 49,
    borderRadius: 24.5,
    backgroundColor: "#7EBF65",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  userInfo: {
    flex: 1,
    gap: 5,
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8C8C8C",
  },
});

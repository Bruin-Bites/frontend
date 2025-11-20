import React, { useState, useEffect } from "react";
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
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>{getInitials(item.username)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <Pressable
        onPress={() =>
          navigation.navigate("Contributions", {
            username: item.username,
            userId: item.id,
          })
        }
        hitSlop={8}
        style={styles.chevronPressable}
      >
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </Pressable>
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
            <Ionicons name="chevron-back" size={24} color={colors.ink} />
          </Pressable>
          <Text style={styles.headerTitle}>Following</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.separator} />

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 120,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  chevronPressable: {
    padding: 8,
    width: 36,
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eaf6ea",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7fbf65",
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
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useUser } from "../contexts/UserContext";
import BottomNavigation from "../components/BottomNavigation";

export default function ContributionsScreen({ navigation }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("contributions");
  const [contributions, setContributions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    contributions: 16,
    followers: 33,
    following: 44,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Use mock data - no network calls
      // const [contributionsRes, commentsRes] = await Promise.all([
      //   api.get("/user/contributions").catch(() => ({ data: { items: [] } })),
      //   api.get("/user/comments").catch(() => ({ data: { items: [] } })),
      // ]);
      // setContributions(contributionsRes.data.items || []);
      // setComments(commentsRes.data.items || []);
      setContributions([]);
      setComments([]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
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

  const currentData = activeTab === "contributions" ? contributions : comments;
  const isEmpty = currentData.length === 0;

  // Mock data for demo
  const mockContributions = [
    { id: "1", title: "Financial Literacy Workshop", dateTime: "October 17, 2025 | 12:00 PM - 1:30 PM" },
    { id: "2", title: "Financial Literacy Workshop", dateTime: "October 17, 2025 | 12:00 PM - 1:30 PM" },
    { id: "3", title: "Financial Literacy Workshop", dateTime: "October 17, 2025 | 12:00 PM - 1:30 PM" },
  ];

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
          <View style={styles.headerCenter}>
            <Text style={styles.headerUsername}>{user?.username || "Contributor_username"}</Text>
          </View>
          <Pressable style={styles.shareButton}>
            <Ionicons name="paper-plane-outline" size={24} color={colors.ink} />
          </Pressable>
        </View>
        <View style={styles.separator} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user?.username || "User")}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.contributions}</Text>
                <Text style={styles.statLabel}>contributions</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.followers}</Text>
                <Text style={styles.statLabel}>followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.following}</Text>
                <Text style={styles.statLabel}>following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>
            A contributor's profile description. Might contain location, among other things!
          </Text>

          <Pressable style={styles.followingButton}>
            <Text style={styles.followingButtonText}>Following</Text>
          </Pressable>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === "contributions" && styles.tabActive]}
              onPress={() => setActiveTab("contributions")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "contributions" && styles.tabTextActive,
                ]}
              >
                Contributions
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "comments" && styles.tabActive]}
              onPress={() => setActiveTab("comments")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "comments" && styles.tabTextActive,
                ]}
              >
                Comments
              </Text>
            </Pressable>
          </View>
          <View style={styles.separator} />

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.uclaBlue} />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              {activeTab === "contributions" ? (
                isEmpty ? (
                  mockContributions.map((item) => (
                    <View key={item.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="heart-outline" size={24} color={colors.uclaBlue} />
                        <View style={styles.cardHeaderRight}>
                          <View style={styles.freeTag}>
                            <Text style={styles.freeTagText}>FREE</Text>
                          </View>
                          <Ionicons name="image-outline" size={32} color={colors.lightGray} style={styles.imagePlaceholder} />
                        </View>
                      </View>

                      <Text style={styles.cardTitle}>{item.title || "Financial Literacy Workshop"}</Text>
                      <Text style={styles.cardDateTime}>
                        {item.dateTime || "October 17, 2025 | 12:00 PM - 1:30 PM"}
                      </Text>

                      <View style={styles.tagsContainer}>
                        {["On Campus", "FCFS", "Lunch"].map((tag, idx) => (
                          <View key={idx} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.cardFooter}>
                        <Text style={styles.distance}>0.5 mi</Text>
                        <View style={styles.engagement}>
                          <Ionicons name="thumbs-up-outline" size={16} color={colors.text} />
                          <Text style={styles.engagementText}>13</Text>
                          <Ionicons name="chatbubble-outline" size={16} color={colors.text} style={styles.engagementIcon} />
                          <Text style={styles.engagementText}>3</Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  currentData.map((item) => (
                    <View key={item.id} style={styles.card}>
                      {/* Render contribution card content */}
                    </View>
                  ))
                )
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>Finished card goes here!</Text>
                  </View>
                  <View style={styles.placeholderCard}>
                    <Text style={styles.placeholderText}>Finished card goes here!</Text>
                  </View>
                </View>
              )}
            </View>
          )}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 16,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
  },
  shareButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.uclaGold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.uclaBlue,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.uclaBlue,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.uclaBlue,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  description: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },
  followingButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.uclaBlue,
    shadowColor: colors.uclaBlue,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  followingButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.uclaBlue,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.uclaBlue,
  },
  tabText: {
    fontSize: 16,
    color: colors.text,
  },
  tabTextActive: {
    fontWeight: "700",
    color: colors.uclaBlue,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardHeaderRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  freeTag: {
    backgroundColor: colors.uclaBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeTagText: {
    color: colors.tagText,
    fontSize: 12,
    fontWeight: "700",
  },
  imagePlaceholder: {
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 8,
  },
  cardDateTime: {
    fontSize: 14,
    color: colors.ink,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.bg1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.uclaBlue + "20",
  },
  tagText: {
    fontSize: 12,
    color: colors.uclaBlue,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  distance: {
    fontSize: 14,
    color: colors.uclaBlue,
    fontWeight: "600",
  },
  engagement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  engagementIcon: {
    marginLeft: 8,
  },
  engagementText: {
    fontSize: 14,
    color: colors.uclaBlue,
    fontWeight: "600",
  },
  placeholderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 40,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.ink,
  },
  emptyContainer: {
    paddingVertical: 20,
  },
});

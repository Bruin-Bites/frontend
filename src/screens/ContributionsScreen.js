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
import { useLikes } from "../contexts/LikesContext";
import { useUser } from "../contexts/UserContext";
import BottomNavigation from "../components/BottomNavigation";

export default function ContributionsScreen({ navigation, route }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("contributions");
  const [contributions, setContributions] = useState([]);
  const [comments, setComments] = useState([]);
  const { likedMap, engagementCounts, toggleLike, setInitialData } = useLikes();
  const [isFollowing, setIsFollowing] = useState(false);
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
      // populate with mock demo data (wrapped as async helpers for future GET replacement)
      const fetchedContributions = await fetchContributions();
      const fetchedComments = await fetchComments();
      setContributions(fetchedContributions);
      setComments(fetchedComments);
      // initialize likes context for these contributions
      setInitialData(fetchedContributions, 13);
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
    {
      id: "1",
      title: "% Discount Off Select Pastas",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
    {
      id: "2",
      title: "Pizza Discount for Students",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
    {
      id: "3",
      title: "Trader Joe's Veggie Discount",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
    {
      id: "4",
      title: "Pastry Coupon",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
  ];

  const mockComments = [
    {
      id: "c1",
      eventTitle: "Event Title",
      username: "Username",
      time: "5d ago",
      text: "This is my amazing comment. What a great placeholder comment!",
    },
    {
      id: "c2",
      eventTitle: "Event Title",
      username: "Username",
      time: "5d ago",
      text: "This is my amazing comment. What a great placeholder comment!",
    },
    {
      id: "c3",
      eventTitle: "Event Title",
      username: "Username",
      time: "5d ago",
      text: "This is my amazing comment. What a great placeholder comment!",
    },
  ];

  // Promise-based mocks so replacing with `api.get(...)` is trivial later
  const fetchContributions = async () => {
    return Promise.resolve(mockContributions);
  };

  const fetchComments = async () => {
    return Promise.resolve(mockComments);
  };

  // Profile fetch stub - replace with real GET request later (e.g. api.get(`/profiles/${userId}`))
  // Note: we don't call this yet; it's a framework for future integration.
  const fetchProfile = async (userId) => {
    // TODO: replace with actual API call, return profile shape { username, stats, bio, avatar }
    return Promise.resolve({
      username: route?.params?.username || user?.username || null,
      stats: {
        contributions: stats.contributions,
        followers: stats.followers,
        following: stats.following,
      },
      bio: "A contributor's profile description. Might contain location, among other things!",
      avatar: null,
    });
  };

  // NOTE: use `toggleLike(id)` from LikesContext to toggle like and update counts

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
            <Text style={styles.headerUsername}>
              {route?.params?.username
                ? route.params.username
                : "My contributions"}
            </Text>
          </View>
        </View>
        <View style={styles.separator} />
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapperProfile}>
            <View style={styles.avatarProfile}>
              <View style={styles.avatarInnerProfile}>
                <Text style={styles.avatarProfileText}>
                  {getInitials(
                    route?.params?.username || user?.username || "U"
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileStatsWrap}>
            <View style={styles.statsRow}>
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

            <Text style={styles.profileDescription}>
              A contributor's profile description. Might contain location, among
              other things!
            </Text>

            <Pressable
              onPress={() => setIsFollowing((s) => !s)}
              style={[
                styles.followButton,
                isFollowing && styles.followButtonFollowing,
              ]}
              android_ripple={{ color: "#eee" }}
            >
              <Text
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followButtonTextFollowing,
                ]}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </Pressable>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile details removed — focus on contributions/comments list */}

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[
                styles.tab,
                activeTab === "contributions" && styles.tabActive,
              ]}
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
              <ActivityIndicator size="large" color={colors.textLight} />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              {activeTab === "contributions" ? (
                (contributions || []).map((item) => (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Pressable
                        onPress={() => toggleLike(item.id)}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={likedMap[item.id] ? "heart" : "heart-outline"}
                          size={22}
                          color={
                            likedMap[item.id] ? colors.error : colors.textLight
                          }
                        />
                      </Pressable>
                      <View style={styles.cardHeaderRight}>
                        <View style={styles.freeTag}>
                          <Text style={styles.freeTagText}>FREE</Text>
                        </View>
                        <Ionicons
                          name="image-outline"
                          size={36}
                          color={colors.lightGray}
                          style={styles.imagePlaceholder}
                        />
                      </View>
                    </View>

                    <Text style={styles.cardTitle}>
                      {item.title || "Financial Literacy Workshop"}
                    </Text>
                    <Text style={styles.cardDateTime}>{item.dateTime}</Text>

                    <View style={styles.tagsContainer}>
                      {["Deal type", "Food type", "Location type"].map(
                        (tag, idx) => (
                          <View key={idx} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        )
                      )}
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={styles.distance}>0.5 mi</Text>
                      <View style={styles.engagement}>
                        <Ionicons
                          name="thumbs-up-outline"
                          size={16}
                          color={colors.text}
                        />
                        <Text style={styles.engagementText}>
                          {engagementCounts[item.id] ?? 13}
                        </Text>
                        <Ionicons
                          name="chatbubble-outline"
                          size={16}
                          color={colors.text}
                          style={styles.engagementIcon}
                        />
                        <Text style={styles.engagementText}>3</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View>
                  {(comments || mockComments).map((c) => (
                    <View key={c.id} style={styles.commentWrapper}>
                      <View style={styles.commentEventTag}>
                        <Text style={styles.commentEventTagText}>
                          {c.eventTitle} {c.time}
                        </Text>
                      </View>
                      <View style={styles.commentCard}>
                        <View style={styles.commentRow}>
                          <View style={styles.commentAvatar} />
                          <View style={styles.commentBody}>
                            <View style={styles.commentHeaderRow}>
                              <Text style={styles.commentUsername}>
                                {c.username}
                              </Text>
                              <Text style={styles.commentTime}>{c.time}</Text>
                            </View>
                            <Text style={styles.commentText}>{c.text}</Text>
                            <View style={styles.commentActions}>
                              <View style={styles.commentActionItem}>
                                <Ionicons
                                  name="thumbs-up-outline"
                                  size={14}
                                  color={colors.text}
                                />
                                <Text style={styles.commentActionText}>2</Text>
                              </View>
                              <View style={styles.commentActionItem}>
                                <Ionicons
                                  name="chatbubble-outline"
                                  size={14}
                                  color={colors.text}
                                />
                                <Text style={styles.commentActionText}>
                                  Reply
                                </Text>
                              </View>
                              <View style={styles.commentActionItem}>
                                <Ionicons
                                  name="warning-outline"
                                  size={14}
                                  color={colors.text}
                                />
                                <Text style={styles.commentActionText}>
                                  Report
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
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
    alignItems: "center",
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
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
    borderBottomColor: colors.uclaGold,
  },
  tabText: {
    fontSize: 16,
    color: colors.text,
  },
  tabTextActive: {
    fontWeight: "700",
    color: colors.ink,
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
    backgroundColor: "#7fbf65",
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
  /* Comment styles */
  commentWrapper: {
    marginBottom: 20,
  },
  commentEventTag: {
    alignSelf: "flex-start",
    backgroundColor: "#eef7f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
    marginBottom: 8,
  },
  commentEventTagText: {
    color: "#7fbf65",
    fontSize: 12,
    fontWeight: "700",
  },
  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d9eede",
  },
  commentBody: {
    flex: 1,
  },
  commentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  commentUsername: {
    fontWeight: "700",
    color: colors.ink,
  },
  commentTime: {
    color: colors.textLight,
    fontSize: 12,
  },
  commentText: {
    color: colors.ink,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  commentActionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  commentActionText: {
    color: colors.textLight,
    fontSize: 12,
  },
  // Profile section styles
  profileSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
    backgroundColor: "#fff",
  },
  avatarWrapperProfile: {
    marginRight: 12,
  },
  avatarProfile: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#eaf6ea",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInnerProfile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7fbf65",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarProfileText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  profileStatsWrap: {
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  profileDescription: {
    marginTop: 8,
    marginBottom: 12,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  followButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.loginPrimaryGreen,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 28,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  followButtonFollowing: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.uclaBlue,
  },
  followButtonTextFollowing: {
    color: colors.uclaBlue,
  },
});

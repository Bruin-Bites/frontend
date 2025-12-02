import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLikes } from "../contexts/LikesContext";
import BottomNavigation from "../components/BottomNavigation";

export default function ArchivedScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("contributions");
  const { likedMap, engagementCounts, toggleLike, setInitialData } = useLikes();

  const contributions = [
    {
      id: "1",
      title: "Fruits & Veggies Deal",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
    {
      id: "2",
      title: "Free Breakfast",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
    {
      id: "3",
      title: "Farm to Fork Event",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
    {
      id: "4",
      title: "Acai 50% Off",
      dateTime: "October 17, 2025 | 12:00PM - 1:30PM",
    },
  ];

  const comments = [
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
    {
      id: "c4",
      eventTitle: "Event Title",
      username: "Username",
      time: "5d ago",
      text: "This is my amazing comment. What a great placeholder comment!",
    },
  ];

  useEffect(() => {
    setInitialData(contributions, 13);
  }, []);

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
          <Text style={styles.headerTitle}>Archived</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsHeader}>
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
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.contentContainer}>
            {activeTab === "contributions" ? (
              (contributions || []).map((item) => (
                <View key={item.id} style={styles.card}>
                  {/* Image Section */}
                  <View style={styles.cardImageContainer}>
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={40} color="#D9D9D9" />
                    </View>
                    <View style={styles.imageOverlay}>
                      <Pressable
                        onPress={() => toggleLike(item.id)}
                        style={styles.heartButton}
                        hitSlop={8}
                      >
                        <Ionicons
                          name={likedMap[item.id] ? "heart" : "heart-outline"}
                          size={20}
                          color={likedMap[item.id] ? "#F65952" : "#666"}
                        />
                      </Pressable>
                      <View style={styles.freeTag}>
                        <Text style={styles.freeTagText}>FREE</Text>
                      </View>
                    </View>
                  </View>

                  {/* Text Content */}
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>

                    <View style={styles.dateTimeRow}>
                      <Text style={styles.cardDateTime}>{item.dateTime}</Text>
                      <Text style={styles.distance}>0.5 mi</Text>
                    </View>

                    <View style={styles.tagsAndEngagementRow}>
                      <View style={styles.tagsContainer}>
                        <View style={[styles.tag, styles.tagDeal]}>
                          <Text style={[styles.tagText, styles.tagDealText]}>
                            Deal type
                          </Text>
                        </View>
                        <View style={[styles.tag, styles.tagFood]}>
                          <Text style={[styles.tagText, styles.tagFoodText]}>
                            Food type
                          </Text>
                        </View>
                        <View style={[styles.tag, styles.tagLocation]}>
                          <Text style={[styles.tagText, styles.tagLocationText]}>
                            Location type
                          </Text>
                        </View>
                      </View>
                      <View style={styles.engagement}>
                        <Ionicons
                          name="thumbs-up-outline"
                          size={16}
                          color="#8C8C8C"
                        />
                        <Text style={styles.engagementText}>
                          {engagementCounts[item.id] ?? 13}
                        </Text>
                        <Ionicons
                          name="chatbubble-outline"
                          size={14}
                          color="#8C8C8C"
                          style={styles.engagementIcon}
                        />
                        <Text style={styles.engagementText}>3</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View>
                {(comments || []).map((c) => (
                  <View key={c.id} style={styles.commentWrapper}>
                    <View style={styles.commentEventTag}>
                      <Text style={styles.commentEventTagText}>
                        {c.eventTitle}{" "}
                        <Text style={styles.commentEventTime}>{c.time}</Text>
                      </Text>
                    </View>
                    <View style={styles.threadLine} />
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
                                size={16}
                                color="#8C8C8C"
                              />
                              <Text style={styles.commentActionText}>2</Text>
                            </View>
                            <View style={styles.commentActionItem}>
                              <Ionicons
                                name="return-up-back-outline"
                                size={16}
                                color="#8C8C8C"
                              />
                              <Text style={styles.commentActionText}>Reply</Text>
                            </View>
                            <View style={styles.commentActionItem}>
                              <Ionicons
                                name="alert-circle-outline"
                                size={16}
                                color="#8C8C8C"
                              />
                              <Text style={styles.commentActionText}>Report</Text>
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
  tabsHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 41,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 5,
    borderBottomColor: "#F8DC73",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  tabTextActive: {
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  contentContainer: {
    paddingHorizontal: 26,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardImageContainer: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 8,
  },
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  freeTag: {
    backgroundColor: "#8AB644",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },
  freeTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 3,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardDateTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  tagsAndEngagementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 0,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagDeal: {
    backgroundColor: "rgba(138, 182, 68, 0.2)",
    borderColor: "#8AB644",
  },
  tagDealText: {
    color: "#8AB644",
    fontSize: 10,
    fontWeight: "400",
  },
  tagFood: {
    backgroundColor: "rgba(248, 220, 115, 0.4)",
    borderColor: "#E3B300",
  },
  tagFoodText: {
    color: "#E3B300",
    fontSize: 10,
    fontWeight: "400",
  },
  tagLocation: {
    backgroundColor: "rgba(170, 216, 230, 0.3)",
    borderColor: "#23BEED",
  },
  tagLocationText: {
    color: "#23BEED",
    fontSize: 10,
    fontWeight: "400",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "400",
  },
  distance: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  engagement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  engagementIcon: {
    marginLeft: 8,
  },
  engagementText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8C8C8C",
  },
  /* Comment styles */
  commentWrapper: {
    marginBottom: 25,
  },
  commentEventTag: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2.5 },
    elevation: 5,
    height: 25,
    justifyContent: "center",
  },
  commentEventTagText: {
    color: "#8AB644",
    fontSize: 12,
    fontWeight: "400",
  },
  commentEventTime: {
    fontSize: 10,
    fontWeight: "400",
  },
  threadLine: {
    width: 2,
    height: 25,
    backgroundColor: "#D9D9D9",
    borderRadius: 1,
    marginLeft: 16,
  },
  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 17,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  commentAvatar: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: "#C8DFC4",
  },
  commentBody: {
    flex: 1,
  },
  commentHeaderRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  commentUsername: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },
  commentTime: {
    color: "#8C8C8C",
    fontSize: 12,
    fontWeight: "400",
  },
  commentText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 17,
    marginBottom: 15,
  },
  commentActions: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  commentActionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  commentActionText: {
    color: "#8C8C8C",
    fontSize: 12,
    fontWeight: "400",
  },
});

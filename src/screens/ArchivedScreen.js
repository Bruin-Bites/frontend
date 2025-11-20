import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useLikes } from "../contexts/LikesContext";
import BottomNavigation from "../components/BottomNavigation";

export default function ArchivedScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("contributions");
  const { likedMap, engagementCounts, toggleLike, setInitialData } = useLikes();

  // Mock contributions - include `image` field for future GET replacement
  const contributions = [
    { id: "1", title: "Fruits & Veggies Deal", image: null },
    { id: "2", title: "Free Breakfast", image: null },
    { id: "3", title: "Farm to Fork Event", image: null },
  ];

  const comments = [
    { id: "c1", username: "Username", text: "This is my amazing comment." },
    { id: "c2", username: "Username", text: "Another thoughtful comment." },
  ];

  useEffect(() => {
    // initialize like counts for the displayed contributions
    setInitialData(contributions, 13);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.headerTitle}>Archived</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setActiveTab("contributions")}
            style={[
              styles.tab,
              activeTab === "contributions" && styles.tabActive,
            ]}
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
            onPress={() => setActiveTab("comments")}
            style={[styles.tab, activeTab === "comments" && styles.tabActive]}
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {activeTab === "contributions"
            ? contributions.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Pressable
                      style={styles.heartBadge}
                      onPress={() => toggleLike(item.id)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={likedMap[item.id] ? "heart" : "heart-outline"}
                        size={18}
                        color={
                          likedMap[item.id] ? colors.error : colors.textLight
                        }
                      />
                    </Pressable>
                    <Image
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../../assets/adaptive-icon.png")
                      }
                      style={styles.cardImage}
                    />
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeText}>FREE</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.cardFooterRow}>
                    <Text style={styles.cardMeta}>
                      October 17, 2025 | 12:00PM - 1:30PM
                    </Text>
                    <View style={styles.cardRightRow}>
                      <Text style={styles.cardDistance}>0.5 mi</Text>
                      <View style={styles.engagementRow}>
                        <Ionicons
                          name="thumbs-up-outline"
                          size={14}
                          color={colors.text}
                        />
                        <Text style={styles.engagementCount}>
                          {engagementCounts[item.id] ?? 0}
                        </Text>
                        <Ionicons
                          name="chatbubble-outline"
                          size={14}
                          color={colors.text}
                          style={{ marginLeft: 8 }}
                        />
                        <Text style={styles.engagementCount}>3</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            : comments.map((c) => (
                <View key={c.id} style={styles.commentWrapper}>
                  <View style={styles.eventTag}>
                    <Text style={styles.eventTagText}>Event Title 5d ago</Text>
                  </View>
                  <View style={styles.commentCard}>
                    <View style={styles.commentRow}>
                      <View style={styles.commentAvatar} />
                      <View style={styles.commentBody}>
                        <Text style={styles.commentUsername}>{c.username}</Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                        <View style={styles.commentActionsRow}>
                          <Ionicons
                            name="thumbs-up-outline"
                            size={14}
                            color={colors.text}
                          />
                          <Text style={styles.commentActionCount}>2</Text>
                          <Text style={styles.commentActionLink}>Reply</Text>
                          <Text style={styles.commentActionLink}>Report</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
        </ScrollView>

        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  backBtn: { position: "absolute", left: 12 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  separator: { height: 1, backgroundColor: colors.border },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: colors.uclaGold },
  tabText: { fontSize: 16, color: colors.text },
  tabTextActive: { color: colors.ink, fontWeight: "700" },
  scrollContent: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { position: "relative", marginBottom: 8 },
  heartBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 2,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: {
    width: "100%",
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.bg1,
  },
  freeBadge: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: colors.loginPrimaryGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 8,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardMeta: { color: colors.text, fontSize: 13 },
  cardDistance: { color: colors.text, fontSize: 13 },
  cardRightRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  engagementRow: { flexDirection: "row", alignItems: "center", marginLeft: 12 },
  engagementCount: { color: colors.text, marginLeft: 6 },
  commentWrapper: { marginBottom: 20 },
  eventTag: {
    alignSelf: "flex-start",
    backgroundColor: "#eef7f0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  eventTagText: { color: "#7fbf65", fontSize: 12, fontWeight: "700" },
  commentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  commentRow: { flexDirection: "row", gap: 12 },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d9eede",
  },
  commentBody: { flex: 1 },
  commentUsername: { fontWeight: "700", color: colors.ink, marginBottom: 6 },
  commentText: { color: colors.ink },
  commentActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    alignItems: "center",
  },
  commentActionCount: { color: colors.text, marginLeft: 4 },
  commentActionLink: { color: colors.text, marginLeft: 12 },
});

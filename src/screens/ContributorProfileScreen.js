import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import BottomNavigation from "../components/BottomNavigation";

export default function ContributorProfileScreen({ navigation, route }) {
  const { username, userId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);

  // Mock contributor data - will be replaced with real data from backend
  const contributorData = {
    username: username || "UCLA Career Center",
    contributions: 16,
    followers: 33,
    followingCount: 44,
    description: "A contributor's profile description. Might contain location, among other things!",
    location: "106 Strathmore PI, Los Angeles, CA 90095",
    posts: [
      {
        id: "1",
        title: "Financial Literacy Workshop",
        date: "October 17, 2025",
        time: "12:00PM - 1:30PM",
        distance: "0.5 mi",
        price: "FREE",
        likes: 13,
        comments: 3,
        tags: ["Deal type", "Food type", "Location type"],
      },
      {
        id: "2",
        title: "Wetzel's Pretzels $6 Friday",
        date: "October 17, 2025",
        time: "All-day",
        distance: "0.2 mi",
        price: "$5-$10",
        likes: 16,
        comments: 5,
        tags: ["Deal type", "Food type", "Location type"],
      },
    ],
  };

  const handleFollowToggle = () => {
    setFollowing(!following);
  };

  const renderEventCard = (event) => (
    <View key={event.id} style={styles.eventCard}>
      {/* Event Image */}
      <View style={styles.eventImageContainer}>
        <View style={styles.eventImagePlaceholder} />
        <View style={styles.eventImageOverlay}>
          <Pressable style={styles.heartButton}>
            <Ionicons name="heart-outline" size={20} color="#F65952" />
          </Pressable>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{event.price}</Text>
          </View>
        </View>
      </View>

      {/* Event Content */}
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>

        <View style={styles.eventMetaRow}>
          <View style={styles.eventDateTime}>
            <Text style={styles.eventMetaText}>{event.date}</Text>
            <Text style={styles.eventMetaText}>|</Text>
            <Text style={styles.eventMetaText}>{event.time}</Text>
          </View>
          <Text style={styles.eventDistance}>{event.distance}</Text>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  index === 0 && styles.tagGreen,
                  index === 1 && styles.tagYellow,
                  index === 2 && styles.tagBlue,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    index === 0 && styles.tagTextGreen,
                    index === 1 && styles.tagTextYellow,
                    index === 2 && styles.tagTextBlue,
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.interactionsContainer}>
            <View style={styles.interactionItem}>
              <Ionicons name="heart-outline" size={16} color="#8C8C8C" />
              <Text style={styles.interactionText}>{event.likes}</Text>
            </View>
            <View style={styles.interactionItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#8C8C8C" />
              <Text style={styles.interactionText}>{event.comments}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

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
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={10}
            >
              <Ionicons name="chevron-back" size={18} color="#000" />
            </Pressable>
            <Text style={styles.headerTitle}>{contributorData.username}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Profile Picture */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <Ionicons name="person" size={36} color="#255633" />
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{contributorData.contributions}</Text>
              <Text style={styles.statLabel}>contributions</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{contributorData.followers}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{contributorData.followingCount}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{contributorData.description}</Text>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#8C8C8C" />
            <Text style={styles.locationText}>{contributorData.location}</Text>
          </View>

          {/* Follow Button */}
          <Pressable
            style={[styles.followButton, following && styles.followingButton]}
            onPress={handleFollowToggle}
          >
            <Text style={styles.followButtonText}>
              {following ? "Following" : "Follow"}
            </Text>
          </Pressable>

          {/* Contributions Header */}
          <View style={styles.contributionsHeader}>
            <Text style={styles.contributionsTitle}>Contributions</Text>
          </View>

          {/* Event Cards */}
          <View style={styles.cardsContainer}>
            {contributorData.posts.map(renderEventCard)}
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

  // Profile Picture
  profilePictureContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  profilePicture: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DCE8D4",
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats Section
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: 13,
    gap: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#D9D9D9",
  },

  // Description
  description: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
    textAlign: "left",
    paddingHorizontal: 24,
    marginTop: 13,
  },

  // Location
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    marginTop: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8C8C8C",
  },

  // Follow Button
  followButton: {
    backgroundColor: "#8AB644",
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 32,
    alignSelf: "center",
    marginTop: 20,
    width: 207,
  },
  followingButton: {
    backgroundColor: "#D9D9D9",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },

  // Contributions Header
  contributionsHeader: {
    alignItems: "flex-start",
    marginTop: 30,
    marginBottom: 10,
    paddingBottom: 10,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  contributionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  // Cards Container
  cardsContainer: {
    paddingHorizontal: 26,
    gap: 20,
  },

  // Event Card
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  eventImageContainer: {
    position: "relative",
    width: "100%",
    height: 100,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  eventImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  eventImageOverlay: {
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
  priceTag: {
    backgroundColor: "#8AB644",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Event Content
  eventContent: {
    marginTop: 10,
    gap: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  eventMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventDateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  eventMetaText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  eventDistance: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },

  // Event Footer
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    flex: 1,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderWidth: 1,
  },
  tagGreen: {
    backgroundColor: "rgba(138, 182, 68, 0.2)",
    borderColor: "#8AB644",
  },
  tagYellow: {
    backgroundColor: "rgba(248, 220, 115, 0.4)",
    borderColor: "#E3B300",
  },
  tagBlue: {
    backgroundColor: "rgba(170, 216, 230, 0.3)",
    borderColor: "#23BEED",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "400",
  },
  tagTextGreen: {
    color: "#8AB644",
  },
  tagTextYellow: {
    color: "#E3B300",
  },
  tagTextBlue: {
    color: "#23BEED",
  },

  // Interactions
  interactionsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  interactionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8C8C8C",
  },
});

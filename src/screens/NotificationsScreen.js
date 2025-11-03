import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import BottomNavigation from "../components/BottomNavigation";

export default function NotificationsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    newContributions: { email: false, push: false },
    myContributionActivity: { email: false, push: false },
    myCommentActivity: { email: false, push: false },
    followingActivity: { email: false, push: false },
    followersActivity: { email: false, push: false },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings locally - no network call
    setLoading(false);
  }, []);

  const updateSetting = (key, type, value) => {
    const newSettings = {
      ...settings,
      [key]: { ...settings[key], [type]: value },
    };
    setSettings(newSettings);
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.separator} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Contributions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contributions</Text>
              <View style={styles.columnHeaders}>
                <Text style={styles.columnHeader}>Email</Text>
                <Text style={styles.columnHeader}>Push</Text>
              </View>
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationItemTitle}>New contributions</Text>
                <Text style={styles.notificationDescription}>
                  Get notified for new, nearby, or limited time deals.
                </Text>
              </View>
              <View style={styles.togglesContainer}>
                <Switch
                  value={settings.newContributions.email}
                  onValueChange={(value) => updateSetting("newContributions", "email", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
                <Switch
                  value={settings.newContributions.push}
                  onValueChange={(value) => updateSetting("newContributions", "push", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationItemTitle}>My contribution activity</Text>
                <Text style={styles.notificationDescription}>
                  Likes, comments, saves, and shares from your contributions.
                </Text>
              </View>
              <View style={styles.togglesContainer}>
                <Switch
                  value={settings.myContributionActivity.email}
                  onValueChange={(value) => updateSetting("myContributionActivity", "email", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
                <Switch
                  value={settings.myContributionActivity.push}
                  onValueChange={(value) => updateSetting("myContributionActivity", "push", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationItemTitle}>My comment activity</Text>
                <Text style={styles.notificationDescription}>
                  Likes, replies, saves, and shares from your comments.
                </Text>
              </View>
              <View style={styles.togglesContainer}>
                <Switch
                  value={settings.myCommentActivity.email}
                  onValueChange={(value) => updateSetting("myCommentActivity", "email", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
                <Switch
                  value={settings.myCommentActivity.push}
                  onValueChange={(value) => updateSetting("myCommentActivity", "push", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* Following and followers Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Following and followers</Text>
              <View style={styles.columnHeaders}>
                <Text style={styles.columnHeader}>Email</Text>
                <Text style={styles.columnHeader}>Push</Text>
              </View>
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationItemTitle}>Following activity</Text>
                <Text style={styles.notificationDescription}>
                  Posts, likes, and comments of users you are following.
                </Text>
              </View>
              <View style={styles.togglesContainer}>
                <Switch
                  value={settings.followingActivity.email}
                  onValueChange={(value) => updateSetting("followingActivity", "email", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
                <Switch
                  value={settings.followingActivity.push}
                  onValueChange={(value) => updateSetting("followingActivity", "push", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationItemTitle}>Followers activity</Text>
                <Text style={styles.notificationDescription}>
                  Requests, posts, likes, and comments from your followers.
                </Text>
              </View>
              <View style={styles.togglesContainer}>
                <Switch
                  value={settings.followersActivity.email}
                  onValueChange={(value) => updateSetting("followersActivity", "email", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
                <Switch
                  value={settings.followersActivity.push}
                  onValueChange={(value) => updateSetting("followersActivity", "push", value)}
                  trackColor={{ false: colors.lightGray, true: colors.uclaBlue }}
                  thumbColor="#fff"
                />
              </View>
            </View>
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
    backgroundColor: colors.bg0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
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
    paddingBottom: 100,
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
  },
  columnHeaders: {
    flexDirection: "row",
    gap: 40,
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.ink,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingRight: 4,
  },
  notificationContent: {
    flex: 1,
    paddingRight: 16,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 6,
  },
  notificationDescription: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  togglesContainer: {
    flexDirection: "row",
    gap: 40,
    alignItems: "center",
  },
});

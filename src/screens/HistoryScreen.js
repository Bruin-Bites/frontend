import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import BottomNavigation from "../components/BottomNavigation";

export default function HistoryScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("archived");

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
          <Text style={styles.headerTitle}>History</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.separator} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Archived Button */}
          <Pressable
            style={styles.tabButton}
            onPress={() => navigation.navigate("Archived")}
          >
            <Ionicons name="trash-outline" size={24} color={colors.textLight} />
            <Text style={styles.tabButtonText}>Archived</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textLight}
            />
          </Pressable>

          {/* Liked Button */}
          <Pressable
            style={styles.tabButton}
            onPress={() => navigation.navigate("Liked")}
          >
            <Ionicons name="heart-outline" size={24} color={colors.textLight} />
            <Text style={styles.tabButtonText}>Liked</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textLight}
            />
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
  content: {
    padding: 20,
    gap: 12,
    paddingBottom: 120,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
  },
});

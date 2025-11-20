import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import BottomNavigation from "../components/BottomNavigation";

// Small custom Toggle to match attached styles (gray off / green on)
function Toggle({ value, onChange }) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[
        styles.toggleOuter,
        value ? styles.toggleOuterOn : styles.toggleOuterOff,
      ]}
      hitSlop={8}
    >
      <View
        style={[
          styles.toggleInner,
          value ? styles.toggleInnerOn : styles.toggleInnerOff,
        ]}
      />
    </Pressable>
  );
}

export default function NotificationsScreen({ navigation }) {
  const initial = {
    newContributions: { email: false, push: false },
    myContributionActivity: { email: false, push: false },
    myCommentActivity: { email: false, push: false },
    followingActivity: { email: false, push: false },
  };
  const [settings, setSettings] = useState(initial);

  const toggle = (key, type) => {
    setSettings((s) => ({ ...s, [key]: { ...s[key], [type]: !s[key][type] } }));
  };

  const rows = [
    {
      key: "newContributions",
      title: "New contributions",
      desc: "Get notified for new, nearby, or limited time deals.",
    },
    {
      key: "myContributionActivity",
      title: "My contribution activity",
      desc: "Likes, comments, saves, and shares from your contributions.",
    },
    {
      key: "myCommentActivity",
      title: "My comment activity",
      desc: "Likes, replies, saves, and shares from your comments.",
    },
    {
      key: "followingActivity",
      title: "Following activity",
      desc: "Contributions, likes, and comments of users you are following.",
    },
  ];

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
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activity</Text>
              <View style={styles.columnsRight}>
                <Text style={styles.columnLabel}>Email</Text>
                <Text style={[styles.columnLabel, { marginLeft: 32 }]}>
                  Push
                </Text>
              </View>
            </View>

            {rows.map((r, idx) => (
              <View key={r.key}>
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowTitle}>{r.title}</Text>
                    <Text style={styles.rowDesc}>{r.desc}</Text>
                  </View>

                  <View style={styles.rowToggles}>
                    <Toggle
                      value={settings[r.key].email}
                      onChange={() => toggle(r.key, "email")}
                    />
                    <View style={{ width: 20 }} />
                    <Toggle
                      value={settings[r.key].push}
                      onChange={() => toggle(r.key, "push")}
                    />
                  </View>
                </View>

                {idx < rows.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        </View>
        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  backBtn: { position: "absolute", left: 12, padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  separator: { height: 1, backgroundColor: colors.border },
  contentWrapper: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  columnsRight: { flexDirection: "row", alignItems: "center" },
  columnLabel: { fontSize: 14, fontWeight: "600", color: colors.ink },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 18,
  },
  rowLeft: { flex: 1, paddingRight: 12 },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 8,
  },
  rowDesc: { fontSize: 13, color: colors.text, lineHeight: 18 },

  rowToggles: {
    width: 140,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rowDivider: { height: 1, backgroundColor: colors.border },

  // Toggle styles
  toggleOuter: {
    width: 44,
    height: 28,
    borderRadius: 16,
    padding: 3,
    justifyContent: "center",
  },
  toggleOuterOff: {
    backgroundColor: "#e6e6e6",
  },
  toggleOuterOn: {
    backgroundColor: colors.loginPrimaryGreen,
  },
  toggleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleInnerOff: { alignSelf: "flex-start" },
  toggleInnerOn: { alignSelf: "flex-end" },
});

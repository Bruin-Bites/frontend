import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function ProfileScreen() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.h1}>Personal Info</Text>
        <Text style={styles.sub}>
          Manage and edit your personal information
        </Text>
      </View>
      <View>
        <InfoCard title="Name" info="Joe Bruin"></InfoCard>
      </View>
    </View>
  );
}

function InfoCard({ title, info }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardMeta}>{info}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  h1: { fontSize: 22, fontWeight: "800", color: "#1B2430" },
  sub: { fontSize: 13, color: "#5F6C7B", marginTop: 2 },

  card: {
    width: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1B2430" },
  cardMeta: { fontSize: 16, color: "#5F6C7B", marginTop: 6 },
  cardCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  cardCtaText: { color: colors.uclaBlue, fontWeight: "800" },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  chatHeaderText: { fontWeight: "800", color: colors.uclaBlue, fontSize: 14 },

  bubbleRow: { width: "100%", paddingVertical: 4 },
  bubble: { maxWidth: "82%", borderRadius: 14, padding: 10 },
  bubbleBot: {
    backgroundColor: "#F1F5FA",
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.12)",
  },
  bubbleUser: { backgroundColor: colors.uclaBlue },
  bubbleText: { fontSize: 14, color: "#1B2430" },

  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  input: {
    flex: 1,
    fontSize: 14,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    color: "#223",
  },
  sendBtn: {
    backgroundColor: colors.uclaBlue,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
});

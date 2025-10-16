import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={[colors.bg0, colors.bg1]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Brand */}
          <View style={styles.brandRow}>
            <View style={styles.logoDot} />
            <Text style={styles.title}>Bruin Bites</Text>
          </View>
          <Text style={styles.subtitle}>
            Cheap eats, smart recipes, and campus food hacks — all in one place.
          </Text>

          {/* Primary card spans full width */}
          <ActionCard
            big
            accent="map"
            icon={<Ionicons name="map" size={28} color={colors.uclaBlue} />}
            title="Cheap Eats Map"
            text="Find deals, discounts & happy hours near you."
            onPress={() => navigation.navigate("Map")}
          />

          {/* Two-up row */}
          <View style={styles.row}>
            <ActionCard
              icon={
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={28}
                  color={colors.uclaBlue}
                />
              }
              title="Budget Recipes"
              text="AI ideas from TJ’s & Ralphs staples."
              onPress={() => navigation.navigate("Recipes")}
            />
            <ActionCard
              icon={<Ionicons name="people" size={28} color={colors.uclaBlue} />}
              title="Community"
              text="Student tips, hall remixes & $5 meals."
              onPress={() => navigation.navigate("Community")}
            />
          </View>

          {/* Quick filters (purely visual for now) */}
          <View style={styles.chipsRow}>
            <Chip label="≤ $8" />
            <Chip label="Happy Hour" />
            <Chip label="Near Campus" />
            <Chip label="Vegetarian" />
          </View>

          <View style={styles.footerNote}>
            <Text style={styles.footerText}>Built at UCLA • v0.1</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ActionCard({ icon, title, text, onPress, big, accent }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        big && styles.cardBig,
        accent === "map" && styles.cardAccent,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <View style={styles.ctaRow}>
        <Text style={styles.ctaText}>Open</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.uclaBlue} />
      </View>
    </Pressable>
  );
}

function Chip({ label }) {
  return (
    <View style={styles.chip}>
      <View style={styles.chipDot} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 32 },
  brandRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 8 },
  logoDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.uclaBlue, marginRight: 10
  },
  title: { fontSize: 34, fontWeight: "800", letterSpacing: -0.5, color: colors.ink },
  subtitle: { fontSize: 16, color: colors.text, marginBottom: 18 },

  row: { flexDirection: "row", gap: 14, marginBottom: 14 },

  card: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.08)" // faint UCLA blue edge
  },
  cardBig: { marginBottom: 14 },
  cardAccent: {
    // subtle gold highlight for the primary card
    borderColor: colors.uclaGold,
    shadowOpacity: 0.12
  },
  cardPressed: { transform: [{ scale: 0.99 }], opacity: 0.96 },

  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.cardTint,
    alignItems: "center", justifyContent: "center",
    marginBottom: 10
  },
  cardTitle: { fontSize: 20, fontWeight: "800", marginBottom: 4, color: colors.ink },
  cardText: { fontSize: 14, color: colors.text, marginBottom: 14 },
  ctaRow: { marginTop: "auto", flexDirection: "row", alignItems: "center", gap: 6 },
  ctaText: { fontWeight: "800", fontSize: 14, color: colors.uclaBlue },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
    marginBottom: 10
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,209,0,0.6)" // UCLA gold
  },
  chipDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.uclaGold, marginRight: 6
  },
  chipText: { fontSize: 12, fontWeight: "700", color: colors.ink },

  footerNote: { alignItems: "center", marginTop: 18 },
  footerText: { color: "#7A8592", fontSize: 12 }
});

/*import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={["#fefefe", "#f3f7ff"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Brand *}
          <View style={styles.brandRow}>
            <View style={styles.logoDot} />
            <Text style={styles.title}>Bruin Bites</Text>
          </View>
          <Text style={styles.subtitle}>
            Cheap eats, smart recipes, and campus food hacks — all in one place.
          </Text>

          {/* Quick actions *}
          <View style={styles.row}>
            <ActionCard
              icon={<Ionicons name="map" size={28} />}
              title="Cheap Eats Map"
              text="Find deals, discounts & happy hours near you."
              onPress={() => navigation.navigate("Map")}
            />
          </View>

          <View style={styles.row}>
            <ActionCard
              icon={<MaterialCommunityIcons name="silverware-fork-knife" size={28} />}
              title="Budget Recipes"
              text="AI ideas from TJ’s & Ralphs staples."
              onPress={() => navigation.navigate("Recipes")}
            />
            <ActionCard
              icon={<Ionicons name="people" size={28} />}
              title="Community"
              text="Student tips, hall remixes & $5 meals."
              onPress={() => navigation.navigate("Community")}
            />
          </View>

          {/* Info strip *}
          <View style={styles.footerNote}>
            <Text style={styles.footerText}>Built at UCLA • v0.1</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ActionCard({ icon, title, text, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <View style={styles.ctaRow}>
        <Text style={styles.ctaText}>Open</Text>
        <Ionicons name="arrow-forward" size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#456BFF",
    marginRight: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#566",
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#5A6773",
    marginBottom: 14,
  },
  ctaRow: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ctaText: {
    fontWeight: "700",
    fontSize: 14,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 22,
  },
  footerText: {
    color: "#7A8592",
    fontSize: 12,
  },
});
*/
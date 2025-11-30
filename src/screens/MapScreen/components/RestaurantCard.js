import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const RestaurantCard = ({ item, selected, onPress }) => {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={22}
          color={colors.uclaBlue}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          ⭐ {item.rating || "N/A"} • 🚗{" "}
          {item.userDistanceText || item.distance_text || "N/A"}
        </Text>
        <Text style={styles.deal}>{item.address || "Address not marked "}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#88939E" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.uclaGold,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 16, fontWeight: "800", color: "#1B2430" },
  meta: { fontSize: 12, color: "#5F6C7B", marginTop: 2 },
  deal: { fontSize: 12, color: "#223", marginTop: 6, fontWeight: "600" },
});

export default RestaurantCard;

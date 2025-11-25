import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../theme/colors";

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();

  const navItems = [
    { key: "Discover", letter: "D", route: "Home" },
    { key: "Map", letter: "M", route: "Map" },
    { key: "Save", letter: "S", route: "Home" }, // Placeholder
    { key: "Recipe", letter: "R", route: "Recipes" },
    { key: "Me", letter: "P", route: "Profile" },
  ];

  const isActive = (routeName) => {
    if (routeName === "Profile" && (route.name === "Profile" || route.name === "EditProfile" || route.name === "Contributions" || route.name === "Following" || route.name === "History" || route.name === "Notifications" || route.name === "Account")) {
      return true;
    }
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <Pressable
            key={item.key}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.circle, active && styles.circleActive]}>
              <Text style={[styles.letter, active && styles.letterActive]}>
                {item.letter}
              </Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.key}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 20, // Reduced bottom padding
    paddingHorizontal: 8,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2.5 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D9D9D9", // Default gray
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4, // Reduce gap
  },
  circleActive: {
    backgroundColor: colors.uclaBlue,
  },
  letter: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  letterActive: {
    color: "#fff",
  },
  label: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "500",
  },
  labelActive: {
    color: colors.ink,
    fontWeight: "700",
  },
});


import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => {
    if (routeName === "Profile" && (route.name === "Profile" || route.name === "EditProfile" || route.name === "Contributions" || route.name === "ContributorProfile" || route.name === "Following" || route.name === "History" || route.name === "Notifications" || route.name === "Account")) {
      return true;
    }
    return route.name === routeName;
  };

  const renderIcon = (key, active) => {
    const activeColor = "#255633";
    const inactiveColor = "#9CA3AF";
    const iconSize = 40;

    switch (key) {
      case "Discover":
        return (
          <Ionicons
            name="search"
            size={iconSize}
            color={active ? activeColor : inactiveColor}
            style={{ fontWeight: "bold" }}
          />
        );
      case "Map":
        return (
          <Ionicons
            name="location-outline"
            size={iconSize}
            color={active ? activeColor : inactiveColor}
            style={{ fontWeight: "bold" }}
          />
        );
      case "Save":
        return (
          <Ionicons
            name="bookmark-outline"
            size={iconSize}
            color={active ? activeColor : inactiveColor}
            style={{ fontWeight: "bold" }}
          />
        );
      case "Recipe":
        return (
          <MaterialCommunityIcons
            name="silverware-fork-knife"
            size={iconSize}
            color={active ? activeColor : inactiveColor}
            style={{ fontWeight: "bold" }}
          />
        );
      case "Me":
        return (
          <View style={[styles.profileIconContainer, active && styles.profileIconContainerActive]}>
            <Ionicons
              name="person"
              size={24}
              color={active ? "#255633" : "#9CA3AF"}
              style={{ fontWeight: "bold" }}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { key: "Discover", route: "Home" },
    { key: "Map", route: "Map" },
    { key: "Save", route: "Home" }, // Placeholder
    { key: "Recipe", route: "Recipes" },
    { key: "Me", route: "Profile" },
  ];

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
            {renderIcon(item.key, active)}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingTop: 14,
    paddingBottom: 12, 
    paddingHorizontal: 27,
    justifyContent: "space-between",
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
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DCE8D4",
    alignItems: "center",
    justifyContent: "center",
  },
  profileIconContainerActive: {
    backgroundColor: "#DCE8D4",
  },
});


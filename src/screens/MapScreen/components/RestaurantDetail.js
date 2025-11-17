import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";

const DEFAULT_META = {
  schedule: "October 17, 2025 • 12:00 PM – 1:30 PM",
  host: "Hosted by UCLA Career Center with WESCOM Financial",
  description:
    "Are you ready to take control of your financial future? Join us for a financial literacy event hosted by UCLA Campus Life and Recreation. The first 40 attendees will get FREE food!",
  tags: ["On Campus", "FCFS", "Lunch", "Vegan"],
  gallery: [
    { id: "placeholder-1" },
    { id: "placeholder-2" },
    { id: "placeholder-3" },
  ],
  menu: [
    {
      title: "Chicken Sandwich",
      items: ["Chicken Sandwich", "Vegan Sandwich", "Chips"],
    },
    {
      title: "Vegan Sandwich",
      items: ["Salad", "Chocolate Cookies", "Water"],
    },
    {
      title: "Salad Bar",
      items: ["Fresh Greens", "Seasonal Veggies", "House Dressing"],
    },
  ],
  allergies: [
    "Vegan",
    "Contains Soy",
    "Contains Wheat",
    "Low-Carbon-Footprint",
    "Contains Gluten",
    "Contains Egg",
  ],
};

const RestaurantDetail = ({
  restaurant,
  onGetDirections,
  favorite,
  onToggleFavorite,
}) => {
  const name = restaurant?.name || "Unnamed place";
  const addressSource =
    restaurant?.address ||
    restaurant?.formatted_address ||
    restaurant?.vicinity ||
    "Address not available";

  const addressLines = useMemo(() => {
    if (!addressSource || typeof addressSource !== "string") {
      return ["Address not available"];
    }
    return addressSource.split(",").map((line) => line.trim());
  }, [addressSource]);

  const galleryItems = useMemo(() => {
    if (Array.isArray(restaurant?.photos) && restaurant.photos.length > 0) {
      return restaurant.photos.slice(0, 6).map((photo, index) => ({
        id:
          photo?.photo_reference ||
          photo?.id ||
          (typeof photo === "string" ? photo : `photo-${index}`),
        uri: typeof photo === "string" ? photo : photo?.uri || null,
      }));
    }
    if (Array.isArray(restaurant?.images) && restaurant.images.length > 0) {
      return restaurant.images.slice(0, 6).map((uri, index) => ({
        id: `image-${index}`,
        uri: typeof uri === "string" ? uri : null,
      }));
    }
    return DEFAULT_META.gallery;
  }, [restaurant]);

  const menuItems = useMemo(() => {
    if (Array.isArray(restaurant?.menu) && restaurant.menu.length > 0) {
      const normalized = restaurant.menu.map((entry, index) => {
        if (typeof entry === "string") {
          return {
            title: `Option ${index + 1}`,
            items: [entry],
          };
        }
        if (entry && typeof entry === "object") {
          const title =
            entry.title ||
            entry.name ||
            entry.category ||
            `Option ${index + 1}`;
          const items = Array.isArray(entry.items)
            ? entry.items
            : entry.description
            ? [entry.description]
            : [];
          return { title, items };
        }
        return null;
      });

      const filtered = normalized.filter(Boolean);
      return filtered.length > 0 ? filtered : DEFAULT_META.menu;
    }
    return DEFAULT_META.menu;
  }, [restaurant]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.titleIcons}>
          <IconCircleButton name="share-outline" />
          <IconCircleButton
            name={favorite ? "heart" : "heart-outline"}
            active={favorite}
            onPress={onToggleFavorite}
          />
          <IconCircleButton name="bookmark-outline" />
        </View>
      </View>

      <TouchableOpacity
        onPress={onGetDirections}
        style={styles.primaryButton}
        activeOpacity={0.85}
      >
        <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Get Directions</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryContent}
      >
        {galleryItems.map((item, index) => (
          <View key={item.id || `gallery-${index}`} style={styles.galleryTile}>
            {item.uri ? (
              <Image source={{ uri: item.uri }} style={styles.galleryImage} />
            ) : (
              <Ionicons name="image-outline" size={24} color="#94A3B8" />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.scheduleRow}>
        <Ionicons name="calendar-outline" size={18} color="#000000" />
        <View style={{ flex: 1 }}>
          <Text style={styles.scheduleText}>{DEFAULT_META.schedule}</Text>
          <Text style={styles.hostText}>{DEFAULT_META.host}</Text>
        </View>
      </View>

      <Text style={styles.description}>{DEFAULT_META.description}</Text>

      <View style={styles.tagRow}>
        {DEFAULT_META.tags.map((tag) => (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.locationSection}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={32} color="#8C8C8C" />
          </View>
          <TouchableOpacity style={styles.mapExpandButton}>
            <Ionicons name="expand-outline" size={18} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={18} color="#000000" />
          <View style={{ flex: 1 }}>
            {addressLines.map((line, index) => (
              <Text key={index} style={styles.addressLine}>
                {line}
              </Text>
            ))}
          </View>
          <Text style={styles.distanceText}>0.5 mi</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
        <Text style={styles.secondaryButtonText}>RSVP</Text>
      </TouchableOpacity>

      <View style={styles.hostCard}>
        <View style={styles.hostAvatar}>
          <Text style={styles.hostAvatarText}>{name?.charAt(0) ?? "R"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.hostName}>UCLA Career Center</Text>
          <Text style={styles.hostMeta}>23 Contributions</Text>
        </View>
        <TouchableOpacity style={styles.followButton} activeOpacity={0.9}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuScrollContent}
        >
          {menuItems
            .filter(Boolean)
            .map((entry, index) => (
              <View key={entry.title || `menu-${index}`} style={styles.menuCard}>
                <View style={styles.menuImagePlaceholder}>
                  <Ionicons name="image-outline" size={24} color="#8C8C8C" />
                </View>
                <Text style={styles.menuTitle}>
                  {entry.title || `Option ${index + 1}`}
                </Text>
              </View>
            ))}
        </ScrollView>
        <View style={styles.menuList}>
          {menuItems
            .filter(Boolean)
            .flatMap((entry) => entry.items || [])
            .map((item, index) => (
              <Text key={`${item}-${index}`} style={styles.menuItem}>
                • {item}
              </Text>
            ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergies</Text>
        <View style={styles.allergyGrid}>
          {DEFAULT_META.allergies.map((label) => (
            <View key={label} style={styles.allergyPill}>
              <View style={styles.allergyCheckbox} />
              <Text style={styles.allergyText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <View style={styles.allergyGrid}>
          <View style={styles.allergyPill}>
            <View style={[styles.allergyCheckbox, styles.allergyCheckboxFilled]} />
            <Text style={styles.allergyText}>Wheelchair accessible</Text>
          </View>
          <View style={styles.allergyPill}>
            <View style={[styles.allergyCheckbox, styles.allergyCheckboxFilled]} />
            <Text style={styles.allergyText}>Accessible parking near entrance</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const IconCircleButton = ({ name, active, onPress }) => (
  <Pressable
    onPress={onPress}
    hitSlop={12}
    style={[
      styles.iconCircle,
      active && { backgroundColor: "rgba(138, 182, 68, 0.12)" },
    ]}
  >
    <Ionicons
      name={name}
      size={16}
      color={active ? "#F65952" : "#000000"}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 4,
    gap: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
  },
  titleIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(140,140,140,0.3)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#8AB644",
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  galleryContent: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 4,
  },
  galleryTile: {
    width: 160,
    minHeight: 110,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
  },
  hostText: {
    fontSize: 12,
    color: "#000000",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#8AB644",
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8AB644",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  locationSection: {
    gap: 12,
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  mapExpandButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  addressLine: {
    fontSize: 13,
    color: "#000000",
  },
  distanceText: {
    fontSize: 13,
    color: "#8C8C8C",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#8AB644",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E4E7EC",
    alignItems: "center",
    justifyContent: "center",
  },
  hostAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475467",
  },
  hostName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1D2939",
  },
  hostMeta: {
    fontSize: 12,
    color: "#475467",
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.uclaBlue,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.uclaBlue,
  },
  menuScrollContent: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 4,
  },
  menuCard: {
    width: 120,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    gap: 8,
  },
  menuImagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
    paddingHorizontal: 8,
    paddingBottom: 8,
    textAlign: "center",
  },
  menuList: {
    marginTop: 12,
    gap: 4,
  },
  menuItem: {
    fontSize: 12,
    color: "#000000",
  },
  allergyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  allergyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(140,140,140,0.3)",
  },
  allergyCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#8AB644",
    backgroundColor: "#FFFFFF",
  },
  allergyCheckboxFilled: {
    backgroundColor: "#8AB644",
  },
  allergyText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
  },
});

export default RestaurantDetail;

import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { API_BASE_URL } from "../../../services/api";
// import IconCircleButton from "../../../components/IconCircleButton";

const DEFAULT_META = {
  gallery: [
    { id: "placeholder-1" },
    { id: "placeholder-2" },
    { id: "placeholder-3" },
    { id: "placeholder-4" },
    { id: "placeholder-5" },
  ],
  menu: [],
};

const RestaurantDetail = ({
  restaurant,
  onGetDirections,
  favorite,
  onToggleFavorite,
}) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
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

  const buildPhotoUri = useMemo(() => {
    const base = API_BASE_URL.replace(/\/$/, "");
    const root = base.endsWith("/api") ? base.slice(0, -4) : base;

    return (photoReference, maxWidth = 800) => {
      if (!photoReference) return null;
      return `${root}/api/photos/${encodeURIComponent(
        photoReference
      )}?maxwidth=${maxWidth}`;
    };
  }, []);

  const normalizedPhotos = useMemo(() => {
    if (Array.isArray(restaurant?.photos) && restaurant.photos.length > 0) {
      const seen = new Set();
      return restaurant.photos
        .map((photo, index) => {
          const proxyUri =
            typeof photo === "object" && photo?.photo_reference
              ? buildPhotoUri(photo.photo_reference)
              : null;

          const inlineUri =
            typeof photo === "object" && typeof photo?.uri === "string"
              ? photo.uri
              : null;
          const inlineUriSafe =
            inlineUri && inlineUri.includes("key=") ? null : inlineUri;
          const resolvedUri =
            inlineUriSafe && inlineUriSafe.startsWith("http")
              ? inlineUriSafe
              : proxyUri || inlineUriSafe;

          const key =
            photo?.photo_reference ||
            resolvedUri ||
            inlineUriSafe ||
            `idx-${index}`;
          if (seen.has(key)) {
            return null;
          }
          seen.add(key);

          return {
            id:
              photo?.photo_reference ||
              photo?.id ||
              (typeof photo === "string" ? photo : `photo-${index}`),
            uri: typeof photo === "string" ? photo : resolvedUri || null,
          };
        })
        .filter(Boolean);
    }
    if (Array.isArray(restaurant?.images) && restaurant.images.length > 0) {
      return restaurant.images.map((uri, index) => ({
        id: `image-${index}`,
        uri: typeof uri === "string" ? uri : null,
      }));
    }
    return DEFAULT_META.gallery;
  }, [restaurant, buildPhotoUri]);

  const galleryItems = useMemo(() => {
    const photos = normalizedPhotos;
    const MAX_VISIBLE = 5;
    if (showAllPhotos) return photos;
    return photos.slice(0, MAX_VISIBLE);
  }, [normalizedPhotos, showAllPhotos]);

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

      {Array.isArray(normalizedPhotos) && normalizedPhotos.length > 5 && (
        <TouchableOpacity
          style={styles.viewAllButton}
          activeOpacity={0.85}
          onPress={() => setShowAllPhotos((prev) => !prev)}
        >
          <Text style={styles.viewAllText}>
            {showAllPhotos
              ? "Show fewer photos"
              : `View all photos (${normalizedPhotos.length})`}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.locationSection}>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={18} color="#000000" />
          <View style={{ flex: 1 }}>
            {addressLines.map((line, index) => (
              <Text key={index} style={styles.addressLine}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {restaurant?.place_id ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`
              )
            }
            style={styles.secondaryButton}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>View Menu</Text>
          </TouchableOpacity>
        </View>
      ) : null}
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
    <Ionicons name={name} size={16} color={active ? "#F65952" : "#000000"} />
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
  viewAllButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginLeft: 2,
  },
  viewAllText: {
    color: colors.uclaBlue,
    fontWeight: "700",
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

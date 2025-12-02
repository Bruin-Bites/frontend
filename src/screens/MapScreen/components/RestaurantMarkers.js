import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { colors } from "../../../theme/colors";

// Conditionally import Marker and Callout only on native platforms
let Marker, Callout;
try {
  if (Platform.OS !== 'web') {
    const MapModule = require("react-native-maps");
    Marker = MapModule.Marker;
    Callout = MapModule.Callout;
  }
} catch (e) {
  // Map components not available on web
}

const RestaurantMarkers = ({
  restaurants,
  selectedId,
  onSelect,
  onNavigate,
}) => {
  if (Platform.OS === 'web') {
    return null;
  }

  return restaurants.map((item) => {
    const lat = item?.geometry?.location?.lat;
    const lng = item?.geometry?.location?.lng;
    if (lat === undefined || lng === undefined) {
      return null;
    }

    const id = item._id || item.id || item.place_id || item.name;
    const handleCalloutPress = onNavigate ? () => onNavigate(item) : undefined;

    return (
      <Marker
        key={id}
        coordinate={{ latitude: lat, longitude: lng }}
        pinColor={id === selectedId ? colors.uclaGold : colors.uclaBlue}
        onPress={() => onSelect(item)}
        onCalloutPress={handleCalloutPress}
      >
        <Callout>
          <View style={styles.callout}>
            <Text style={styles.calloutName}>{item.name}</Text>
            <Text style={styles.calloutAddress}>
              {item.address || "Address unavailable"}
            </Text>
            <Text style={[styles.calloutButtonText, { color: colors.uclaBlue }]}>
              Get Directions →
            </Text>
          </View>
        </Callout>
      </Marker>
    );
  });
};

const styles = StyleSheet.create({
  callout: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  calloutName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D1B2A",
  },
  calloutAddress: {
    fontSize: 12,
    color: "#4E5D6A",
  },
  calloutButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default RestaurantMarkers;

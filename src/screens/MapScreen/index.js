import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  Platform,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
  PanResponder,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapControls from "./components/MapControls";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantDetail from "./components/RestaurantDetail";
import RestaurantMarkers from "./components/RestaurantMarkers";
import Filter from "./components/Filters/components/Filter";
import useRestaurantList from "../../hooks/useRestaurantList";
import useUserLocation from "./hooks/useUserLocation";
import useRestaurantResults from "./hooks/useRestaurantResults";

const FILTER_OPTIONS = {
  price: ["$", "$$", "$$$", "$$$$"],
  distance: { min: 0, max: 50 },
  dietary: ["Vegetarian"],
  deals: ["Free Item"],
  location: ["Near Campus"],
  foodType: [],
  date: ["Today"],
};

const MapScreen = () => {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    price: ["$", "$$", "$$$", "$$$$"],
    distance: { min: 0, max: 50 },
    dietary: [],
    deals: [],
    location: ["Near Campus"],
    foodType: [],
    date: [],
  });
  const [mapMode, setMapMode] = useState("native");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [transientError, setTransientError] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const mapRef = useRef(null);
  const lastFitSignatureRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const collapsedHeight = 180;
  const sheetHeight = useMemo(
    () => Math.min(windowHeight * 0.75, 560),
    [windowHeight]
  );
  const maxTranslate = useMemo(
    () => Math.max(sheetHeight - collapsedHeight, 0),
    [sheetHeight]
  );
  const sheetTranslate = useRef(new Animated.Value(maxTranslate)).current;
  const sheetValueRef = useRef(maxTranslate);
  const panOffsetRef = useRef(maxTranslate);

  const { restaurants, loading, error: listError } = useRestaurantList();
  const { userLocation, locationError } = useUserLocation();

  const { filtered, restaurantsWithCoordinates } = useRestaurantResults({
    restaurants,
    userLocation,
    query,
    active: activeFilters,
  });

  const mapProvider = useMemo(
    () =>
      mapMode === "google" && Platform.OS !== "web"
        ? PROVIDER_GOOGLE
        : undefined,
    [mapMode]
  );
  const searchBarHeight = useMemo(
    () => (topBarHeight > 0 ? topBarHeight : 64),
    [topBarHeight]
  );

  const overlayTopOffset = useMemo(() => {
    const base = headerHeight > 0 ? headerHeight : insets.top;
    return Math.max(base - 18, 0);
  }, [headerHeight, insets.top]);

  const effectiveTopPadding = useMemo(
    () => overlayTopOffset + searchBarHeight + 32,
    [overlayTopOffset, searchBarHeight]
  );

  const mapEdgePadding = useMemo(
    () => ({
      top: effectiveTopPadding,
      right: 40,
      bottom: sheetHeight + 80,
      left: 40,
    }),
    [effectiveTopPadding, sheetHeight]
  );

  useEffect(() => {
    sheetTranslate.setValue(maxTranslate);
    sheetValueRef.current = maxTranslate;
    panOffsetRef.current = maxTranslate;
  }, [maxTranslate, sheetTranslate]);

  const fitSignature = useMemo(() => {
    if (!restaurantsWithCoordinates.length) {
      return null;
    }

    return restaurantsWithCoordinates
      .map((item) => {
        const id = item._id || item.id || item.place_id || item.name;
        const lat = item?.geometry?.location?.lat;
        const lng = item?.geometry?.location?.lng;
        return `${id ?? "unknown"}:${lat ?? "?"},${lng ?? "?"}`;
      })
      .join("|");
  }, [restaurantsWithCoordinates]);

  useEffect(() => {
    if (fitSignature === null || !mapRef.current) {
      return;
    }

    if (lastFitSignatureRef.current === fitSignature) {
      return;
    }

    const coordinates = restaurantsWithCoordinates
      .map((item) => ({
        latitude: item?.geometry?.location?.lat,
        longitude: item?.geometry?.location?.lng,
      }))
      .filter(
        (point) =>
          Number.isFinite(point.latitude) && Number.isFinite(point.longitude)
      );

    if (coordinates.length === 0) {
      return;
    }

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        {
          ...coordinates[0],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        350
      );
      lastFitSignatureRef.current = fitSignature;
      return;
    }

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: mapEdgePadding,
      animated: true,
    });
    lastFitSignatureRef.current = fitSignature;
  }, [fitSignature, restaurantsWithCoordinates, mapMode, mapEdgePadding]);

  useEffect(() => {
    lastFitSignatureRef.current = null;
  }, [mapMode]);

  const toggleFilter = useCallback((label) => {
    setActiveFilters((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }, []);

  const animateSheetTo = useCallback(
    (toValue) => {
      sheetValueRef.current = toValue;
      panOffsetRef.current = toValue;
      Animated.spring(sheetTranslate, {
        toValue,
        useNativeDriver: true,
        damping: 18,
        stiffness: 220,
        mass: 0.9,
      }).start();
    },
    [sheetTranslate]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 4,
        onPanResponderGrant: () => {
          sheetTranslate.stopAnimation((value) => {
            sheetValueRef.current = value;
            panOffsetRef.current = value;
          });
        },
        onPanResponderMove: (_, gestureState) => {
          const next = Math.min(
            Math.max(panOffsetRef.current + gestureState.dy, 0),
            maxTranslate
          );
          sheetTranslate.setValue(next);
          sheetValueRef.current = next;
        },
        onPanResponderRelease: (_, gestureState) => {
          const current = sheetValueRef.current;
          const shouldExpand =
            gestureState.vy < -0.5 ||
            (Math.abs(gestureState.vy) <= 0.5 && current < maxTranslate / 2);
          animateSheetTo(shouldExpand ? 0 : maxTranslate);
        },
        onPanResponderTerminate: () => {
          const isExpanded = sheetValueRef.current < maxTranslate / 2;
          animateSheetTo(isExpanded ? 0 : maxTranslate);
        },
      }),
    [animateSheetTo, maxTranslate, sheetTranslate]
  );

  const handleToggleSheet = useCallback(() => {
    const isExpanded = sheetValueRef.current <= maxTranslate / 2;
    animateSheetTo(isExpanded ? maxTranslate : 0);
  }, [animateSheetTo, maxTranslate]);

  const resetSelection = useCallback(() => {
    setViewMode("list");
    setSelectedRestaurant(null);
    setSelectedId(null);
  }, [setSelectedId, setSelectedRestaurant, setViewMode]);

  const handleCollapseSheet = useCallback(() => {
    resetSelection();
    animateSheetTo(maxTranslate);
  }, [animateSheetTo, maxTranslate, resetSelection]);

  const handleReturnToList = useCallback(() => {
    setViewMode("list");
    setSelectedRestaurant(null);
    const target = Math.max(maxTranslate - 180, 0);
    animateSheetTo(target);
  }, [animateSheetTo, maxTranslate, setSelectedRestaurant, setViewMode]);

  const toggleFavorite = useCallback((item) => {
    if (!item) {
      return;
    }
    const id = item._id || item.id || item.place_id || item.name;
    if (!id) {
      return;
    }
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectRestaurant = useCallback(
    (item, { openDetail = false } = {}) => {
      if (!item) {
        return;
      }
      const id = item._id || item.id || item.place_id || item.name;
      setSelectedId(id);
      setSelectedRestaurant(item);
      const lat = item?.geometry?.location?.lat;
      const lng = item?.geometry?.location?.lng;
      if (
        lat !== undefined &&
        lng !== undefined &&
        mapRef.current &&
        typeof mapRef.current.animateToRegion === "function"
      ) {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          250
        );
      }
      if (openDetail) {
        setViewMode("detail");
        animateSheetTo(0);
      }
    },
    [animateSheetTo, setSelectedRestaurant, setSelectedId, setViewMode]
  );

  const handleNavigate = useCallback(
    (restaurant) => {
      if (!restaurant) {
        return;
      }

      setTransientError(null);

      const lat = restaurant?.geometry?.location?.lat;
      const lng = restaurant?.geometry?.location?.lng;
      const hasCoords =
        typeof lat === "number" &&
        !Number.isNaN(lat) &&
        typeof lng === "number" &&
        !Number.isNaN(lng);
      const placeId =
        restaurant?.place_id ||
        restaurant?.placeId ||
        restaurant?.placeID ||
        restaurant?.googlePlaceId ||
        restaurant?.google_place_id ||
        null;
      const name =
        typeof restaurant?.name === "string" && restaurant.name.trim().length > 0
          ? restaurant.name.trim()
          : "Destination";
      const addressText =
        typeof restaurant?.address === "string" && restaurant.address.trim()
          ? restaurant.address.trim()
          : null;
      const origin =
        userLocation && typeof userLocation.latitude === "number"
          ? `${userLocation.latitude},${userLocation.longitude}`
          : null;

      const buildWebFallback = () => {
        if (hasCoords) {
          return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${
            placeId ? `&destination_place_id=${encodeURIComponent(placeId)}` : ""
          }${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`;
        }
        if (addressText) {
          return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            addressText
          )}${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`;
        }
        return null;
      };

      const openFallbackWeb = () => {
        const fallback = buildWebFallback();
        if (!fallback) {
          setTransientError("Missing destination details for this restaurant.");
          return;
        }
        Linking.openURL(fallback).catch(() => {
          setTransientError("Unable to open navigation on this device.");
        });
      };

      if (Platform.OS === "ios") {
        if (hasCoords) {
          const label = encodeURIComponent(name);
          const appleUrl = `maps://?daddr=${lat},${lng}&q=${label}`;
          Linking.openURL(appleUrl).catch(() => {
            const httpUrl = `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}${
              origin ? `&saddr=${encodeURIComponent(origin)}` : ""
            }`;
            Linking.openURL(httpUrl).catch(() => {
              if (addressText) {
                const addressUrl = `http://maps.apple.com/?daddr=${encodeURIComponent(
                  addressText
                )}${origin ? `&saddr=${encodeURIComponent(origin)}` : ""}`;
                Linking.openURL(addressUrl).catch(openFallbackWeb);
              } else {
                openFallbackWeb();
              }
            });
          });
          return;
        }

        if (addressText) {
          const appleAddressUrl = `http://maps.apple.com/?daddr=${encodeURIComponent(
            addressText
          )}${origin ? `&saddr=${encodeURIComponent(origin)}` : ""}`;
          Linking.openURL(appleAddressUrl).catch(openFallbackWeb);
          return;
        }

        setTransientError("Missing destination details for this restaurant.");
        return;
      }

      if (Platform.OS === "android") {
        const openAndroid = async () => {
          try {
            if (placeId) {
              const googleIntent = `google.navigation:q=place_id:${placeId}`;
              const supported = await Linking.canOpenURL(googleIntent);
              if (supported) {
                await Linking.openURL(googleIntent);
                return;
              }

              const geoPlaceUrl = `geo:0,0?q=place_id:${placeId}`;
              const geoSupported = await Linking.canOpenURL(geoPlaceUrl);
              if (geoSupported) {
                await Linking.openURL(geoPlaceUrl);
                return;
              }
            }

            if (hasCoords) {
              const geoCoordUrl = `geo:${lat},${lng}?q=${encodeURIComponent(name)}`;
              await Linking.openURL(geoCoordUrl);
              return;
            }

            if (addressText) {
              const geoAddressUrl = `geo:0,0?q=${encodeURIComponent(addressText)}`;
              await Linking.openURL(geoAddressUrl);
              return;
            }

            openFallbackWeb();
          } catch (error) {
            openFallbackWeb();
          }
        };

        openAndroid();
        return;
      }

      openFallbackWeb();
    },
    [userLocation]
  );

  const confirmNavigate = useCallback(
    (restaurant) => {
      if (!restaurant) {
        return;
      }
      Alert.alert(
        "Get directions",
        `Do you want to get the direction to ${restaurant.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => handleNavigate(restaurant) },
        ]
      );
    },
    [handleNavigate]
  );

  const errorMessage = transientError || locationError || listError;
  const isDetailView = viewMode === "detail" && selectedRestaurant;
  const handleTopLayout = useCallback(
    ({ nativeEvent }) => {
      if (nativeEvent?.layout?.height) {
        setTopBarHeight(nativeEvent.layout.height);
      }
    },
    [setTopBarHeight]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const id = item._id || item.id || item.place_id || item.name;
      return (
        <RestaurantCard
          item={item}
          selected={id === selectedId}
          favorite={favoriteIds.has(id)}
          onPress={() => handleSelectRestaurant(item, { openDetail: true })}
          onToggleFavorite={() => toggleFavorite(item)}
        />
      );
    },
    [favoriteIds, handleSelectRestaurant, selectedId, toggleFavorite]
  );

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={mapProvider}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: userLocation?.latitude || 34.0689,
            longitude: userLocation?.longitude || -118.4452,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton
          showsCompass
        >
          <RestaurantMarkers
            restaurants={restaurantsWithCoordinates}
            selectedId={selectedId}
            onSelect={(item) =>
              handleSelectRestaurant(item, { openDetail: true })
            }
            onNavigate={confirmNavigate}
          />
        </MapView>

        <Animated.View
          style={[
            styles.resultsSheet,
            {
              height: sheetHeight,
              transform: [{ translateY: sheetTranslate }],
            },
          ]}
        >
          <View style={styles.sheetHandleArea} {...panResponder.panHandlers}>
            <TouchableWithoutFeedback onPress={handleToggleSheet}>
              <View style={styles.sheetHandle} />
            </TouchableWithoutFeedback>
          </View>

          {isDetailView ? (
            <>
              <View style={styles.sheetHeader} {...panResponder.panHandlers}>
                <View style={styles.detailHeaderRow}>
                  <TouchableOpacity
                    onPress={handleReturnToList}
                    hitSlop={12}
                    style={styles.detailHeaderButton}
                  >
                    <Ionicons name="chevron-back" size={20} color="#475467" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle} numberOfLines={1}>
                    {selectedRestaurant?.name || "Details"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCollapseSheet} hitSlop={12}>
                  <Ionicons name="close" size={20} color="#475467" />
                </TouchableOpacity>
              </View>
              {selectedRestaurant ? (
                <RestaurantDetail
                  restaurant={selectedRestaurant}
                  favorite={selectedId ? favoriteIds.has(selectedId) : false}
                  onToggleFavorite={() => toggleFavorite(selectedRestaurant)}
                  onGetDirections={() => confirmNavigate(selectedRestaurant)}
                />
              ) : null}
            </>
          ) : (
            <>
              <View style={styles.sheetHeader} {...panResponder.panHandlers}>
                <View>
                  <Text style={styles.sheetTitle}>Search Results</Text>
                  <Text style={styles.sheetSubtitle}>
                    {filtered.length} place{filtered.length === 1 ? "" : "s"} nearby
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCollapseSheet} hitSlop={12}>
                  <Ionicons name="close" size={20} color="#475467" />
                </TouchableOpacity>
              </View>

              <FlatList
              data={filtered}
              keyExtractor={(item) =>
                item._id || item.id || item.place_id || item.name
              }
              extraData={favoriteIds}
              contentContainerStyle={styles.resultsContent}
              ItemSeparatorComponent={() => <View style={styles.cardSpacer} />}
              renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    We could not find any places that match your filters yet.
                  </Text>
                }
              />
            </>
          )}
        </Animated.View>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.overlayTop,
          {
            top: overlayTopOffset,
          },
        ]}
        onLayout={handleTopLayout}
      >
        <View style={styles.searchField}>
          <Ionicons name="search" size={18} color="#475467" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Find deals, discounts, offers"
            placeholderTextColor="#98A2B3"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="#98A2B3" />
            </TouchableOpacity>
          )}
          <View style={styles.filterDivider} />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFiltersVisible(true)}
            hitSlop={{ top: 12, left: 12, bottom: 12, right: 12 }}
          >
            <Ionicons name="options-outline" size={20} color="#1D2939" />
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={filtersVisible}
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setFiltersVisible(false)}
          />
          <View style={styles.modalCard}>
            <Filter
              onApply={() => {
                // Handle apply logic here
                setFiltersVisible(false);
              }}
              onClose={() => setFiltersVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7ECF5",
  },
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
    backgroundColor: "transparent",
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.8)",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(226,232,240,0.8)",
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  inlineError: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(239,68,68,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  inlineErrorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  resultsSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  sheetHandleArea: {
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: "center",
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D0D5DD",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  detailHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  sheetSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  cardSpacer: {
    height: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 0,
    maxHeight: "90%",
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
});

export default MapScreen;

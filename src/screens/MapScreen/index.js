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
  Image,
  ScrollView,
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
import { useFocusEffect } from "@react-navigation/native";
import MapControls from "./components/MapControls";
import RestaurantCard from "./components/RestaurantCard";
import RestaurantDetail from "./components/RestaurantDetail";
import RestaurantMarkers from "./components/RestaurantMarkers";
import Filter from "./components/Filter";
import api from "../../services/api";
import useRestaurantList from "../../hooks/useRestaurantList";
import useUserLocation from "./hooks/useUserLocation";
import useRestaurantResults from "./hooks/useRestaurantResults";
import { calculateDistanceMeters, formatDistanceText } from "../../utils/geo";

const FILTER_OPTIONS = {
  price: ["$", "$$", "$$$", "$$$$"],
  distance: { min: 0, max: 5 }, // 0-5 miles range with 0.1 mile increments
  dietary: ["Vegetarian"],
  deals: ["Free Item"],
  location: ["Near Campus"],
  foodType: [],
  date: ["Today"],
};

const DEFAULT_FILTERS = {
  price: [],
  distance: { min: 0, max: 5 }, // Default to 5 miles: grid search covers ~2.3mi, 5mi provides good buffer
  dietary: [],
  deals: [],
  location: [],
  foodType: [],
  date: [],
  favoritesOnly: false,
};

const CONTRIBUTIONS = [
  {
    id: "contrib-1",
    title: "Saturday Brunch",
    time: "October 17, 2025 • 12:00 PM – 1:30 PM",
    distance: "0.5 mi",
    tags: ["On Campus", "FCFS", "Lunch", "Vegan"],
    host: "Student Media",
    latitude: 34.0689,
    longitude: -118.4452,
    mapPreview:
      "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504674900247-0831cf36e7c2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1525385133512-88c3c4021d39?auto=format&fit=crop&w=900&q=80",
    ],
    address: "106 Strathmore Pl, Los Angeles, CA 90095",
    description:
      "Join us for a Saturday Brunch hosted by Student Media at UCLA. Listen to speakers and the first 40 attendees will get FREE food!",
    allergies: ["Vegan", "Contains Soy", "Contains Wheat", "Low-Carbon-Footprint", "Contains Gluten", "Contains Egg"],
    accessibility: ["Wheelchair accessible", "Accessible parking near entrance"],
    menu: [
      { title: "Chicken Sandwich", items: ["Chicken Sandwich", "Chips"] },
      { title: "Vegan Sandwich", items: ["Vegan Sandwich", "Salad"] },
      { title: "Dessert", items: ["Chocolate Cookies", "Fruit"] },
    ],
  },
  {
    id: "contrib-2",
    title: "Free Matcha",
    time: "October 17, 2025 • 1:00 PM – 1:30 PM",
    distance: "0.5 mi",
    tags: ["Free", "Drinks"],
    host: "Campus Coffee Club",
    latitude: 34.0705,
    longitude: -118.4465,
    mapPreview:
      "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png",
    image:
      "https://images.unsplash.com/photo-1525385133512-88c3c4021d39?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1525385133512-88c3c4021d39?auto=format&fit=crop&w=900&q=80",
    ],
    address: "Kerckhoff Patio, UCLA",
    description: "Grab a free matcha latte on campus while supplies last!",
    allergies: ["Contains Soy"],
    accessibility: ["Ramp access"],
    menu: [{ title: "Matcha Latte", items: ["Iced Matcha", "Hot Matcha"] }],
  },
  {
    id: "contrib-3",
    title: "$5 Poke Bowls",
    time: "October 17, 2025 • 6:00 PM – 7:00 PM",
    distance: "0.8 mi",
    tags: ["Deal", "Poke"],
    host: "Bruin Eats",
    latitude: 34.059,
    longitude: -118.4435,
    mapPreview:
      "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
    ],
    address: "Westwood Blvd, Los Angeles, CA",
    description: "Discounted poke bowls from a local partner for one night only.",
    allergies: ["Contains Gluten", "Contains Soy"],
    accessibility: ["Elevator access"],
    menu: [{ title: "Poke Bowl", items: ["Salmon", "Tuna", "Tofu"] }],
  },
];

const MapScreen = () => {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS);
  const [mapMode, setMapMode] = useState("native");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [transientError, setTransientError] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState(() => new Set());
  const [favoriteContributionIds, setFavoriteContributionIds] = useState(
    () => new Set()
  );
  const [activeTab, setActiveTab] = useState("restaurants");
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const [rsvpThankYou, setRsvpThankYou] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ first: "", last: "", email: "" });
  const [contributions, setContributions] = useState(CONTRIBUTIONS);
  const [contributionError, setContributionError] = useState(null);
  const [contributionsLoaded, setContributionsLoaded] = useState(false);

  const contributionsWithCoordinates = useMemo(
    () =>
      contributions.map((c) => {
        const id =
          (c._id && c._id.toString ? c._id.toString() : c._id) ||
          c.id ||
          c.name;
        const lat =
          c?.geometry?.location?.lat ??
          c?.geometry?.location?.latitude ??
          c.latitude;
        const lng =
          c?.geometry?.location?.lng ??
          c?.geometry?.location?.longitude ??
          c.longitude;
        const hasCoords = typeof lat === "number" && typeof lng === "number";
        const distanceMeters =
          hasCoords && userLocation
            ? calculateDistanceMeters(userLocation, { latitude: lat, longitude: lng })
            : null;
        return {
          ...c,
          id,
          geometry: c.geometry || {
            location: {
              lat: lat ?? 34.0689,
              lng: lng ?? -118.4452,
            },
          },
          distance_value: distanceMeters ?? c.distance_value,
          distance_text: distanceMeters ? formatDistanceText(distanceMeters) : c.distance_text,
        };
      }),
    [contributions, userLocation]
  );
  const mapRef = useRef(null);
  const lastFitSignatureRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  //-------------handle filter state
  //------------------------------------------------
  const onUpdateFilters = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const onClose = (oldFilters) => {
    setActiveFilters(oldFilters);
    setFiltersVisible(false);
  };

  const onApply = () => {
    setFiltersVisible(false);
  };

  useEffect(() => {
    resetSelection();
  }, [activeTab]);

  const onReset = () => {
    setActiveFilters(DEFAULT_FILTERS);
  };
  //------------------------------------------------

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

  const { filtered } = useRestaurantResults({
    restaurants,
    userLocation,
    query,
    active: activeFilters,
  });

  const loadFavorites = useCallback(async () => {
    try {
      const res = await api.get("/auth/me/favorites");
      const restaurantList = Array.isArray(res.data?.favoriteRestaurants)
        ? res.data.favoriteRestaurants
        : [];
      const contributionList = Array.isArray(res.data?.favoriteContributions)
        ? res.data.favoriteContributions
        : [];

      setFavoriteRestaurantIds(
        new Set(restaurantList.map((fav) => fav.place_id).filter(Boolean))
      );
      setFavoriteContributionIds(
        new Set(
          contributionList
            .map((fav) =>
              typeof fav === "string"
                ? fav
                : fav?._id?.toString?.() || fav?.id || null
            )
            .filter(Boolean)
        )
      );
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error fetching favorites:", error.message);
      }
      setFavoriteRestaurantIds(new Set());
      setFavoriteContributionIds(new Set());
    }
  }, []);

  const loadContributions = useCallback(async () => {
    try {
      const res = await api.get("/contributions");
      const fromApi = Array.isArray(res.data?.contributions)
        ? res.data.contributions
        : [];
      const normalized = fromApi.map((c) => ({
        ...c,
        image: c.image || c.coverImage || (Array.isArray(c.images) ? c.images[0] : undefined),
        comments: Array.isArray(c.replies) ? c.replies.length : c.comments,
        votes: typeof c.votes === "number" ? c.votes : 0,
      }));
      setContributions(normalized);
      setContributionError(null);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Unable to load contributions.";
      console.error("Error fetching contributions:", message);
      setContributionError(message);
      setContributions(CONTRIBUTIONS);
    } finally {
      setContributionsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites, loadContributions]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites, loadContributions])
  );

  useEffect(() => {
    if (activeTab === "contributions" && !contributionsLoaded) {
      loadContributions();
    }
  }, [activeTab, contributionsLoaded, loadContributions]);

  const normalizeTag = useCallback((value) => {
    return typeof value === "string"
      ? value.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "";
  }, []);

  const contributionsFiltered = useMemo(() => {
    const tagsSelected = {
      location: (activeFilters.location || []).map(normalizeTag),
      deals: (activeFilters.deals || []).map(normalizeTag),
      dietary: (activeFilters.dietary || []).map(normalizeTag),
      foodType: (activeFilters.foodType || []).map(normalizeTag),
      date: Array.isArray(activeFilters.date)
        ? activeFilters.date.map(normalizeTag)
        : activeFilters.date
        ? [normalizeTag(activeFilters.date)]
        : [],
    };

    const hasSelections = Object.values(tagsSelected).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );

    const matchAny = (contributionTags = [], selectedList = []) => {
      if (!selectedList.length) return true;
      const tagSet = contributionTags.map(normalizeTag);
      return selectedList.some((sel) => tagSet.includes(sel));
    };

    return contributionsWithCoordinates.filter((c) => {
      const id =
        (c._id && c._id.toString ? c._id.toString() : c._id) || c.id;
      if (activeFilters.favoritesOnly && (!id || !favoriteContributionIds.has(id))) {
        return false;
      }

      if (!hasSelections) return true;
      const tags = Array.isArray(c.tags) ? c.tags : [];
      return (
        matchAny(tags, tagsSelected.location) &&
        matchAny(tags, tagsSelected.deals) &&
        matchAny(tags, tagsSelected.dietary) &&
        matchAny(tags, tagsSelected.foodType) &&
        matchAny(tags, tagsSelected.date)
      );
    });
  }, [activeFilters, contributionsWithCoordinates, favoriteContributionIds, normalizeTag]);

  const restaurantsFiltered = useMemo(() => {
    if (!activeFilters.favoritesOnly) {
      return filtered;
    }
    return filtered.filter((item) => {
      const placeId = item.place_id || item.id || item.name;
      return placeId && favoriteRestaurantIds.has(placeId);
    });
  }, [activeFilters.favoritesOnly, favoriteRestaurantIds, filtered]);

  const mapItems = useMemo(
    () =>
      activeTab === "restaurants"
        ? restaurantsFiltered.filter((r) => {
            const hasLat =
              r?.geometry?.location?.lat !== undefined ||
              r?.geometry?.location?.latitude !== undefined;
            const hasLng =
              r?.geometry?.location?.lng !== undefined ||
              r?.geometry?.location?.longitude !== undefined;
            return hasLat && hasLng;
          })
        : contributionsFiltered.filter((c) => {
            if (!activeFilters.favoritesOnly) return true;
            const cid =
              (c._id && c._id.toString ? c._id.toString() : c._id) ||
              c.id ||
              c.name;
            return cid && favoriteContributionIds.has(cid);
          }),
    [
      activeTab,
      restaurantsFiltered,
      contributionsFiltered,
      activeFilters.favoritesOnly,
      favoriteContributionIds,
    ]
  );

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
    return Math.max(base - 24, 0);
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
    if (!mapItems.length) {
      return null;
    }

    return mapItems
      .map((item) => {
        const id = item._id || item.id || item.place_id || item.name;
        const lat = item?.geometry?.location?.lat;
        const lng = item?.geometry?.location?.lng;
        return `${id ?? "unknown"}:${lat ?? "?"},${lng ?? "?"}`;
      })
      .join("|");
  }, [mapItems]);

  useEffect(() => {
    if (fitSignature === null || !mapRef.current) {
      return;
    }

    if (lastFitSignatureRef.current === fitSignature) {
      return;
    }

    const coordinates = mapItems
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
  }, [fitSignature, mapItems, mapMode, mapEdgePadding]);

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
    setSelectedContribution(null);
    setSelectedId(null);
  }, [setSelectedId, setSelectedRestaurant, setViewMode]);

  const handleCollapseSheet = useCallback(() => {
    resetSelection();
    animateSheetTo(maxTranslate);
  }, [animateSheetTo, maxTranslate, resetSelection]);

  const handleReturnToList = useCallback(() => {
    setViewMode("list");
    setSelectedRestaurant(null);
    setSelectedContribution(null);
    const target = Math.max(maxTranslate - 180, 0);
      animateSheetTo(target);
  }, [animateSheetTo, maxTranslate, setSelectedRestaurant, setViewMode]);

  const toggleFavoritesFilter = useCallback(() => {
    setActiveFilters((prev) => ({
      ...prev,
      favoritesOnly: !prev.favoritesOnly,
    }));
    setViewMode("list");
  }, []);

  const toggleFavorite = useCallback(
    async (item) => {
      if (!item) return;
      if (!api.defaults.headers.common.Authorization) {
        Alert.alert("Login required", "Please log in to save favorites.");
        return;
      }

      const isRestaurant =
        item.place_id || item.geometry || item.distance_value !== undefined;
      const id =
        (item._id && item._id.toString ? item._id.toString() : item._id) ||
        item.id ||
        item.place_id ||
        item.name;
      if (!id) return;

      if (isRestaurant) {
        const placeId = item.place_id || item.id || item.name || id;
        const prev = new Set(favoriteRestaurantIds);
        const isFav = prev.has(placeId);

        setFavoriteRestaurantIds((current) => {
          const next = new Set(current);
          if (next.has(placeId)) {
            next.delete(placeId);
          } else {
            next.add(placeId);
          }
          return next;
        });

        // update restaurant list vote display if needed (no-op currently)

        try {
          if (isFav) {
            await api.delete(
              `/auth/me/favorites/${encodeURIComponent(placeId)}`
            );
          } else {
            await api.post("/auth/me/favorites", {
              place_id: placeId,
              name: item.name,
              address: item.address,
              rating: item.rating,
            });
          }
        } catch (error) {
          console.error("Error toggling restaurant favorite:", error.message);
          setFavoriteRestaurantIds(prev);
        }
      } else {
        const prev = new Set(favoriteContributionIds);
        const isFav = prev.has(id);

        setFavoriteContributionIds((current) => {
          const next = new Set(current);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });

        try {
          if (isFav) {
            await api.delete(
              `/auth/me/favorites/contributions/${encodeURIComponent(id)}`
            );
          } else {
            await api.post(
              `/auth/me/favorites/contributions/${encodeURIComponent(id)}`
            );
          }
        } catch (error) {
          console.error("Error toggling contribution favorite:", error.message);
          setFavoriteContributionIds(prev);
        }
      }
    },
    [favoriteContributionIds, favoriteRestaurantIds]
  );

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
        typeof restaurant?.name === "string" &&
        restaurant.name.trim().length > 0
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
            placeId
              ? `&destination_place_id=${encodeURIComponent(placeId)}`
              : ""
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
              const geoCoordUrl = `geo:${lat},${lng}?q=${encodeURIComponent(
                name
              )}`;
              await Linking.openURL(geoCoordUrl);
              return;
            }

            if (addressText) {
              const geoAddressUrl = `geo:0,0?q=${encodeURIComponent(
                addressText
              )}`;
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
  const selectedContributionFavorite = selectedContribution
    ? favoriteContributionIds.has(
        (selectedContribution._id && selectedContribution._id.toString
          ? selectedContribution._id.toString()
          : selectedContribution._id) ||
          selectedContribution.id ||
          selectedContribution.name
      )
    : false;
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
      if (activeTab === "contributions") {
        const contribId =
          (item._id && item._id.toString ? item._id.toString() : item._id) ||
          item.id ||
          item.name;
        return (
          <ContributionCard
            item={item}
            favorite={contribId ? favoriteContributionIds.has(contribId) : false}
            onPress={() => {
              const nextId =
                (item._id && item._id.toString ? item._id.toString() : item._id) ||
                item.id ||
                item.name;
              setSelectedId(nextId);
              setSelectedContribution(item);
              setViewMode("contribution-detail");
              animateSheetTo(0);
            }}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        );
      }

      const id =
        (item._id && item._id.toString ? item._id.toString() : item._id) ||
        item.id ||
        item.place_id ||
        item.name;
      const placeId = item.place_id || item.id || item.name;
      return (
        <RestaurantCard
          item={item}
          selected={id === selectedId}
          favorite={placeId ? favoriteRestaurantIds.has(placeId) : false}
          onPress={() => handleSelectRestaurant(item, { openDetail: true })}
          onToggleFavorite={() => toggleFavorite(item)}
        />
      );
    },
    [
      activeTab,
      favoriteContributionIds,
      favoriteRestaurantIds,
      handleSelectRestaurant,
      selectedId,
      toggleFavorite,
      animateSheetTo,
    ]
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
            restaurants={mapItems}
            selectedId={selectedId}
            onSelect={(item) => {
              if (activeTab === "restaurants") {
                handleSelectRestaurant(item, { openDetail: true });
              } else {
                setSelectedContribution(item);
                const nextId =
                  (item._id && item._id.toString
                    ? item._id.toString()
                    : item._id) ||
                  item.id ||
                  item.name;
                setSelectedId(nextId);
                setViewMode("contribution-detail");
                animateSheetTo(0);
              }
            }}
            onNavigate={activeTab === "restaurants" ? confirmNavigate : undefined}
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
                    <Ionicons name="chevron-back" size={20} color="#000000" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle} numberOfLines={1}>
                    {selectedRestaurant?.name || "Details"}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCollapseSheet} hitSlop={12}>
                  <Ionicons name="close" size={20} color="#000000" />
                </TouchableOpacity>
              </View>
              {selectedRestaurant ? (
                <RestaurantDetail
                  restaurant={selectedRestaurant}
                  favorite={
                    selectedId ? favoriteRestaurantIds.has(selectedId) : false
                  }
                  onToggleFavorite={() => toggleFavorite(selectedRestaurant)}
                  onGetDirections={() => confirmNavigate(selectedRestaurant)}
                />
              ) : null}
            </>
          ) : viewMode === "contribution-detail" && selectedContribution ? (
            <>
              <View style={styles.sheetHeader} {...panResponder.panHandlers}>
                <View style={styles.detailHeaderRow}>
                  <TouchableOpacity
                    onPress={handleReturnToList}
                    hitSlop={12}
                    style={styles.detailHeaderButton}
                  >
                    <Ionicons name="chevron-back" size={20} color="#000000" />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle} numberOfLines={1}>
                    {selectedContribution?.title || "Details"}
                  </Text>
                </View>
                <View style={styles.detailHeaderActions}>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(selectedContribution)}
                    hitSlop={12}
                    style={styles.detailHeaderButton}
                  >
                    <Ionicons
                      name={
                        selectedContributionFavorite ? "heart" : "heart-outline"
                      }
                      size={20}
                      color={selectedContributionFavorite ? "#8AB644" : "#000000"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCollapseSheet} hitSlop={12}>
                    <Ionicons name="close" size={20} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
              <ContributionDetail
                item={selectedContribution}
                related={contributionsWithCoordinates.filter(
                  (c) =>
                    (c._id || c.id) !==
                    (selectedContribution._id || selectedContribution.id)
                )}
                contributions={contributionsWithCoordinates}
                onPressRSVP={() => setRsvpVisible(true)}
                favorite={selectedContributionFavorite}
                onToggleFavorite={() => toggleFavorite(selectedContribution)}
                onSelectContribution={(next) => {
                  setSelectedContribution(next);
                  setSelectedId(next.id || next._id || next.name);
                  setViewMode("contribution-detail");
                  animateSheetTo(0);
                }}
              />
            </>
          ) : (
            <>
              <View style={styles.sheetHeader} {...panResponder.panHandlers}>
                <View>
                  <Text style={styles.sheetTitle}>Search Results</Text>
                  <Text style={styles.sheetSubtitle}>
                    {activeTab === "restaurants"
                      ? `${restaurantsFiltered.length} place${restaurantsFiltered.length === 1 ? "" : "s"} nearby`
                      : `${contributionsFiltered.length} contribution${contributionsFiltered.length === 1 ? "" : "s"}`}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleCollapseSheet} hitSlop={12}>
                  <Ionicons name="close" size={20} color="#000000" />
                </TouchableOpacity>
              </View>

              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "restaurants" && styles.tabButtonActive,
                  ]}
                  onPress={() => setActiveTab("restaurants")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "restaurants" && styles.tabTextActive,
                    ]}
                  >
                    Restaurants
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "contributions" && styles.tabButtonActive,
                  ]}
                  onPress={() => setActiveTab("contributions")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "contributions" && styles.tabTextActive,
                    ]}
                  >
                    Contributions
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={
                  activeTab === "restaurants"
                    ? restaurantsFiltered
                    : contributionsFiltered
                }
                keyExtractor={(item) =>
                  activeTab === "restaurants"
                    ? item._id || item.id || item.place_id || item.name
                    : item._id || item.id
                }
                extraData={
                  activeTab === "restaurants"
                    ? favoriteRestaurantIds
                    : favoriteContributionIds
                }
                contentContainerStyle={styles.resultsContent}
                ItemSeparatorComponent={() => (
                  <View style={styles.cardSpacer} />
                )}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    {activeTab === "restaurants"
                      ? "We could not find any places that match your filters yet."
                      : "No contributions match your filters right now."}
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
          <Ionicons name="search" size={16} color="#000000" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Find deals"
            placeholderTextColor="#8C8C8C"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={16} color="#8C8C8C" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFiltersVisible(true)}
            hitSlop={{ top: 12, left: 12, bottom: 12, right: 12 }}
          >
            <Ionicons name="options-outline" size={18} color="#000000" />
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{errorMessage}</Text>
          </View>
        ) : null}
        <View style={styles.favoritesRow}>
          <TouchableOpacity
            style={[
              styles.favoritesPill,
              activeFilters.favoritesOnly && styles.favoritesPillActive,
            ]}
            onPress={toggleFavoritesFilter}
            activeOpacity={0.85}
          >
            <Ionicons
              name={activeFilters.favoritesOnly ? "heart" : "heart-outline"}
              size={16}
              color={activeFilters.favoritesOnly ? "#ffffff" : "#8C8C8C"}
            />
            <Text
              style={[
                styles.favoritesText,
                activeFilters.favoritesOnly && styles.favoritesTextActive,
              ]}
            >
              Favorites only
            </Text>
          </TouchableOpacity>
          {contributionError ? (
            <Text style={styles.favoritesErrorText} numberOfLines={1}>
              {contributionError}
            </Text>
          ) : null}
        </View>
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
              filters={FILTER_OPTIONS}
              activeFilters={activeFilters}
              onUpdateFilters={onUpdateFilters}
              onClose={onClose}
              onApply={onApply}
              onReset={onReset}
            />
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={rsvpVisible}
        onRequestClose={() => setRsvpVisible(false)}
      >
        <View style={styles.rsvpOverlay}>
          <View style={styles.rsvpCard}>
            <View style={styles.rsvpHeader}>
              <View>
                <Text style={styles.rsvpTitle}>{selectedContribution?.title}</Text>
                <Text style={styles.rsvpSub}>{selectedContribution?.time}</Text>
              </View>
              <TouchableOpacity onPress={() => setRsvpVisible(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.rsvpBox}>
              <Text style={styles.rsvpBoxText}>Free Admission</Text>
            </View>

            <Text style={styles.rsvpSectionLabel}>Contact Information</Text>
            <View style={styles.rsvpInputsRow}>
              <TextInput
                style={[styles.rsvpInput, { marginRight: 8 }]}
                placeholder="First name*"
                value={rsvpForm.first}
                onChangeText={(t) => setRsvpForm((p) => ({ ...p, first: t }))}
              />
              <TextInput
                style={[styles.rsvpInput, { marginLeft: 8 }]}
                placeholder="Last name*"
                value={rsvpForm.last}
                onChangeText={(t) => setRsvpForm((p) => ({ ...p, last: t }))}
              />
            </View>
            <TextInput
              style={[styles.rsvpInput, styles.rsvpInputFull]}
              placeholder="Email address*"
              keyboardType="email-address"
              autoCapitalize="none"
              value={rsvpForm.email}
              onChangeText={(t) => setRsvpForm((p) => ({ ...p, email: t }))}
            />

            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 12 }]}
              activeOpacity={0.9}
              onPress={() => {
                setRsvpVisible(false);
                setRsvpThankYou(true);
                animateSheetTo(maxTranslate);
                setViewMode("list");
              }}
            >
              <Text style={styles.primaryButtonText}>RSVP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={rsvpThankYou}
        onRequestClose={() => setRsvpThankYou(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRsvpThankYou(false)}>
          <View style={styles.thankOverlay}>
            <View style={styles.thankCard}>
              <TouchableOpacity
                style={styles.thankClose}
                onPress={() => setRsvpThankYou(false)}
                hitSlop={12}
              >
                <Ionicons name="close" size={18} color="#000000" />
              </TouchableOpacity>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1589985270826-4c08f2f3c4d8?auto=format&fit=crop&w=300&q=80",
                }}
                style={styles.thankImage}
              />
              <Text style={styles.thankText}>Thank you for reserving!</Text>
              <Text style={styles.thankSub}>We’ll notify you soon with more details.</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const ContributionCard = ({ item, favorite, onPress, onToggleFavorite }) => (
  <Pressable style={styles.contributionCard} onPress={onPress}>
    <View style={styles.contributionImageWrap}>
      <TouchableOpacity
        style={[
          styles.contributionFavorite,
          favorite && styles.contributionFavoriteOn,
        ]}
        onPress={(e) => {
          e.stopPropagation?.();
          onToggleFavorite?.();
        }}
        hitSlop={12}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={18}
          color={favorite ? "#FF3B30" : "#0F172A"}
        />
      </TouchableOpacity>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.contributionImage} />
      ) : (
        <View style={styles.contributionImagePlaceholder}>
          <Ionicons name="image-outline" size={24} color="#94A3B8" />
        </View>
      )}
      {item.tags?.length ? (
        <View style={styles.contributionImageOverlay}>
          <Text style={styles.contributionTag}>{item.tags?.[0] || "Deal"}</Text>
        </View>
      ) : null}
    </View>
    <View style={styles.contributionBody}>
      <Text style={styles.contributionTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.cardMetaRow}>
        <View style={styles.metaChip}>
          <Ionicons name="time-outline" size={14} color="#475569" />
          <Text style={styles.metaChipText}>{item.time || "Time TBA"}</Text>
        </View>
        <View style={styles.metaChip}>
          <Ionicons name="navigate-outline" size={14} color="#475569" />
          <Text style={styles.metaChipText}>
            {item.distance_text || item.distance || "—"}
          </Text>
        </View>
      </View>
      <View style={styles.contributionStats}>
        <View style={styles.statRow}>
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={14}
            color={favorite ? "#FF3B30" : "#0F172A"}
          />
          <Text style={styles.statText}>{item.votes ?? 0}</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={14} color="#475569" />
          <Text style={styles.statText}>
            {Array.isArray(item.replies) ? item.replies.length : item.comments ?? 0}
          </Text>
        </View>
      </View>
      <View style={styles.contributionTagsRow}>
        {(item.tags || []).map((tag) => (
          <View key={tag} style={styles.contributionTagPill}>
            <Text style={styles.contributionTagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  </Pressable>
);

const ContributionDetail = ({
  item,
  related,
  contributions,
  onPressRSVP,
  onSelectContribution,
  favorite,
  onToggleFavorite,
}) => {
  const gallery = Array.isArray(item?.images) && item.images.length > 0
    ? item.images
    : item.image
    ? [item.image]
    : [];

  const moreForYou = useMemo(() => {
    const list = Array.isArray(contributions) && contributions.length > 0
      ? contributions
      : related || [];

    if (!list.length) return [];

    const idx = list.findIndex((c) => c.id === item.id);
    const nextIndex = idx >= 0 ? idx + 1 : 0;
    const wrappedIndex = nextIndex < list.length ? nextIndex : 0;
    const candidate = list[wrappedIndex];
    return candidate ? [candidate] : [];
  }, [contributions, related, item]);

  return (
    <ScrollView
      style={styles.detailScroll}
      contentContainerStyle={styles.detailContent}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.contribHero}
      >
        {gallery.length === 0 ? (
          <View style={[styles.contribHero, styles.contributionImagePlaceholder]}>
            <Ionicons name="image-outline" size={28} color="#94A3B8" />
          </View>
        ) : (
          gallery.map((uri, idx) => (
            <Image
              key={`${uri}-${idx}`}
              source={{ uri }}
              style={styles.contribHeroImage}
            />
          ))
        )}
      </ScrollView>

      <Text style={styles.contribTitle}>{item?.title}</Text>
      <Text style={styles.contribMeta}>{item?.time}</Text>
      {item?.host ? (
        <Text style={styles.contribMeta}>Host by {item.host}</Text>
      ) : null}
      <View style={styles.contribTagsRow}>
        {(item?.tags || []).map((tag) => (
          <View key={tag} style={styles.contribTagPill}>
            <Text style={styles.contribTagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {item?.address ? (
        <View style={styles.contribMapBlock}>
          <Image
            source={{
              uri:
                item.mapPreview ||
                "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
            }}
            style={styles.contribMapImage}
          />
          <View style={styles.contribAddressRow}>
            <Ionicons name="location-outline" size={18} color="#000000" />
            <Text style={styles.contribAddress}>{item.address}</Text>
            {item.distance ? (
              <Text style={styles.contribDistance}>{item.distance}</Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {item?.description ? (
        <Text style={styles.contribDescription}>{item.description}</Text>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        {Array.isArray(item?.menu) && item.menu.length > 0 ? (
          <View style={styles.menuList}>
            {item.menu.map((entry, idx) => (
              <View key={entry.title || `menu-${idx}`} style={styles.menuListBlock}>
                <Text style={styles.menuTitle}>{entry.title}</Text>
                {(entry.items || []).map((m, i2) => (
                  <Text key={`${m}-${i2}`} style={styles.menuItem}>• {m}</Text>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.menuItem}>Menu not available.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergies</Text>
        <View style={styles.contribPillGrid}>
          {(item?.allergies || ["Vegan", "Contains Soy", "Contains Wheat"]).map(
            (label) => (
              <View key={label} style={styles.contribPill}>
                <View style={styles.contribBullet} />
                <Text style={styles.contribPillText}>{label}</Text>
              </View>
            )
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility</Text>
        <View style={styles.contribPillGrid}>
          {(item?.accessibility || ["Wheelchair accessible", "Accessible parking near entrance"]).map(
            (label) => (
              <View key={label} style={styles.contribPill}>
                <View style={[styles.contribBullet, { backgroundColor: "#8AB644" }]} />
                <Text style={styles.contribPillText}>{label}</Text>
              </View>
            )
          )}
        </View>
      </View>

      {moreForYou.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More for You</Text>
          <ContributionCard
            item={moreForYou[0]}
            onPress={() => onSelectContribution?.(moreForYou[0])}
          />
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.secondaryButton, favorite && styles.secondaryButtonOn]}
        activeOpacity={0.9}
        onPress={onToggleFavorite}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={16}
          color={favorite ? "#FFFFFF" : "#0F172A"}
        />
        <Text
          style={[
            styles.secondaryButtonText,
            favorite && styles.secondaryButtonTextOn,
          ]}
        >
          {favorite ? "Saved to favorites" : "Save to favorites"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryButton, { marginTop: 8 }]}
        activeOpacity={0.9}
        onPress={onPressRSVP}
      >
        <Text style={styles.primaryButtonText}>RSVP</Text>
      </TouchableOpacity>
    </ScrollView>
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
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  secondaryButtonOn: {
    backgroundColor: "#8AB644",
    borderColor: "#8AB644",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  secondaryButtonTextOn: {
    color: "#FFFFFF",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 0,
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
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#8C8C8C",
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#8AB644",
    backgroundColor: "rgba(138, 182, 68, 0.15)",
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
  favoritesRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  favoritesPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#8C8C8C",
    backgroundColor: "#FFFFFF",
  },
  favoritesPillActive: {
    backgroundColor: "#8AB644",
    borderColor: "#8AB644",
  },
  favoritesText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  favoritesTextActive: {
    color: "#FFFFFF",
  },
  favoritesErrorText: {
    flex: 1,
    fontSize: 12,
    color: "#B91C1C",
    fontWeight: "600",
  },
  resultsSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  sheetHandleArea: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },
  sheetHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#8C8C8C",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  detailHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeaderTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 4,
  },
  cardSpacer: {
    height: 12,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#8AB644",
  },
  tabText: {
    fontWeight: "700",
    color: "#475569",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  contributionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  contributionImageWrap: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  contributionImage: {
    width: "100%",
    height: "100%",
  },
  contributionFavorite: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 3,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  contributionFavoriteOn: {
    backgroundColor: "#8AB644",
  },
  contributionImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
  },
  contributionImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 6,
    alignItems: "flex-start",
  },
  contributionImageSpacer: {
    flex: 1,
  },
  contributionTag: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: "700",
  },
  contributionBody: {
    padding: 14,
    gap: 6,
  },
  contributionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  contributionMeta: {
    fontSize: 12,
    color: "#475569",
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  metaChipText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },
  contributionStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "700",
  },
  contributionTagsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 6,
  },
  contributionTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#E2F3D8",
    borderRadius: 999,
  },
  contributionTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4A7C10",
  },
  contribMapBlock: {
    marginTop: 12,
    gap: 10,
  },
  contribMapPlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  contribMapImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
  },
  contribHero: {
    width: "100%",
    height: 220,
  },
  contribHeroImage: {
    width: 320,
    height: 220,
    resizeMode: "cover",
  },
  contribTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  contribMeta: {
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
  },
  contribTagsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10,
  },
  contribTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#E2F3D8",
    borderRadius: 999,
  },
  contribTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A7C10",
  },
  contribAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  contribAddress: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
  },
  contribDistance: {
    fontSize: 12,
    color: "#475569",
  },
  contribDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#0F172A",
    marginTop: 12,
  },
  menuListBlock: {
    marginBottom: 8,
  },
  contribPillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  contribPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  contribBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0EA5E9",
  },
  contribPillText: {
    fontSize: 13,
    color: "#0F172A",
  },
  rsvpOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  rsvpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  rsvpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rsvpTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  rsvpSub: {
    fontSize: 13,
    color: "#475569",
    marginTop: 2,
  },
  rsvpBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    backgroundColor: "#F8FAFC",
  },
  rsvpBoxText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
  },
  rsvpSectionLabel: {
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
  },
  rsvpInputsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  rsvpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  rsvpInputFull: {
    width: "100%",
    flex: undefined,
  },
  thankOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  thankCard: {
    width: 260,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
    gap: 8,
  },
  thankClose: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  thankImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFE4E6",
  },
  thankText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  thankSub: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
  },
  detailScroll: {
    flex: 1,
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
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
    height: "90%",
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },
});

export default MapScreen;

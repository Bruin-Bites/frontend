import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../components/FilterModal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Colors ---
const BRAND_GREEN = '#A8B84C';
const LIGHT_YELLOW = '#FEF9E6';
const DARK_GRAY = '#333333';
const MEDIUM_GRAY = '#666666';
const LIGHT_GRAY = '#F0F0F0';
const BORDER_GRAY = '#E8E8E8';

// --- Mock Data ---
const MOCK_RECOMMENDATIONS = [
  {
    id: 'rec1',
    title: 'Saturday Brunch',
    date: 'October 17, 2025',
    time: '12:00PM - 1:30PM',
    distance: '0.5 mi',
    tags: ['Deal type', 'Food type', 'Location type'],
    likes: 13,
    comments: 3,
    image: 'https://placehold.co/600x400/FAD7A0/8A2E0E?text=Brunch',
    tagType: 'FREE',
  },
  {
    id: 'rec2',
    title: 'Taco Tuesday',
    date: 'October 21, 2025',
    time: '5:00PM - 9:00PM',
    distance: '4.2 mi',
    tags: ['Deal type', 'Food type'],
    likes: 42,
    comments: 7,
    image: 'https://placehold.co/600x400/82E0AA/2E86C1?text=Tacos',
    tagType: '$5',
  },
];

const MOCK_EVENTS = [
  {
    id: 'evt1',
    title: 'Free Matcha',
    date: 'October 17, 2025',
    time: '12:00PM - 1:30PM',
    distance: '0.8 mi',
    tags: ['Deal type', 'Food type', 'Location type'],
    likes: 13,
    comments: 3,
    image: 'https://placehold.co/600x400/ABEBC6/196F3D?text=Matcha',
    tagType: 'FREE',
  },
];

const MOCK_TRENDING = [
  {
    id: 'trd1',
    title: '$5 Poke Bowls',
    date: 'October 17, 2025',
    time: '12:00PM - 1:30PM',
    distance: '6.0 mi',
    tags: ['Deal type', 'Food type', 'Contains fish'],
    likes: 13,
    comments: 3,
    image: 'https://placehold.co/600x400/FADBD8/884EA0?text=Poke',
    tagType: '$5',
  },
];

const MOCK_CLOSEST_TO_YOU = [
  {
    id: 'cls1',
    title: '10% Off Smoothies',
    date: 'October 17, 2025',
    time: '12:00PM - 1:30PM',
    distance: '0.2 mi',
    tags: ['Deal type', 'Food type', 'Location type'],
    likes: 13,
    comments: 3,
    image: 'https://placehold.co/600x400/D7BDE2/5B2C6F?text=Smoothies',
    tagType: '10% OFF',
  },
];

// --- Search Mock Data ---
const RECENT_SEARCHES = [
  { id: 'r1', text: 'Acai bowls' },
  { id: 'r2', text: 'Coffee' },
  { id: 'r3', text: 'Sandwiches' },
];

const TRENDING_SEARCHES = [
  { id: 't1', text: '$5 Sandwich at Kerckoff' },
  { id: 't2', text: 'BOGO Malatang Deal' },
  { id: 't3', text: 'Sharetea' },
];

// --- Post Card Component (Standard Horizontal) ---
const PostCard = ({ item, favoriteIds, onFavoriteChange }) => {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(
    favoriteIds?.has(item._id || item.id) || Boolean(item.favorite)
  );
  const [likeCount, setLikeCount] = useState(item.likes);

  useEffect(() => {
    const id = item._id || item.id;
    if (id && favoriteIds) {
      setIsLiked(favoriteIds.has(id));
    }
  }, [favoriteIds, item]);

  const toggleLike = async () => {
    const id = item._id || item.id;
    if (!id) return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(prev - 1, 0)));
    onFavoriteChange?.(id, nextLiked);
    try {
      if (nextLiked) {
        await api.post(`/auth/me/favorites/contributions/${encodeURIComponent(id)}`);
      } else {
        await api.delete(`/auth/me/favorites/contributions/${encodeURIComponent(id)}`);
      }
    } catch (err) {
      // revert on error
      const revert = !nextLiked;
      setIsLiked(revert);
      setLikeCount((prev) => (revert ? prev + 1 : Math.max(prev - 1, 0)));
      onFavoriteChange?.(id, revert);
    }
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('EventDetails', { item })}
      style={({ pressed }) => [
        styles.cardContainer,
        { opacity: pressed ? 0.9 : 1 },
        Platform.OS === 'web' && { cursor: 'pointer' } // Adds the hand cursor on desktop
      ]}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.cardTag, { backgroundColor: BRAND_GREEN }]}>
          <Text style={styles.cardTagText}>{item.tagType || 'DEAL'}</Text>
        </View>
        
        {/* Heart Button */}
        <Pressable 
          style={styles.cardHeart} 
          onPress={(e) => {
            // e.stopPropagation() helps prevent clicking the card when clicking the heart
            if (Platform.OS === 'web') e.stopPropagation(); 
            toggleLike();
          }}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#FF4500' : 'white'}
          />
        </Pressable>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardInfo}>
          {item.date} | {item.time}
        </Text>
        
        <View style={styles.cardTagsContainer}>
          {item.tags?.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.cardTagPill}>
              <Text style={styles.cardTagPillText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardDistance}>{item.distance}</Text>
          <View style={styles.cardStats}>
            <Ionicons
              name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={16}
              color={isLiked ? BRAND_GREEN : MEDIUM_GRAY}
            />
            <Text style={[styles.cardStatsText, isLiked && { color: BRAND_GREEN }]}>
              {likeCount}
            </Text>
            <Ionicons name="chatbubble-outline" size={16} color={MEDIUM_GRAY} />
            <Text style={styles.cardStatsText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// --- Wide Post Card (For Search Results) ---
const WidePostCard = ({ item }) => {
  return (
    <View style={styles.wideCardContainer}>
      <View style={styles.wideCardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.cardTag, { backgroundColor: BRAND_GREEN }]}>
          <Text style={styles.cardTagText}>{item.tagType || 'DEAL'}</Text>
        </View>
        <TouchableOpacity style={styles.cardHeart}>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardInfo}>
          {item.date} | {item.time}
        </Text>
        
        <View style={styles.cardTagsContainer}>
          {item.tags?.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.cardTagPill}>
              <Text style={styles.cardTagPillText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardDistance}>{item.distance}</Text>
          <View style={styles.cardStats}>
            <Ionicons name="thumbs-up-outline" size={16} color={MEDIUM_GRAY} />
            <Text style={styles.cardStatsText}>{item.likes}</Text>
            <Ionicons name="chatbubble-outline" size={16} color={MEDIUM_GRAY} />
            <Text style={styles.cardStatsText}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function CommunityScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [recommendations, setRecommendations] = useState([]);
  const [events, setEvents] = useState([]);
  const [trending, setTrending] = useState([]);
  const [closest, setClosest] = useState([]);

  const [displayRecs, setDisplayRecs] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [displayTrending, setDisplayTrending] = useState([]);
  const [displayClosest, setDisplayClosest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteContributionIds, setFavoriteContributionIds] = useState(new Set());
  const favoriteIdsRef = useRef(new Set());

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const contributionToCard = useCallback((item) => {
    const dateString = item?.date
      ? new Date(item.date).toLocaleDateString('en-US')
      : 'Date TBA';
    return {
      id: item._id || item.id || Date.now().toString(),
      title: item.title,
      date: dateString,
      time: item.time || 'All Day',
      distance: '0.0 mi',
      tags: Array.isArray(item.tags) ? item.tags : [],
      likes: item.votes || 0,
      comments: Array.isArray(item.replies) ? item.replies.length : 0,
      image: item.coverImage || item.images?.[0] || 'https://placehold.co/600x400/cccccc/333333?text=Contribution',
      images: Array.isArray(item.images) ? item.images : item.coverImage ? [item.coverImage] : [],
      description: item.description || '',
      location: item.location || item.address || '',
      address: item.address || item.location || '',
      menuItems: Array.isArray(item.menu) ? item.menu : [],
      menuList: Array.isArray(item.menu) ? item.menu.flatMap((m) => m.items || []) : [],
      allergies: Array.isArray(item.allergies) ? item.allergies : [],
      accessibility: Array.isArray(item.accessibility) ? item.accessibility : [],
      hostName: item.author || item.host || 'Community Member',
      hostContributions: Array.isArray(item.contributions) ? item.contributions.length : 1,
      tagType: Array.isArray(item.tags) && item.tags.length ? item.tags[0] : 'DEAL',
    };
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const res = await api.get('/auth/me/favorites');
      const contributionList = Array.isArray(res.data?.favoriteContributions)
        ? res.data.favoriteContributions
        : [];
      const ids = new Set(
        contributionList
          .map((fav) =>
            typeof fav === 'string'
              ? fav
              : fav?._id?.toString?.() || fav?.id || null
          )
          .filter(Boolean)
      );
      favoriteIdsRef.current = ids;
      setFavoriteContributionIds(ids);
      return ids;
    } catch (err) {
      favoriteIdsRef.current = new Set();
      setFavoriteContributionIds(new Set());
      return new Set();
    }
  }, []);

  const loadContributions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contributions');
      const list = Array.isArray(res.data?.contributions)
        ? res.data.contributions
        : [];
      const cards = list.map((c) => {
        const mapped = contributionToCard(c);
        const id = mapped.id;
        return {
          ...mapped,
          favorite: id ? favoriteIdsRef.current.has(id) : false,
        };
      });
      setRecommendations(cards);
      setEvents(cards);
      setTrending(cards);
      setClosest(cards);
      setDisplayRecs(cards);
      setDisplayEvents(cards);
      setDisplayTrending(cards);
      setDisplayClosest(cards);
      setError(null);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Unable to load contributions.';
      setError(message);
      setRecommendations(MOCK_RECOMMENDATIONS);
      setEvents(MOCK_EVENTS);
      setTrending(MOCK_TRENDING);
      setClosest(MOCK_CLOSEST_TO_YOU);
      setDisplayRecs(MOCK_RECOMMENDATIONS);
      setDisplayEvents(MOCK_EVENTS);
      setDisplayTrending(MOCK_TRENDING);
      setDisplayClosest(MOCK_CLOSEST_TO_YOU);
    } finally {
      setLoading(false);
    }
  }, [contributionToCard]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const favs = await loadFavorites();
        if (!active) return;
        favoriteIdsRef.current = favs;
        await loadContributions();
      })();
      return () => {
        active = false;
      };
    }, [loadContributions, loadFavorites])
  );

  useEffect(() => {
    if (route.params?.newPost) {
      loadContributions();
      navigation.setParams({ newPost: null });
    }
  }, [route.params?.newPost, navigation, loadContributions]);

  const applyFilters = (filters) => {
    const filterList = (list) => {
      return list.filter(item => {
        const itemDist = parseFloat(item.distance.split(' ')[0]);
        if (itemDist < filters.minDist || itemDist > filters.maxDist) return false;
        if (filters.dietary.length > 0) {
          const hasDietaryMatch = item.tags.some(tag => filters.dietary.includes(tag));
          if (!hasDietaryMatch) return false;
        }
        return true;
      });
    };
    setDisplayRecs(filterList(recommendations));
    setDisplayEvents(filterList(events));
    setDisplayTrending(filterList(trending));
    setDisplayClosest(filterList(closest));
  };

  const handleBackSearch = () => {
    setIsSearchFocused(false);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  // --- RENDER: Search Mode Content ---
  const renderSearchContent = () => (
    <View style={styles.searchContentContainer}>
      {/* Recent Section */}
      <Text style={styles.searchSectionHeader}>Recent</Text>
      <View style={styles.searchList}>
        {RECENT_SEARCHES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.searchRow}>
            <View style={styles.searchRowLeft}>
              <Ionicons name="time-outline" size={22} color={DARK_GRAY} style={{ marginRight: 12 }} />
              <Text style={styles.searchRowText}>{item.text}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close" size={20} color={DARK_GRAY} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trending Section */}
      <Text style={styles.searchSectionHeader}>Trending</Text>
      <View style={styles.searchList}>
        {TRENDING_SEARCHES.map((item) => (
          <TouchableOpacity key={item.id} style={styles.searchRow}>
            <View style={styles.searchRowLeft}>
              <Ionicons name="search-outline" size={22} color={DARK_GRAY} style={{ marginRight: 12 }} />
              <Text style={styles.searchRowText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommended Section */}
      <Text style={styles.searchSectionHeader}>Recommended</Text>
      <View style={{ paddingHorizontal: 20 }}>
        <WidePostCard item={MOCK_RECOMMENDATIONS[0]} />
      </View>
    </View>
  );

  // --- RENDER: Main Feed Content ---
  const renderMainFeed = () => (
    <>
      <TouchableOpacity
        style={styles.contributeButton}
        onPress={() => navigation.navigate('AddContribution')}
      >
        <Ionicons name="create-outline" size={28} color={DARK_GRAY} />
        <Text style={styles.contributeButtonTitle}>Contribute a new find</Text>
        <View style={styles.contributeButtonPill}>
          <Text style={styles.contributeButtonPillText}>+ Add</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <FlatList
          data={displayRecs}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              favoriteIds={favoriteContributionIds}
              onFavoriteChange={(id, liked) => {
                setFavoriteContributionIds((prev) => {
                  const next = new Set(prev);
                  if (liked) next.add(id);
                  else next.delete(id);
                  favoriteIdsRef.current = next;
                  return next;
                });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>No matches found.</Text>}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Events Today</Text>
        <FlatList
          data={displayEvents}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              favoriteIds={favoriteContributionIds}
              onFavoriteChange={(id, liked) => {
                setFavoriteContributionIds((prev) => {
                  const next = new Set(prev);
                  if (liked) next.add(id);
                  else next.delete(id);
                  favoriteIdsRef.current = next;
                  return next;
                });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>No matches found.</Text>}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending</Text>
        <FlatList
          data={displayTrending}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              favoriteIds={favoriteContributionIds}
              onFavoriteChange={(id, liked) => {
                setFavoriteContributionIds((prev) => {
                  const next = new Set(prev);
                  if (liked) next.add(id);
                  else next.delete(id);
                  favoriteIdsRef.current = next;
                  return next;
                });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>No matches found.</Text>}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Closest To You</Text>
        <FlatList
          data={displayClosest}
          renderItem={({ item }) => (
            <PostCard
              item={item}
              favoriteIds={favoriteContributionIds}
              onFavoriteChange={(id, liked) => {
                setFavoriteContributionIds((prev) => {
                  const next = new Set(prev);
                  if (liked) next.add(id);
                  else next.delete(id);
                  favoriteIdsRef.current = next;
                  return next;
                });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>No matches found.</Text>}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Search Bar */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="search" size={20} color={MEDIUM_GRAY} style={{ marginRight: 8 }} />
            
            {/* Back arrow shows only when focused */}
            {isSearchFocused && (
              <TouchableOpacity onPress={handleBackSearch}>
                <Ionicons name="chevron-back" size={24} color={MEDIUM_GRAY} style={{ marginRight: 8 }} />
              </TouchableOpacity>
            )}

            <TextInput
              style={styles.searchInput}
              placeholder="Find deals"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              // This fixes the yellow bar issue by setting cursor/selection color
              selectionColor={BRAND_GREEN} 
            />
          </View>

          {/* Filter Icon stays inside the bar container */}
           <TouchableOpacity 
            onPress={() => setIsFilterVisible(true)}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="options-outline" size={24} color={DARK_GRAY} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {isSearchFocused ? renderSearchContent() : renderMainFeed()}
      </ScrollView>

      <FilterModal 
        visible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)}
        onApply={applyFilters}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#fff', // Ensure white background covers any leaks
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Ensure white background
    borderWidth: 1,
    borderColor: '#CCC', // Thin gray border
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 44,
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: DARK_GRAY,
    backgroundColor: 'transparent', // No background on input itself
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_YELLOW,
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0E68C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contributeButtonTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginLeft: 12,
  },
  contributeButtonPill: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  contributeButtonPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GRAY,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  
  // --- Search Mode Styles ---
  searchContentContainer: {
    marginTop: 10,
  },
  searchSectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  searchList: {
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: LIGHT_GRAY, // Light gray background for list items
    marginBottom: 2,
  },
  searchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRowText: {
    fontSize: 16,
    color: DARK_GRAY,
  },

  // --- Card Styles ---
  cardContainer: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  // Wide card for Search Recommended
  wideCardContainer: {
    width: '100%', // Full width
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  cardImageContainer: {
    height: 150,
  },
  wideCardImageContainer: {
    height: 180, // Slightly taller for wide card
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cardTagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardHeart: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 13,
    color: MEDIUM_GRAY,
    marginBottom: 10,
  },
  cardTagsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  cardTagPill: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  cardTagPillText: {
    fontSize: 12,
    color: MEDIUM_GRAY,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER_GRAY,
    paddingTop: 10,
  },
  cardDistance: {
    fontSize: 13,
    color: MEDIUM_GRAY,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardStatsText: {
    fontSize: 14,
    color: MEDIUM_GRAY,
    marginLeft: 4,
    marginRight: 10,
  },
});

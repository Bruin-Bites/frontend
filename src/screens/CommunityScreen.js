import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Colors from your design ---
const BRAND_GREEN = '#A8B84C';
const LIGHT_YELLOW = '#FEF9E6';
const DARK_GRAY = '#333333';
const MEDIUM_GRAY = '#666666';
const LIGHT_GRAY = '#F0F0F0';
const BORDER_GRAY = '#E8E8E8';

// --- Mock Data (to make the screen look right) ---
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
    distance: '1.2 mi',
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
    distance: '0.5 mi',
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
    distance: '0.5 mi',
    tags: ['Deal type', 'Food type', 'Location type'],
    likes: 13,
    comments: 3,
    image: 'https://placehold.co/600x400/FADBD8/884EA0?text=Poke',
    tagType: 'FREE',
  },
];

const MOCK_CLOSEST_TO_YOU = [
  {
    id: 'cls1',
    title: '10% Off Smoothies',
    date: 'October 17, 2025',
    time: '12:00PM - 1:30PM',
    distance: '0.5 mi',
    tags: ['Deal type', 'Food type', 'Location type'],
    likes: 13,
    comments: 3,
    image: 'https://placehold.co/600x400/D7BDE2/5B2C6F?text=Smoothies',
    tagType: 'FREE',
  },
];
// ------------------------------------

// --- Reusable Post Card Component ---
// --- Re-usable Post Card Component ---
const PostCard = ({ item }) => {
  // 1. Add state for the like button
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  const toggleLike = () => {
    // 2. Toggle the state and update count
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.cardTag, { backgroundColor: BRAND_GREEN }]}>
          <Text style={styles.cardTagText}>{item.tagType || 'DEAL'}</Text>
        </View>
        {/* 3. Update the heart button */}
        <TouchableOpacity style={styles.cardHeart} onPress={toggleLike}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#FF4500' : 'white'}
          />
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
            {/* 4. Update the like count and icon */}
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
    </View>
  );
};
// ------------------------------------

export default function CommunityScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS);
  const [events, setEvents] = useState(MOCK_EVENTS);

  // ... after const [events, setEvents] ...
  const [trending, setTrending] = useState(MOCK_TRENDING);
  const [closest, setClosest] = useState(MOCK_CLOSEST_TO_YOU);

  // This hook listens for the 'newPost' param from AddContributionScreen
  useEffect(() => {
    if (route.params?.newPost) {
      const newPost = route.params.newPost;
      
      // Create a card-compatible object from the post data
      const newPostCard = {
        id: newPost.id || Date.now().toString(),
        title: newPost.title,
        date: newPost.date,
        time: newPost.time,
        distance: newPost.location ? '0.1 mi' : 'N/A', // Add mock distance
        tags: newPost.tags?.slice(0, 3) || ['New Post'],
        likes: 0,
        comments: 0,
        image: newPost.coverImage || 'https://placehold.co/600x400/cccccc/333333?text=New+Post',
        tagType: newPost.tags?.includes('Free item') ? 'FREE' : 'DEAL',
      };

      // Add the new post to the top of the 'Recommendations' list
      setRecommendations([newPostCard, ...recommendations]);

      // Clear the param so it doesn't re-add on screen focus
      navigation.setParams({ newPost: null });
    }
  }, [route.params?.newPost, navigation]);


  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header & Search Bar --- */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={MEDIUM_GRAY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find deals"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={DARK_GRAY} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Top Cards --- */}
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

        {/* --- Recommendations Section --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <FlatList
            data={recommendations}
            renderItem={({ item }) => <PostCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          />
        </View>

        {/* --- Events Today Section --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Events Today</Text>
        {/* Changed to a FlatList for consistency */}
        <FlatList
          data={events}
          renderItem={({ item }) => <PostCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
        />
      </View>

      {/* --- Trending Section --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending</Text>
        <FlatList
          data={trending}
          renderItem={({ item }) => <PostCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
        />
      </View>

      {/* --- Closest To You Section --- */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Closest To You</Text>
        <FlatList
          data={closest}
          renderItem={({ item }) => <PostCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

// --- New Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 15,
    backgroundColor: LIGHT_GRAY,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  topCardContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  topCard: {
    borderRadius: 16,
    padding: 15,
    width: '48%',
    height: 160,
  },
  contributeCard: {
    backgroundColor: LIGHT_YELLOW,
    borderWidth: 1,
    borderColor: '#F0E68C',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },
  addPill: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
  },
  addPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  promoCard: {
    backgroundColor: LIGHT_GRAY,
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  promoImage: {
    width: '50%',
    height: '100%',
    resizeMode: 'cover',
  },
  promoContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },
  learnMoreButton: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 20,
    paddingVertical: 8,
  },
  learnMoreText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_YELLOW,
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10, // Adds space before Recommendations
    borderWidth: 1,
    borderColor: '#F0E68C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contributeButtonTitle: {
    flex: 1, // Makes the text take up available space
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
  cardImageContainer: {
    height: 150,
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
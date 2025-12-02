import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  FlatList,
  Pressable, // 1. Changed from TouchableOpacity
  Platform,  // 2. Added Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_GREEN = '#A8B84C';
const DARK_GRAY = '#333';
const MEDIUM_GRAY = '#666';
const BLUE_DOT = '#A7D6E6';

// Helper style for web cursor
const pressableStyle = ({ pressed }) => [
  { opacity: pressed ? 0.7 : 1 },
  Platform.OS === 'web' && { cursor: 'pointer' }
];

export default function EventDetailsScreen({ route, navigation }) {
  const { item } = route.params || {};

  const eventDetails = {
    title: item?.title || 'Event',
    time: item?.time,
    date: item?.date,
    description:
      item?.description ||
      'Join us for this community contribution.',
    address: item?.address || item?.location || 'Address TBA',
    hostName: item?.hostName || item?.host || 'Community Member',
    hostContributions: item?.hostContributions || 1,
    heroImage:
      item?.image ||
      item?.coverImage ||
      (Array.isArray(item?.images) ? item.images[0] : null) ||
      'https://placehold.co/800x600/ABEBC6/196F3D?text=Contribution',
    galleryImages:
      (Array.isArray(item?.images) && item.images.length
        ? item.images
        : [
            item?.image ||
              item?.coverImage ||
              'https://placehold.co/800x600/ABEBC6/196F3D?text=Contribution',
          ]),
    menuItems: Array.isArray(item?.menuItems)
      ? item.menuItems
      : Array.isArray(item?.menu)
      ? item.menu
      : [],
    menuList:
      Array.isArray(item?.menu)
        ? item.menu.flatMap((m) => m.items || [])
        : [],
    allergies: Array.isArray(item?.allergies)
      ? item.allergies.map((label) => ({ label, icon: 'alert-circle', color: '#7B1FA2' }))
      : [
          { label: 'Vegan', icon: 'leaf', color: '#88C057' },
          { label: 'Low-Carbon-Footprint', icon: 'earth', color: '#4CAF50' },
        ],
    accessibility: Array.isArray(item?.accessibility)
      ? item.accessibility.map((label) => ({ label, icon: 'body', color: '#4285F4' }))
      : [
          { label: 'Wheelchair accessible', icon: 'body', color: '#4285F4' },
          { label: 'Accessible parking near entrance', icon: 'car', color: '#1967D2' },
        ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={pressableStyle}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.headerIcons}>
          <Pressable style={[styles.iconBtn, pressableStyle]}>
            <Ionicons name="share-outline" size={24} color="black" />
          </Pressable>
          <Pressable style={[styles.iconBtn, pressableStyle]}>
            <Ionicons name="heart-outline" size={24} color="#FF4500" />
          </Pressable>
          <Pressable style={[styles.iconBtn, pressableStyle]}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Image Section with Carousel */}
        <View style={styles.heroSection}>
            <Image source={{ uri: eventDetails.heroImage }} style={styles.heroMainImage} />
            
            <FlatList
              data={eventDetails.galleryImages}
              renderItem={({ item: thumb, index }) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.galleryThumbnailWrapper,
                    index === 0 && styles.galleryThumbnailSelected,
                    Platform.OS === 'web' && { cursor: 'pointer' },
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <Image source={{ uri: thumb }} style={styles.galleryThumbnail} />
                </Pressable>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            />
            <Pressable style={[styles.carouselNavArrow, pressableStyle]}>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </Pressable>
          </View>

        {/* Title & Info */}
        <View style={styles.section}>
          <Text style={styles.title}>{item?.title}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={MEDIUM_GRAY} />
            <Text style={styles.infoText}>
              {item?.date} | {item?.time}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color={MEDIUM_GRAY} />
            <Text style={styles.infoText}>Host by Student Media</Text>
          </View>

          <Text style={styles.description}>{eventDetails.description}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {item?.tags?.map((tag, index) => (
            <View key={index} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={40} color="#CCC" />
            <Pressable style={[styles.expandMapBtn, pressableStyle]}>
              <Ionicons name="arrow-forward" size={20} color="black" />
            </Pressable>
          </View>
          <View style={styles.mapFooter}>
            <View>
              <Ionicons name="location-outline" size={20} color="black" style={{position: 'absolute', left: -25, top: 2}} />
              <Text style={styles.addressText}>{eventDetails.address}</Text>
            </View>
            <Text style={styles.distanceText}>{item?.distance}</Text>
          </View>
        </View>

        {/* Host Section */}
        <View style={styles.hostSection}>
          <View style={styles.hostAvatar} /> 
          <View style={styles.hostInfo}>
            <Text style={styles.hostName}>{eventDetails.hostName}</Text>
            <Text style={styles.hostSub}>{eventDetails.hostContributions} Contribution</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.followBtn, pressableStyle({ pressed })]}>
            <Text style={styles.followText}>Follow</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Menu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
            {eventDetails.menuItems.map((menuItem, index) => (
              <View key={index} style={styles.menuCard}>
                <Image source={{ uri: menuItem.image }} style={styles.menuImage} />
                <View style={styles.menuTitleContainer}>
                  <Text style={styles.menuTitle}>{menuItem.title}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Menu List */}
          <View style={styles.menuList}>
            {eventDetails.menuList.map((listItem, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{listItem}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Allergies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Allergies</Text>
          <View style={styles.gridContainer}>
            {eventDetails.allergies.map((item, index) => (
              <View key={index} style={styles.gridItem}>
                <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                   <Ionicons name={item.icon} size={14} color="white" />
                </View>
                <Text style={styles.gridText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Accessibility</Text>
          {eventDetails.accessibility.map((item, index) => (
            <View key={index} style={styles.gridItemFull}>
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                 <Ionicons name={item.icon} size={14} color="white" />
              </View>
              <Text style={styles.gridText}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* More for You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>More for You</Text>
          <Pressable style={[styles.moreCard, pressableStyle]}>
            <Image source={{ uri: 'https://placehold.co/600x400/ABEBC6/196F3D?text=Matcha' }} style={styles.moreImage} />
            <View style={styles.moreOverlay}>
               <View style={styles.freeBadge}><Text style={styles.freeText}>FREE</Text></View>
               <Pressable style={[styles.heartOverlay, pressableStyle]}>
                 <Ionicons name="heart" size={20} color="#FF4500" />
               </Pressable>
            </View>
            <View style={styles.moreContent}>
              <Text style={styles.moreTitle}>Free Matcha</Text>
              <View style={styles.moreFooter}>
                 <Text style={styles.moreInfo}>October 17, 2025 | 12:00PM - 1:30PM</Text>
                 <Text style={styles.moreDist}>0.5 mi</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky RSVP Button */}
      <View style={styles.stickyFooter}>
        <Pressable style={({ pressed }) => [
          styles.rsvpButton, 
          pressableStyle({ pressed })
        ]}>
          <Text style={styles.rsvpButtonText}>RSVP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Hero & Carousel
  heroSection: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  heroMainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  galleryContainer: {
    paddingVertical: 10,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  galleryThumbnailWrapper: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  galleryThumbnailSelected: {
    borderColor: BRAND_GREEN,
  },
  galleryThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carouselNavArrow: {
    position: 'absolute',
    right: 10,
    bottom: 40,
    backgroundColor: 'white',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  // ...
  section: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: MEDIUM_GRAY,
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginTop: 12,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tagPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    backgroundColor: '#F2F5E5',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: BRAND_GREEN,
    fontSize: 12,
    fontWeight: '600',
  },
  mapSection: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  expandMapBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  mapFooter: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 40, 
  },
  addressText: {
    fontSize: 14,
    color: DARK_GRAY,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 12,
    color: MEDIUM_GRAY,
  },
  hostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DDD',
    marginRight: 12,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
  },
  hostSub: {
    fontSize: 12,
    color: MEDIUM_GRAY,
  },
  followBtn: {
    backgroundColor: BRAND_GREEN,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 15,
  },
  menuScroll: {
    marginBottom: 15,
  },
  menuCard: {
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 12,
    overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
  },
  menuTitleContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  menuTitle: {
    fontSize: 13,
    textAlign: 'center',
    color: DARK_GRAY,
  },
  menuList: {
    marginTop: 5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 16,
    color: DARK_GRAY,
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 15,
    color: DARK_GRAY,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridItemFull: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gridText: {
    fontSize: 15,
    color: DARK_GRAY,
  },
  moreCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  moreImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  moreOverlay: {
    position: 'absolute',
    top: 10,
    left: 0, 
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  freeBadge: {
    backgroundColor: BRAND_GREEN,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  freeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  heartOverlay: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 15,
  },
  moreContent: {
    padding: 12,
  },
  moreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DARK_GRAY,
    marginBottom: 6,
  },
  moreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moreInfo: {
    fontSize: 12,
    color: MEDIUM_GRAY,
  },
  moreDist: {
    fontSize: 12,
    color: MEDIUM_GRAY,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  rsvpButton: {
    backgroundColor: BRAND_GREEN,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  rsvpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

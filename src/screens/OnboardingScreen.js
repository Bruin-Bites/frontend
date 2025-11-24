import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_GREEN = '#A8B84C';
const { width } = Dimensions.get('window');

// Data for the slides
const slides = [
  {
    title: 'Welcome to BruinBites',
    description:
      'Discover affordable dining options and optimize your budget',
  },
  {
    title: 'Interactive Map',
    description:
      'Find nearby affordable food spots around UCLA with an easy-to-navigate map.',
  },
  {
    title: 'Discover',
    description:
      'Explore and share budget-friendly dining options with the community, and contribute your own recommendations.',
  },
  {
    title: 'Recipe Hub',
    description:
      'Generate customizable, low-cost recipes with AI and edit them to fit your needs. Share your creations with the community.',
  },
];

// Re-usable component for a single slide
const OnboardingSlide = ({ item, isLast, onNext, onDone }) => (
  <View style={styles.slide}>
    <View style={styles.imagePlaceholder} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
    <TouchableOpacity
      style={styles.button}
      onPress={isLast ? onDone : onNext}
    >
      <Text style={styles.buttonText}>{isLast ? "Let's Go" : 'Next'}</Text>
    </TouchableOpacity>
  </View>
);

// The main screen component
export default function OnboardingScreen({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Updates the active dot
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  // Scrolls to the next slide
  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (activeIndex + 1),
        animated: true,
      });
    }
  };

  // Navigates to the main app
  const handleDone = () => {
    // Replace the auth flow with the main app stack
    navigation.replace('Home'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((item, index) => (
          <OnboardingSlide
            key={index}
            item={item}
            isLast={index === slides.length - 1}
            onNext={handleNext}
            onDone={handleDone}
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.dotActive : null,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 30,
  },
  imagePlaceholder: {
    width: '80%',
    height: '45%',
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    backgroundColor: BRAND_GREEN,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#8A8A8A',
  },
});

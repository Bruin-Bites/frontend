import React, { useEffect, useRef } from 'react';
import { StyleSheet, Image, Easing, Animated } from 'react-native';

// Make sure this path is correct
const logoAsset = require('../../assets/logo.png');

const BRAND_GREEN = '#A8B84C';
const BACKGROUND_LIGHT_GREEN = '#F2F5E5';
const BACKGROUND_WHITE = '#FFFFFF';

export default function AnimatedSplashScreen({ onAnimationFinish }) {
  // --- Animated values ---
  const shapeTranslateY = useRef(new Animated.Value(0)).current;
  const shapeScale = useRef(new Animated.Value(1)).current;
  const shapeRotate = useRef(new Animated.Value(0)).current; // 0 to 1
  const shapeOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const backgroundColorValue = useRef(new Animated.Value(0)).current; // 0 to 1

  // --- Animation Sequence ---
  useEffect(() => {
    // Run all animations in a sequence
    Animated.sequence([
      // Frame 1 -> 2: Square moves up
      Animated.timing(shapeTranslateY, {
        toValue: -50,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true, // Use native driver for performance
      }),
      // Frame 2 -> 3: Square rotates and grows (at the same time)
      Animated.parallel([
        Animated.timing(shapeRotate, {
          toValue: 1, // We'll interpolate this to 45deg
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shapeScale, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Frame 3 -> 4: Square shrinks into a dot
      Animated.delay(200), // (300+300 = 600. Total 800ms)
      Animated.parallel([
        Animated.timing(shapeScale, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shapeOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Frame 4 -> 5: Logo appears
      Animated.delay(0), // (800+300 = 1100. Logo delay 1100)
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1)), // "Pop" effect
          useNativeDriver: true,
        }),
      ]),
      // Frame 5 -> 6: Background color changes
      Animated.delay(0), // (1100+400 = 1500. BG delay 1500)
      Animated.timing(backgroundColorValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false, // backgroundColor doesn't support native driver
      }),
    ]).start(() => {
      // When sequence is done, call the onAnimationFinish prop
      setTimeout(() => {
        onAnimationFinish();
      }, 500); // Wait 500ms on the final logo
    });
  }, [onAnimationFinish]);

  // --- Interpolated Styles ---

  // Map 0 -> '0deg', 1 -> '45deg'
  const rotateAnim = shapeRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // Map 0 -> '#FFFFFF', 1 -> '#F2F5E5'
  const backgroundColorAnim = backgroundColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [BACKGROUND_WHITE, BACKGROUND_LIGHT_GREEN],
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: backgroundColorAnim }]}
    >
      <Animated.View
        style={[
          styles.shape,
          {
            opacity: shapeOpacity,
            transform: [
              { translateY: shapeTranslateY },
              { scale: shapeScale },
              { rotate: rotateAnim },
            ],
          },
        ]}
      />
      <Animated.Image
        source={logoAsset}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

// --- Styles (Identical) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shape: {
    width: 80,
    height: 80,
    backgroundColor: BRAND_GREEN,
    borderRadius: 12,
  },
  logo: {
    position: 'absolute',
    width: 200,
    height: 100,
  },
});
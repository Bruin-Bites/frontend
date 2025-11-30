import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts, HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_300Light } from "@expo-google-fonts/hanken-grotesk";
import { Geologica_600SemiBold, Geologica_700Bold, Geologica_400Regular } from "@expo-google-fonts/geologica";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "HankenGrotesk-Light": HankenGrotesk_300Light,
    "HankenGrotesk-Regular": HankenGrotesk_400Regular,
    "HankenGrotesk-SemiBold": HankenGrotesk_600SemiBold,
    "Geologica-Regular": Geologica_400Regular,
    "Geologica-SemiBold": Geologica_600SemiBold,
    "Geologica-Bold": Geologica_700Bold,
  });

  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  const onAnimationFinish = useCallback(() => {
    setIsAnimationFinished(true);
  }, []);

  // Hide splash screen when both fonts are loaded and animation is finished
  const isAppReady = fontsLoaded && isAnimationFinished;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  // Show animated splash screen until fonts are loaded and animation finishes
  if (!isAppReady) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={onAnimationFinish}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
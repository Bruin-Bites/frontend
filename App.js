<<<<<<< HEAD
import React, { useCallback } from "react";
import { View } from "react-native";
=======
import React, { useState } from "react";
>>>>>>> main
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts, HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_300Light } from "@expo-google-fonts/hanken-grotesk";
import { Geologica_600SemiBold, Geologica_700Bold, Geologica_400Regular } from "@expo-google-fonts/geologica";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';

// 1. Import NavigationContainer here
import { NavigationContainer } from '@react-navigation/native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
<<<<<<< HEAD
  const [fontsLoaded] = useFonts({
    "HankenGrotesk-Light": HankenGrotesk_300Light,
    "HankenGrotesk-Regular": HankenGrotesk_400Regular,
    "HankenGrotesk-SemiBold": HankenGrotesk_600SemiBold,
    "Geologica-Regular": Geologica_400Regular,
    "Geologica-SemiBold": Geologica_600SemiBold,
    "Geologica-Bold": Geologica_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppNavigator />
      </SafeAreaView>
=======
  const [isAppReady, setIsAppReady] = useState(false);

  if (!isAppReady) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={() => {
          setIsAppReady(true);
        }}
      />
    );
  }


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
>>>>>>> main
    </SafeAreaProvider>
  );
}
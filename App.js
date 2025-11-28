import React, { useCallback } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts, HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_300Light } from "@expo-google-fonts/hanken-grotesk";
import { Geologica_600SemiBold, Geologica_700Bold, Geologica_400Regular } from "@expo-google-fonts/geologica";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";

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
    </SafeAreaProvider>
  );
}

/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/
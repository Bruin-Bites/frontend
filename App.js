import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import { UserProvider } from "./src/contexts/UserContext";
import { LikesProvider } from "./src/contexts/LikesContext";

// 1. Import NavigationContainer here
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
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
      <UserProvider>
        <LikesProvider>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <AppNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </LikesProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
import React from "react";
import { Pressable } from "react-native";
// import { NavigationContainer } from "@react-navigation/native"; // <-- 1. REMOVED THIS
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen"; 
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import RecipesScreen from "../screens/RecipesScreen";
import CommunityScreen from "../screens/CommunityScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import AddContributionScreen from "../screens/AddContributionScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    // <NavigationContainer> {/* <-- 1. REMOVED THIS WRAPPER */}
      <Stack.Navigator
        // 3. SET THE FIRST SCREEN TO 'Auth'
        initialRouteName="Auth" 
        screenOptions={({ navigation, route }) => ({
          headerStyle: { backgroundColor: colors.uclaBlue },
          headerTitleStyle: { color: "white", fontWeight: "700" },
          headerTintColor: "white",
          // show a home icon on all screens except Home
          headerRight: () =>
            route.name !== "Home" ? (
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={{ paddingHorizontal: 8 }}
                hitSlop={8}
              >
                <Ionicons name="home" size={20} color="#fff" />
              </Pressable>
            ) : null
        })}
      >
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ 
            headerShown: false,
          }} 
        />

        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            headerShown: false,
            title: "Sign In" 
          }} 
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ 
            headerShown: false,
            title: "Forgot Password" 
          }} 
        />
        <Stack.Screen 
          name="CreateAccount" 
          component={CreateAccountScreen} 
          options={{ 
            headerShown: false,
            title: "Create Account" 
          }} 
        />

        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ 
            headerShown: false,
          }} 
        />

        <Stack.Screen 
          name="AddContribution" 
          component={AddContributionScreen}
          options={({ navigation }) => ({ // Copied style from your image
            title: "Add contribution",
            headerStyle: { backgroundColor: 'white' },
            headerTintColor: 'black',
            headerTitleStyle: { color: "black", fontWeight: "700" },
            headerShadowVisible: false, // Removes the shadow
          })} 
        />

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: "Cheap Eats Map" }} />
        <Stack.Screen name="Recipes" component={RecipesScreen} options={{ title: "Budget Recipes" }} />
        <Stack.Screen name="Community" component={CommunityScreen} />
      </Stack.Navigator>
  );
}
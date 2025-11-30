/*import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ChatScreen from "../screens/ChatScreen";
import CommunityScreen from "../screens/CommunityScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Recipes" component={RecipesScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/

import React from "react";
import { Pressable } from "react-native";
// import { NavigationContainer } from "@react-navigation/native"; // <-- 1. REMOVED THIS
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen"; 
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ChatScreen from "../screens/ChatScreen";
import UserRecipesScreen from "../screens/UserRecipesScreen";
import RecipeSearchScreen from "../screens/RecipeSearchScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import FilterScreen from "../screens/FilterScreen";
import CommunityScreen from "../screens/CommunityScreen";
import RecipeEditScreen from "../screens/RecipeEditScreen";
import AddContributionScreen from "../screens/AddContributionScreen";
import EventDetailsScreen from '../screens/EventDetailsScreen'; // <--- Import this
import AIRecipeBotScreen from "../screens/AIRecipeBotScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import RecipeEditScreen from "../screens/RecipeEditScreen";
import SavedRecipesScreen from "../screens/SavedRecipesScreen";
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

        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: "Cheap Eats Map" }} />
        <Stack.Screen name="UserRecipes" component={UserRecipesScreen} options={{ title: "User Recipes" }} />
        <Stack.Screen name="RecipeSearch" component={RecipeSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Filter" component={FilterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Recipes" component={ChatScreen} options={{ title: "AI Recipe Chat" }} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RecipeEdit" component={RecipeEditScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
import React, { useEffect } from "react";
import { Pressable, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import OnboardingScreen from "../screens/OnboardingScreen";
import AuthScreen from "../screens/AuthScreen";
import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ChatScreen from "../screens/ChatScreen";
import AIRecipeBotScreen from "../screens/AIRecipeBotScreen";
import UserRecipesScreen from "../screens/UserRecipesScreen";
import SavedRecipesScreen from "../screens/SavedRecipesScreen";
import RecipeSearchScreen from "../screens/RecipeSearchScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import FilterScreen from "../screens/FilterScreen";
import CommunityScreen from "../screens/CommunityScreen";
import RecipeEditScreen from "../screens/RecipeEditScreen";
import AddContributionScreen from "../screens/AddContributionScreen";
import EventDetailsScreen from '../screens/EventDetailsScreen';
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.uclaBlue} />
      </View>
    );
  }

  return (
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Auth"} 
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
        <Stack.Screen name="SavedRecipes" component={SavedRecipesScreen} options={{ title: "My Recipes" }} />
        <Stack.Screen name="RecipeSearch" component={RecipeSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Filter" component={FilterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Recipes" component={ChatScreen} options={{ title: "AI Recipe Chat" }} />
        <Stack.Screen name="AIRecipeBot" component={AIRecipeBotScreen} options={{ title: "AI Recipe Bot" }} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="RecipeEdit" component={RecipeEditScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
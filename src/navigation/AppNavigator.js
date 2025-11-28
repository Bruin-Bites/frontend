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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ChatScreen from "../screens/ChatScreen";
import UserRecipesScreen from "../screens/UserRecipesScreen";
import RecipeSearchScreen from "../screens/RecipeSearchScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import FilterScreen from "../screens/FilterScreen";
import CommunityScreen from "../screens/CommunityScreen";
import RecipeEditScreen from "../screens/RecipeEditScreen";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
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
    </NavigationContainer>
  );
}


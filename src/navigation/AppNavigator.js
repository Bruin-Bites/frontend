import React from "react";
import { Pressable } from "react-native";
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
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ContributionsScreen from "../screens/ContributionsScreen";
import ContributorProfileScreen from "../screens/ContributorProfileScreen";
import FollowingScreen from "../screens/FollowingScreen";
import HistoryScreen from "../screens/HistoryScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import AccountScreen from "../screens/AccountScreen";
import ArchivedScreen from "../screens/ArchivedScreen";
import LikedScreen from "../screens/LikedScreen";
import AddContributionScreen from "../screens/AddContributionScreen";
import EventDetailsScreen from '../screens/EventDetailsScreen';
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator
        initialRouteName="Auth" 
        screenOptions={({ navigation, route }) => ({
          headerStyle: { backgroundColor: colors.uclaBlue },
          headerTitleStyle: { color: "white", fontWeight: "700" },
          headerTintColor: "white",
          // show a home icon on all screens except Home, and profile icon on Home
          headerRight: () => {
            if (route.name === "Home") {
              return (
                <Pressable
                  onPress={() => navigation.navigate("Profile")}
                  style={{ paddingHorizontal: 8 }}
                  hitSlop={8}
                >
                  <Ionicons name="person-circle" size={28} color="#fff" />
                </Pressable>
              );
            }
            return (
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={{ paddingHorizontal: 8 }}
                hitSlop={8}
              >
                <Ionicons name="home" size={20} color="#fff" />
              </Pressable>
            );
          },
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
            title: "Sign In",
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{
            headerShown: false,
            title: "Forgot Password",
          }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{
            headerShown: false,
            title: "Create Account",
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
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Cheap Eats Map" }}
        />
        <Stack.Screen
          name="Recipes"
          component={RecipesScreen}
          options={{ title: "Budget Recipes" }}
        />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "My account", headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: "Edit Profile", headerShown: false }}
        />
        <Stack.Screen
          name="Contributions"
          component={ContributionsScreen}
          options={{ title: "Contributions", headerShown: false }}
        />
        <Stack.Screen
          name="ContributorProfile"
          component={ContributorProfileScreen}
          options={{ title: "Contributor Profile", headerShown: false }}
        />
        <Stack.Screen
          name="Following"
          component={FollowingScreen}
          options={{ title: "Following", headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "History", headerShown: false }}
        />
        <Stack.Screen
          name="Archived"
          component={ArchivedScreen}
          options={{ title: "Archived", headerShown: false }}
        />
        <Stack.Screen
          name="Liked"
          component={LikedScreen}
          options={{ title: "Liked", headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: "Notifications", headerShown: false }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ title: "Account", headerShown: false }}
        />
      </Stack.Navigator>
  );
}

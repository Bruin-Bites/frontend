import React, { useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { generateRecipe } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

export default function ChatScreen() {
  // chat state
  const [messages, setMessages] = useState([
    { id: "sys-0", role: "assistant", text: "Hi! I'm your AI Recipe Bot. Send me ingredients or a recipe name, and I'll create a custom recipe for you!" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const navigation = useNavigation();

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setSending(true);

    try {
      // Call generateRecipe from recipeService
      const result = await generateRecipe(trimmed, {
        maxPrice: 50,
        limit: 30,
      });

      // Backend returns { reply, tips, pricing } format
      const recipe = result?.reply;
      const tips = result?.tips || [];
      const pricing = result?.pricing || {};
      const totalCost = pricing?.totalCost || 0;

      if (!recipe) {
        setMessages(prev => [
          ...prev,
          { id: `a-${Date.now()}`, role: "assistant", text: "Sorry, I couldn't generate a recipe." }
        ]);
        return;
      }

      console.log("Recipe generated:", recipe);
      console.log("Tips:", tips);
      console.log("Pricing:", pricing);

      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "Here's a recipe you can make:",
        recipe,
        tips,
        totalCost
      };

      setMessages(prev => [...prev, assistantMsg]);
      // scroll to bottom
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } catch (e) {
      console.error("Error fetching recipe:", e);
      const errorMessage = e.response?.data?.error || e.message || "Network error. Try again in a sec.";
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: errorMessage }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 8 }}
        renderItem={({ item }) => <Bubble message={item} navigation={navigation} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Composer */}
      <View style={styles.composer}>
        <TextInput
          placeholder="e.g., eggs, spinach, tortilla"
          placeholderTextColor="#99A3AD"
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          editable={!sending}
          returnKeyType="send"
        />
        <Pressable onPress={send} disabled={sending} style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.85 }]}>
          {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={16} color="#fff" />}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message, navigation }) {
  const isUser = message.role === "user";

  const handleEdit = () => {
    if (!message.recipe) return;

    // Transform recipe to match backend schema
    const transformedRecipe = {
      name: message.recipe.name || "",
      description: message.recipe.description || "", // No description in AI response, leave empty
      servings: message.recipe.servings || 4,
      ingredients: (message.recipe.ingredients || []).map(ing => ({
        item: ing.item || "",
        amount: ing.amount || ""
      })),
      instructions: message.recipe.instructions || [],
      tips: message.tips || [],
      image: "https://via.placeholder.com/200",
      prepTime: roundToNearest15(parseTimeToMinutes(message.recipe.prepTime)),
      difficulty: message.recipe.difficulty || 2,
      budget_min: Math.ceil(message.totalCost),
      budget_max: Math.ceil(message.totalCost * 1.5) + 2,
      tags: [
        ...(message.recipe.mealTypes || []),
        ...(message.recipe.dietaryTags || []),
        message.recipe.cuisine
      ].filter(Boolean),
      allergies: [],
      isPublic: false,
      rating: 0,
      likes: 0,
      comments: []
    };

    navigation.navigate("RecipeEdit", { recipe: transformedRecipe });
  };

  // Helper function to parse time strings like "25 minutes" to number
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 30;
    if (typeof timeStr === 'number') return timeStr;

    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 30;
  };

  // Helper function to round to nearest 15 minutes
  const roundToNearest15 = (minutes) => {
    return Math.round(minutes / 15) * 15;
  };

  // If the message has a recipe, render text + RecipeCard in a bubble
  if (message.recipe) {
    return (
      <View style={styles.bubbleRow}>
        <View style={styles.bubbleBot}>
          {message.text && (
            <Text style={styles.bubbleText}>{message.text}</Text>
          )}
          <View style={styles.recipeCardWrapper}>
            <RecipeCard
              recipe={message.recipe}
              tips={message.tips}
              totalCost={Math.ceil(message.totalCost * 1.5) + 2}
              onEdit={handleEdit}
            />
          </View>
        </View>
      </View>
    );
  }

  // Otherwise render a text bubble
  return (
    <View style={[styles.bubbleRow, isUser ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleRow: {
    width: "100%",
    paddingVertical: 6,
    flexDirection: "row",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 15,
    padding: 12,
  },
  bubbleBot: {
    backgroundColor: "#F7F7F7",
    borderWidth: 1.5,
    borderColor: "#8AB644",
    borderRadius: 15,
    padding: 14,
    maxWidth: "95%",
  },
  bubbleUser: {
    backgroundColor: "#E8F0DA",
    borderWidth: 1.5,
    borderColor: "#8AB644",
    borderRadius: 15,
    padding: 14,
    maxWidth: "95%",
  },
  bubbleText: {
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    color: "#100C08",
  },
  recipeCardWrapper: {
    marginTop: 12,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)"
  },
  input: {
    flex: 1,
    fontFamily: "HankenGrotesk-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
    backgroundColor: "#E8F0DA",
    borderWidth: 1,
    borderColor: "rgba(119, 171, 38,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    color: "#100C08"
  },
  sendBtn: {
    backgroundColor: "#8AB644",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999
  }
});
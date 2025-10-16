import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors } from "../theme/colors";

export default function RecipesScreen() {
  // list of sample recipes from /api/recipes
  const [recipes, setRecipes] = useState([]);
  // chat state
  const [messages, setMessages] = useState([
    { id: "sys-0", role: "assistant", text: "Tell me 2–4 ingredients you have, and I’ll suggest a <$5 recipe with steps." }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    api.get("/recipes").then(res => setRecipes(res.data.recipes || [])).catch(() => setRecipes([]));
  }, []);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("/chat/recipes", {
        message: trimmed,
        history: newHistory.map(({ role, text }) => ({ role, content: text }))
      });
      const botText = res?.data?.reply || "Sorry, I couldn’t generate a recipe.";
      const tips = res?.data?.tips || [];
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: botText + (tips.length ? `\n\nQuick tips:\n- ${tips.join("\n- ")}` : "")
      };
      setMessages(prev => [...prev, assistantMsg]);
      // scroll to bottom
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: "Network error. Try again in a sec." }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Header section for Featured recipes */}
      <View style={styles.sectionHeader}>
        <Text style={styles.h1}>Budget Recipes</Text>
        <Text style={styles.sub}>Quick ideas from common TJ’s & Ralphs staples</Text>
      </View>

      {/* Featured list */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => <RecipeCard title={item.title} />}
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 16 }}>
            <RecipeCard title="TJ’s Cauliflower Gnocchi + Marinara" />
            <View style={{ width: 12 }} />
            <RecipeCard title="$5 Ralphs Lentil Soup Hack" />
          </View>
        }
      />

      {/* Chat area */}
      <View style={styles.chatHeader}>
        <Ionicons name="chatbubbles" size={16} color={colors.uclaBlue} />
        <Text style={styles.chatHeaderText}>Recipe Chatbot</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        renderItem={({ item }) => <Bubble role={item.role} text={item.text} />}
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

function RecipeCard({ title }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardMeta}>Under 15 min • ≈ $3–5 / serving</Text>
      <View style={styles.cardCta}>
        <Text style={styles.cardCtaText}>View</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.uclaBlue} />
      </View>
    </View>
  );
}

function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" }]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, isUser && { color: "#fff" }]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: "#fff" },
  h1: { fontSize: 22, fontWeight: "800", color: "#1B2430" },
  sub: { fontSize: 13, color: "#5F6C7B", marginTop: 2 },

  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#1B2430" },
  cardMeta: { fontSize: 12, color: "#5F6C7B", marginTop: 6 },
  cardCta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  cardCtaText: { color: colors.uclaBlue, fontWeight: "800" },

  chatHeader: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  chatHeaderText: { fontWeight: "800", color: colors.uclaBlue, fontSize: 14 },

  bubbleRow: { width: "100%", paddingVertical: 4 },
  bubble: { maxWidth: "82%", borderRadius: 14, padding: 10 },
  bubbleBot: { backgroundColor: "#F1F5FA", borderWidth: 1, borderColor: "rgba(39,116,174,0.12)" },
  bubbleUser: { backgroundColor: colors.uclaBlue },
  bubbleText: { fontSize: 14, color: "#1B2430" },

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
    fontSize: 14,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    color: "#223"
  },
  sendBtn: {
    backgroundColor: colors.uclaBlue,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999
  }
});

/*import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../services/api";

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.get("/recipes")
      .then((res) => setRecipes(res.data.recipes || []))
      .catch(() => setRecipes([]));
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
        Budget Recipes (placeholder)
      </Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ paddingVertical: 6 }}>• {item.title}</Text>
        )}
      />
    </View>
  );
}*/
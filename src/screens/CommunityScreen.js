import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";
import { colors } from "../theme/colors";

const TAGS = ["Near Campus", "Happy Hour", "Vegetarian", "Dessert", "Grocery Hack"];

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [tag, setTag] = useState("Near Campus");
  const [text, setText] = useState("");

  // Fetches posts when the component loads
  useEffect(() => {
    api.get("/community")
      .then(res => {
        // This now gets REAL, sorted data from your server.
        // We map over it to ensure the key for the list is `id`.
        const realPosts = (res.data.posts || []).map(p => ({
          ...p,
          id: p._id, // Use the real database ID (_id) for the FlatList key
        }));
        setPosts(realPosts);
      })
      .catch(() =>
        // This fallback data is used if your backend server isn't running.
        setPosts([
          { id: "p1", text: "Diddy Riese for dessert—cash only!", votes: 12, tag: "Dessert", author: "Anonymous Bruin", time: "Today" },
          { id: "p2", text: "Kerckhoff coffee happy hour 2–4pm", votes: 7, tag: "Happy Hour", author: "2nd-year CS", time: "3h" }
        ])
      );
  }, []);

  // Submits a new post to the backend
  const submit = async () => {
    const body = text.trim();
    if (!body) return;

    const newPostData = {
      text: body,
      tag,
      author: "You",
    };

    try {
      // Send the new post data to the backend API
      const res = await api.post("/community", newPostData);
      const savedPost = res.data;

      // Add the new post returned from the server to the top of the list
      setPosts([
        { ...savedPost, id: savedPost._id, time: "just now" }, 
        ...posts
      ]);
      
      setText(""); // Clear the input box
    } catch (err) {
      console.error("Failed to submit post:", err);
      // You could add an error message for the user here
    }
  };

  const upvote = (id) => {
    setPosts(p => p.map(item => (item.id === id ? { ...item, votes: item.votes + 1 } : item)));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Intro banner */}
      <View style={styles.banner}>
        <Ionicons name="megaphone" size={18} color={colors.uclaBlue} />
        <Text style={styles.bannerText}>Share a $5 meal, happy hour, or dorm-kitchen hack with other Bruins.</Text>
      </View>

      {/* Composer */}
      <View style={styles.composer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Share a quick tip… (e.g., 'BPlate power bowl remix for $5')"
          placeholderTextColor="#99A3AD"
          style={styles.input}
          multiline
        />
        <View style={styles.composerRow}>
          <View style={styles.tagsRow}>
            {TAGS.slice(0, 4).map(t => (
              <Pressable key={t} onPress={() => setTag(t)} style={[styles.tag, tag === t && styles.tagOn]}>
                <Text style={[styles.tagText, tag === t && { color: "#fff" }]}>{t}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={submit} style={({ pressed }) => [styles.postBtn, pressed && { opacity: 0.9 }]}>
            <Ionicons name="send" size={16} color="#fff" />
            <Text style={styles.postBtnText}>Post</Text>
          </Pressable>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={14} color="#5F6C7B" />
              </View>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.time}>
                {/* This now displays a relative time like "5 minutes ago" */}
                {item.createdAt
                  ? `${formatDistanceToNow(new Date(item.createdAt))} ago`
                  : item.time}
              </Text>
              <View style={{ flex: 1 }} />
              <View style={[styles.pill, { borderColor: colors.uclaBlue }]}>
                <Text style={[styles.pillText, { color: colors.uclaBlue }]}>{item.tag}</Text>
              </View>
            </View>

            <Text style={styles.body}>{item.text}</Text>

            <View style={styles.actions}>
              <Pressable onPress={() => upvote(item.id)} style={styles.voteBtn} hitSlop={8}>
                <Ionicons name="thumbs-up" size={16} color={colors.uclaBlue} />
                <Text style={styles.voteText}>{item.votes}</Text>
              </Pressable>
              <Pressable style={styles.replyBtn} hitSlop={8}>
                <Ionicons name="chatbubble-ellipses" size={16} color="#5F6C7B" />
                <Text style={styles.replyText}>Reply</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

// STYLES (no changes needed)
const styles = StyleSheet.create({
  banner: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F1F6FF",
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.2)",
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start"
  },
  bannerText: { flex: 1, color: "#334155" },
  postBtn: {
    backgroundColor: colors.uclaBlue,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  postBtnText: { color: "#fff", fontWeight: "700" },
  composer: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)"
  },
  input: {
    minHeight: 44,
    maxHeight: 120,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F7FAFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(39,116,174,0.25)",
    color: "#223"
  },
  composerRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, flex: 1 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.uclaBlue,
    backgroundColor: "#fff"
  },
  tagOn: { backgroundColor: colors.uclaBlue, borderColor: colors.uclaBlue },
  tagText: { fontSize: 12, fontWeight: "700", color: colors.uclaBlue },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  avatar: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#EEF3FF",
    alignItems: "center", justifyContent: "center", marginRight: 8
  },
  author: { fontWeight: "700", color: "#1B2430" },
  dot: { marginHorizontal: 6, color: "#94A3B8" },
  time: { color: "#64748B" },

  body: { fontSize: 15, color: "#19212A", marginTop: 6, marginBottom: 12 },

  pill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontSize: 12, fontWeight: "700" },

  actions: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 4 },
  voteBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 6 },
  voteText: { fontWeight: "800", color: colors.uclaBlue },
  replyBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, paddingHorizontal: 6 },
  replyText: { color: "#5F6C7B", fontWeight: "700" }
});


/*import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../services/api";

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/community")
      .then((res) => setPosts(res.data.posts || []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
        Community Tips (placeholder)
      </Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ paddingVertical: 6 }}>• {item.text}</Text>
        )}
      />
    </View>
  );
}*/

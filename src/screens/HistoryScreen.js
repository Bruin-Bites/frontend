import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";

export default function HistoryScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={18} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>History</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Archived Button */}
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Archived")}
          >
            <Ionicons name="archive-outline" size={32} color="#8C8C8C" />
            <Text style={styles.buttonText}>Archived</Text>
            <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
          </Pressable>

          {/* Liked Button */}
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Liked")}
          >
            <Ionicons name="heart-outline" size={30} color="#8C8C8C" />
            <Text style={styles.buttonText}>Liked</Text>
            <Ionicons name="chevron-forward" size={18} color="#8C8C8C" />
          </Pressable>
        </ScrollView>
        <BottomNavigation />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 26,
    paddingTop: 26,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  backButton: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 18,
  },
  content: {
    paddingHorizontal: 26,
    paddingTop: 38,
    gap: 21,
    paddingBottom: 60,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 121,
    paddingVertical: 12,
    height: 58,
    gap: 45,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
    width: 153,
  },
});

import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function IngredientItem({ ingredient }) {
  const [expanded, setExpanded] = useState(false);
  const { item, amount, pricing } = ingredient;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.mainInfo}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.ingredientText}>
            {amount} {item}
          </Text>
        </View>
        {pricing?.found && (
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ${pricing.costForRecipe.toFixed(2)}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#5F6C7B"
            />
          </View>
        )}
      </Pressable>

      {expanded && pricing?.found && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>Product:</Text>
          <Text style={styles.detailValue}>{pricing.productName}</Text>

          <Text style={styles.detailLabel}>Size:</Text>
          <Text style={styles.detailValue}>{pricing.size}</Text>

          <Text style={styles.detailLabel}>Full Package Price:</Text>
          <Text style={styles.detailValue}>
            ${pricing.productPrice.toFixed(2)}
            {pricing.regularPrice !== pricing.productPrice && (
              <Text style={styles.regularPrice}>
                {" "}(reg. ${pricing.regularPrice.toFixed(2)})
              </Text>
            )}
          </Text>

          <Text style={styles.detailLabel}>Cost for Recipe:</Text>
          <Text style={styles.detailValue}>
            ${pricing.costForRecipe.toFixed(2)}
          </Text>
        </View>
      )}

      {expanded && !pricing?.found && (
        <View style={styles.detailsContainer}>
          <Text style={styles.notFoundText}>Pricing not available in store</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  bullet: {
    fontSize: 14,
    color: "#1B2430",
    marginRight: 6,
  },
  ingredientText: {
    fontSize: 14,
    color: "#1B2430",
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.uclaBlue,
  },
  detailsContainer: {
    marginLeft: 20,
    marginTop: 8,
    paddingLeft: 12,
    paddingTop: 8,
    paddingBottom: 4,
    borderLeftWidth: 2,
    borderLeftColor: "rgba(39,116,174,0.2)",
    backgroundColor: "#F7FAFF",
    borderRadius: 6,
    padding: 10,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5F6C7B",
    marginTop: 4,
  },
  detailValue: {
    fontSize: 13,
    color: "#1B2430",
    marginBottom: 6,
  },
  regularPrice: {
    fontSize: 12,
    color: "#99A3AD",
    textDecorationLine: "line-through",
  },
  notFoundText: {
    fontSize: 12,
    color: "#99A3AD",
    fontStyle: "italic",
  },
});

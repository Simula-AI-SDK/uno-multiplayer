import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card as UnoCard } from "../types/game";
import { Card } from "./Card";

type Props = {
  topCard: UnoCard;
  currentColor: string;
};

export const DiscardPile: React.FC<Props> = ({ topCard, currentColor }) => (
  <View style={styles.wrap}>
    <Card card={topCard} />
    <Text style={styles.colorLabel}>Color: {currentColor.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    width: 112,
    paddingBottom: 4
  },
  colorLabel: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    width: "100%",
    textAlign: "center"
  }
});

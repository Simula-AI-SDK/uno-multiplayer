import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

type Props = {
  remaining: number;
  onPress: () => void;
  disabled?: boolean;
};

export const DrawPile: React.FC<Props> = ({ remaining, onPress, disabled = false }) => (
  <Pressable onPress={onPress} disabled={disabled} style={disabled && styles.disabled}>
    <View style={styles.wrap}>
      <View style={[styles.stackCard, styles.stack1]} />
      <View style={[styles.stackCard, styles.stack2]} />
      <Card card={{ id: "back", color: "wild", type: "wild" }} faceDown />
      <Text style={styles.label}>Draw ({remaining})</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    width: 112,
    paddingBottom: 4
  },
  stackCard: {
    position: "absolute",
    top: 2,
    width: 70,
    height: 102,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "#0b1324"
  },
  stack1: {
    transform: [{ rotate: "-6deg" }, { translateX: -4 }, { translateY: 4 }]
  },
  stack2: {
    transform: [{ rotate: "5deg" }, { translateX: 5 }, { translateY: 1 }]
  },
  label: {
    marginTop: 10,
    color: "#f1f5f9",
    fontWeight: "700",
    fontSize: 12,
    width: "100%",
    textAlign: "center"
  },
  disabled: {
    opacity: 0.6
  }
});

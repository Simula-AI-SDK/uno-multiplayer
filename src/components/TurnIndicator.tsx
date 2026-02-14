import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  currentPlayerName: string;
  direction: 1 | -1;
};

export const TurnIndicator: React.FC<Props> = ({ currentPlayerName, direction }) => (
  <View style={styles.wrap}>
    <View style={styles.chip}>
      <Text style={styles.label}>TURN</Text>
      <Text style={styles.text}>{currentPlayerName}</Text>
      <Text style={styles.sub}>{direction === 1 ? "Clockwise" : "Counterclockwise"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 8
  },
  chip: {
    minWidth: 170,
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(10, 23, 42, 0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4
  },
  label: {
    color: "#FFD54F",
    fontWeight: "900",
    letterSpacing: 1.4,
    fontSize: 10
  },
  text: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    marginTop: 1
  },
  sub: {
    color: "#d0d4df",
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600"
  }
});

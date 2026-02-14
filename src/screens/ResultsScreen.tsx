import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  winnerName: string;
  onRematch: () => void;
  onHome: () => void;
};

export const ResultsScreen: React.FC<Props> = ({ winnerName, onRematch, onHome }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{winnerName} Wins!</Text>
    <Text style={styles.subtitle}>Great round. Ready for another?</Text>

    <Pressable style={styles.buttonPrimary} onPress={onRematch}>
      <Text style={styles.buttonText}>Rematch</Text>
    </Pressable>
    <Pressable style={styles.buttonSecondary} onPress={onHome}>
      <Text style={styles.buttonText}>Home</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900"
  },
  subtitle: {
    marginTop: 8,
    color: "#bac2d2"
  },
  buttonPrimary: {
    marginTop: 24,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#00C853",
    paddingVertical: 13,
    alignItems: "center"
  },
  buttonSecondary: {
    marginTop: 10,
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#3F51B5",
    paddingVertical: 13,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800"
  }
});

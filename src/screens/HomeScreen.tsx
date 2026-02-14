import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onStart: () => void;
  stats: { gamesPlayed: number; humanWins: number };
};

export const HomeScreen: React.FC<Props> = ({ onStart, stats }) => (
  <View style={styles.container}>
    <Text style={styles.title}>UNO Mini Game</Text>
    <Text style={styles.subtitle}>Interactive NPCs + Reward Block Mode</Text>

    <View style={styles.stats}>
      <Text style={styles.stat}>Games: {stats.gamesPlayed}</Text>
      <Text style={styles.stat}>Wins: {stats.humanWins}</Text>
    </View>

    <Pressable style={styles.button} onPress={onStart}>
      <Text style={styles.buttonText}>Start Match</Text>
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
    fontSize: 36,
    fontWeight: "900"
  },
  subtitle: {
    marginTop: 8,
    color: "#a6b0c3",
    textAlign: "center"
  },
  stats: {
    marginTop: 28,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    width: "100%"
  },
  stat: {
    color: "#fff",
    fontWeight: "700"
  },
  button: {
    marginTop: 24,
    backgroundColor: "#3F51B5",
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16
  }
});

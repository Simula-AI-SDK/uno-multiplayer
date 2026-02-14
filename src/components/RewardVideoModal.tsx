import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onWatch: () => void;
  onAccept: () => void;
  adVisible: boolean;
  onAdDone: () => void;
};

export const RewardVideoModal: React.FC<Props> = ({ visible, onWatch, onAccept, adVisible, onAdDone }) => {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!adVisible) {
      setSecondsLeft(5);
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onAdDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [adVisible, onAdDone]);

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <Text style={styles.title}>Incoming Penalty</Text>
            <Text style={styles.body}>Watch a reward video to block this penalty effect.</Text>
            <Pressable style={styles.primary} onPress={onWatch}>
              <Text style={styles.primaryText}>Watch Video to Block</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={onAccept}>
              <Text style={styles.secondaryText}>Accept Penalty</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={adVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.adPanel}>
            <Text style={styles.adLabel}>AD</Text>
            <Text style={styles.adText}>Simulated reward video in progress...</Text>
            <Text style={styles.timer}>{secondsLeft}s</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  panel: {
    width: "100%",
    backgroundColor: "rgba(18,23,35,0.95)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20
  },
  body: {
    color: "#ced4da",
    marginTop: 8,
    marginBottom: 16
  },
  primary: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  primaryText: {
    color: "#fff",
    fontWeight: "800"
  },
  secondary: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10
  },
  secondaryText: {
    color: "#f8f9fa",
    fontWeight: "700"
  },
  adPanel: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: "#080c19",
    padding: 18,
    alignItems: "center"
  },
  adLabel: {
    color: "#FFD54F",
    fontWeight: "900",
    fontSize: 12
  },
  adText: {
    marginTop: 8,
    color: "#fff",
    textAlign: "center"
  },
  timer: {
    marginTop: 14,
    color: "#69F0AE",
    fontSize: 32,
    fontWeight: "900"
  }
});

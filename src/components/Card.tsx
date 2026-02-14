import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Card as UnoCard } from "../types/game";
import { cardLabel } from "../utils/gameLogic";

type Props = {
  card: UnoCard;
  playable?: boolean;
  onPress?: () => void;
  compact?: boolean;
  faceDown?: boolean;
};

const CARD_COLORS: Record<string, string> = {
  red: "#E53935",
  blue: "#1E88E5",
  green: "#2E7D32",
  yellow: "#FBC02D",
  wild: "#2B2B2B"
};

export const Card: React.FC<Props> = ({ card, playable = false, onPress, compact = false, faceDown = false }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const centerLabel = card.type === "reverse" ? "REV" : cardLabel(card);
  const cornerLabel = card.type === "reverse" ? "R" : cardLabel(card);
  const isWild4 = card.type === "wild4";
  const isLongLabel = centerLabel.length >= 4;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.05, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 90, useNativeDriver: true })
    ]).start();
  };

  const width = compact ? 52 : 70;
  const height = compact ? 78 : 102;

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        pulse();
        onPress?.();
      }}
    >
      <Animated.View
        style={[
          styles.card,
          { width, height, transform: [{ scale }] },
          faceDown ? styles.backCard : { backgroundColor: CARD_COLORS[card.color] },
          playable && styles.playableGlow
        ]}
      >
        {!faceDown ? (
          <View style={styles.cardInner}>
            <View style={styles.highlightBand} />
            <View style={styles.whiteOval}>
              <Text style={[styles.mainLabel, isLongLabel && styles.mainLabelLong, isWild4 && styles.mainLabelWild4]}>
                {centerLabel}
              </Text>
            </View>
            <Text style={[styles.cornerTop, isWild4 && styles.cornerWild4]}>{cornerLabel}</Text>
            <Text style={[styles.cornerBottom, isWild4 && styles.cornerWild4]}>{cornerLabel}</Text>
          </View>
        ) : (
          <View style={styles.backInner}>
            <View style={styles.backStripe} />
            <Text style={styles.backText}>UNO</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2.2,
    borderColor: "rgba(255,255,255,0.9)",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7
  },
  backCard: {
    backgroundColor: "#101820"
  },
  backInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  backStripe: {
    position: "absolute",
    width: "145%",
    height: 18,
    backgroundColor: "#D81B60",
    transform: [{ rotate: "-28deg" }]
  },
  backText: {
    color: "#ffffff",
    fontWeight: "900",
    letterSpacing: 1.5,
    fontSize: 14
  },
  cardInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 6
  },
  highlightBand: {
    position: "absolute",
    top: -10,
    left: -40,
    width: 90,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.18)",
    transform: [{ rotate: "-30deg" }]
  },
  whiteOval: {
    width: "78%",
    height: "54%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-22deg" }]
  },
  cornerTop: {
    position: "absolute",
    top: 5,
    left: 7,
    color: "#fff",
    fontWeight: "900",
    fontSize: 11,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  cornerBottom: {
    position: "absolute",
    bottom: 5,
    right: 7,
    color: "#fff",
    fontWeight: "900",
    fontSize: 11,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    transform: [{ rotate: "180deg" }]
  },
  cornerWild4: {
    color: "#fef08a",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 2
  },
  mainLabel: {
    textAlign: "center",
    color: "#121212",
    fontWeight: "900",
    fontSize: 24,
    transform: [{ rotate: "22deg" }]
  },
  mainLabelLong: {
    fontSize: 16,
    letterSpacing: 0.4
  },
  mainLabelWild4: {
    color: "#b91c1c",
    textShadowColor: "rgba(255,255,255,0.85)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2
  },
  playableGlow: {
    shadowColor: "#ffe082",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10
  }
});

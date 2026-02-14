import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Player } from "../types/game";
import { NPC_CHARACTERS } from "../config/npcConfig";

type Props = {
  player: Player;
  isActive: boolean;
};

const splitBalancedRows = (count: number, maxPerRow = 4): number[] => {
  if (count <= 0) return [];
  const rowCount = Math.ceil(count / maxPerRow);
  const base = Math.floor(count / rowCount);
  const extra = count % rowCount;
  return Array.from({ length: rowCount }, (_, idx) => base + (idx < extra ? 1 : 0));
};

export const NPCPlayer: React.FC<Props> = ({ player, isActive }) => {
  const npc = NPC_CHARACTERS.find((n) => n.id === player.npcId);
  if (!npc) return null;
  const rowSizes = splitBalancedRows(player.hand.length, 4);
  const scale = useRef(new Animated.Value(isActive ? 1.3 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1.3 : 1,
      friction: 7,
      tension: 90,
      useNativeDriver: true
    }).start();
  }, [isActive, scale]);

  return (
    <View style={styles.wrap}>
      <Animated.Image
        source={npc?.avatarSource}
        style={[styles.avatar, { transform: [{ scale }] }, isActive && styles.avatarActive]}
        resizeMode="cover"
        // NPC visuals must come from provided image files.
      />
      <View style={styles.miniHand}>
        {rowSizes.map((size, rowIdx) => (
          <View key={`${player.id}-row-${rowIdx}`} style={styles.miniRow}>
            {Array.from({ length: size }).map((_, colIdx) => (
              <View key={`${player.id}-mini-${rowIdx}-${colIdx}`} style={styles.miniCard} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 14,
    padding: 0,
    minWidth: 118
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
    backgroundColor: "#2e2e2e"
  },
  avatarActive: {
    borderColor: "#FFD54F",
    borderWidth: 3,
    shadowColor: "#FFD54F",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8
  },
  miniHand: {
    marginTop: 6,
    width: 76,
    justifyContent: "center",
    rowGap: 2
  },
  miniRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  miniCard: {
    width: 10,
    height: 14,
    borderRadius: 2,
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "#0f172a"
  }
});

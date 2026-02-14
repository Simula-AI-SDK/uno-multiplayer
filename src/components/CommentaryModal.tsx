import React, { useEffect, useRef } from "react";
import { Animated, Image, Modal, StyleSheet, Text, View } from "react-native";
import { NPC_CHARACTERS } from "../config/npcConfig";

type Props = {
  visible: boolean;
  npcId: number | null;
  text: string;
};

export const CommentaryModal: React.FC<Props> = ({ visible, npcId, text }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const bubble = useRef(new Animated.Value(0)).current;
  const npc = NPC_CHARACTERS.find((n) => n.id === npcId);

  useEffect(() => {
    if (!visible) return;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(bubble, { toValue: 1, duration: 360, useNativeDriver: true })
    ]).start();
  }, [bubble, opacity, scale, visible]);

  useEffect(() => {
    if (visible) return;
    opacity.setValue(0);
    scale.setValue(0.85);
    bubble.setValue(0);
  }, [bubble, opacity, scale, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.center, { opacity, transform: [{ scale }] }]}>
          {npc && <Image source={npc.portraitSource} style={styles.portrait} resizeMode="cover" />}
          <Animated.View style={[styles.bubble, { opacity: bubble, transform: [{ translateY: bubble.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
            <Text style={styles.text}>{text}</Text>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,16,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  center: {
    alignItems: "center"
  },
  portrait: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderColor: "rgba(255,255,255,0.8)",
    borderWidth: 2,
    backgroundColor: "#2c2c2c"
  },
  bubble: {
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    maxWidth: 280
  },
  text: {
    color: "#141414",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center"
  }
});

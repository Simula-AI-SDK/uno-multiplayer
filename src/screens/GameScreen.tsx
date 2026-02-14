import React, { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import { NPC_CHARACTERS } from "../config/npcConfig";
import { CommentaryModal } from "../components/CommentaryModal";
import { DiscardPile } from "../components/DiscardPile";
import { DrawPile } from "../components/DrawPile";
import { NPCPlayer } from "../components/NPCPlayer";
import { PlayerHand } from "../components/PlayerHand";
import { RewardVideoModal } from "../components/RewardVideoModal";
import { TurnIndicator } from "../components/TurnIndicator";
import {
  acceptPenalty,
  blockPenaltyWithReward,
  callUno,
  catchUno,
  completeRewardAd,
  drawForCurrentPlayer,
  playCard,
  resolveWild4Challenge,
  RootState
} from "../state/gameStore";
import { chooseAiMove } from "../utils/aiEngine";
import { getCommentaryLine, shouldTriggerCommentary } from "../utils/commentarySystem";
import { getPlayableCards } from "../utils/gameLogic";
import { Card, CommentaryTrigger } from "../types/game";

const humanId = "human";

export const GameScreen: React.FC = () => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game);
  const [commentaryVisible, setCommentaryVisible] = useState(false);
  const [commentaryNpcId, setCommentaryNpcId] = useState<number | null>(null);
  const [commentaryText, setCommentaryText] = useState("");
  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commentaryCooldown = useRef(0);

  const currentPlayer = game.players[game.currentPlayerIndex];
  const topCard = game.discardPile[game.discardPile.length - 1];
  const human = game.players.find((p) => p.id === humanId)!;
  const playableCards = useMemo(() => getPlayableCards(human, topCard, game.currentColor), [human, topCard, game.currentColor]);
  const playableIds = useMemo(() => new Set(playableCards.map((c) => c.id)), [playableCards]);

  const pushCommentary = (npcId: number, trigger: CommentaryTrigger, force = false) => {
    const now = Date.now();
    if (now < commentaryCooldown.current) return;
    if (!force && !shouldTriggerCommentary(trigger)) return;
    const npc = NPC_CHARACTERS.find((n) => n.id === npcId);
    if (!npc) return;
    setCommentaryNpcId(npcId);
    setCommentaryText(getCommentaryLine(npc.personality, trigger));
    setCommentaryVisible(true);
    commentaryCooldown.current = now + 3800;
    setTimeout(() => setCommentaryVisible(false), 3200);
  };

  useEffect(() => {
    if (game.winnerId) {
      if (game.winnerId === humanId) pushCommentary(1, "playerWin", true);
      else {
        const winner = game.players.find((p) => p.id === game.winnerId);
        if (winner?.npcId) pushCommentary(winner.npcId, "npcWin", true);
      }
    }
  }, [game.players, game.winnerId]);

  useEffect(() => {
    if (human.hand.length === 1 && !human.saidUno && currentPlayer.id !== humanId) {
      const id = setTimeout(() => {
        if (Math.random() < 0.65) dispatch(catchUno({ playerId: humanId }));
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [currentPlayer.id, dispatch, human.hand.length, human.saidUno]);

  useEffect(() => {
    if (!game.pendingEffect || game.pendingEffect.targetPlayerId !== humanId) return;
    const source = game.players.find((p) => p.id === game.pendingEffect?.sourcePlayerId);
    if (!source?.npcId) return;
    if (game.pendingEffect.type === "draw") pushCommentary(source.npcId, "playerHitDraw");
    if (game.pendingEffect.type === "skip") pushCommentary(source.npcId, "playerHitSkip");
  }, [game.pendingEffect, game.players, humanId]);

  useEffect(() => {
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    if (currentPlayer.id !== humanId || game.rewardModalVisible || game.pendingEffect) return;
    thinkTimer.current = setTimeout(() => {
      const npcId = [1, 2, 3][Math.floor(Math.random() * 3)];
      pushCommentary(npcId, "playerThinking");
    }, 8000);
    return () => {
      if (thinkTimer.current) clearTimeout(thinkTimer.current);
    };
  }, [currentPlayer.id, game.pendingEffect, game.rewardModalVisible]);

  useEffect(() => {
    if (currentPlayer.kind !== "npc" || game.winnerId || game.pendingEffect || game.rewardModalVisible) return;

    const turnDelay = currentPlayer.difficulty === "easy" ? 2300 : currentPlayer.difficulty === "medium" ? 1800 : 1500;
    const id = setTimeout(async () => {
      const move = chooseAiMove({
        self: currentPlayer,
        allPlayers: game.players,
        topCard,
        currentColor: game.currentColor,
        humanCardsLeft: human.hand.length
      });

      if (move.action === "draw") {
        dispatch(drawForCurrentPlayer());
        return;
      }

      dispatch(
        playCard({
          playerId: currentPlayer.id,
          cardId: move.cardId!,
          chosenColor: move.selectedColor
        })
      );

      const selected = currentPlayer.hand.find((c) => c.id === move.cardId);
      if (currentPlayer.npcId && selected?.type === "reverse") pushCommentary(currentPlayer.npcId, "reversePlayed");
      if (currentPlayer.npcId && selected?.type === "wild4") pushCommentary(currentPlayer.npcId, "wild4Played");
      if (currentPlayer.npcId && currentPlayer.hand.length === 2) pushCommentary(currentPlayer.npcId, "npcUno");
      if (currentPlayer.npcId && Math.random() < 0.3) pushCommentary(currentPlayer.npcId, "social");
    }, turnDelay);

    return () => clearTimeout(id);
  }, [
    currentPlayer,
    dispatch,
    game.currentColor,
    game.pendingEffect,
    game.players,
    game.rewardModalVisible,
    game.winnerId,
    human.hand.length,
    topCard
  ]);

  const runHaptic = async (type: "impact" | "selection") => {
    if (Platform.OS === "web" || !game.settings.hapticsEnabled) return;
    try {
      if (type === "impact") await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      else await Haptics.selectionAsync();
    } catch {
      // Ignore unsupported haptic runtimes.
    }
  };

  const onPlayCard = async (card: Card) => {
    if (currentPlayer.id !== humanId) return;
    if (!playableIds.has(card.id)) return;
    await runHaptic("impact");

    let chosenColor = card.color;
    if (card.type === "wild" || card.type === "wild4") {
      const counts = { red: 0, blue: 0, green: 0, yellow: 0 };
      human.hand.forEach((c) => {
        if (c.color !== "wild") counts[c.color] += 1;
      });
      chosenColor = (Object.keys(counts).sort((a, b) => counts[b as keyof typeof counts] - counts[a as keyof typeof counts])[0] as typeof chosenColor) || "red";
    }

    dispatch(playCard({ playerId: humanId, cardId: card.id, chosenColor }));

    if (card.type === "reverse") pushCommentary([1, 2, 3][Math.floor(Math.random() * 3)], "reversePlayed");
    if (card.type === "wild4") pushCommentary([1, 2, 3][Math.floor(Math.random() * 3)], "wild4Played");
    if (human.hand.length === 2) pushCommentary(2, "playerUno");
  };

  const onDraw = async () => {
    if (currentPlayer.id !== humanId) return;
    await runHaptic("selection");
    dispatch(drawForCurrentPlayer());
  };

  const canHumanAct = currentPlayer.id === humanId && !game.winnerId && !game.rewardModalVisible && !game.pendingEffect;

  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <View style={styles.tableShadow} />
        <View style={styles.tableSurface}>
          <View style={styles.tableEdge} />
          <View style={styles.topRow}>
            <NPCPlayer player={game.players[1]} isActive={currentPlayer.id === game.players[1].id} />
            <NPCPlayer player={game.players[2]} isActive={currentPlayer.id === game.players[2].id} />
            <NPCPlayer player={game.players[3]} isActive={currentPlayer.id === game.players[3].id} />
          </View>

          <TurnIndicator currentPlayerName={currentPlayer.name} direction={game.direction} />

          <View style={styles.centerPiles}>
            <DrawPile remaining={game.drawPile.length} onPress={onDraw} disabled={!canHumanAct} />
            <DiscardPile topCard={topCard} currentColor={game.currentColor} />
          </View>

          {human.hand.length === 1 && !human.saidUno && (
            <Pressable style={styles.unoButton} onPress={() => dispatch(callUno({ playerId: humanId }))}>
              <Text style={styles.unoText}>CALL UNO</Text>
            </Pressable>
          )}

          {game.pendingEffect?.challengeable && game.currentPlayerIndex === 0 && !game.rewardModalVisible && (
            <View style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>Wild Draw 4 Challenge?</Text>
              <View style={styles.challengeRow}>
                <Pressable style={styles.challengeBtn} onPress={() => dispatch(resolveWild4Challenge({ challenge: true }))}>
                  <Text style={styles.challengeTxt}>Challenge</Text>
                </Pressable>
                <Pressable style={styles.challengeBtnAlt} onPress={() => dispatch(resolveWild4Challenge({ challenge: false }))}>
                  <Text style={styles.challengeTxt}>Take Draw</Text>
                </Pressable>
              </View>
            </View>
          )}

        </View>

        <View style={styles.handDock}>
          <PlayerHand cards={human.hand} playableIds={playableIds} onCardPress={onPlayCard} />
        </View>
      </View>

      <RewardVideoModal
        visible={game.rewardModalVisible}
        adVisible={game.adModalVisible}
        onWatch={() => dispatch(blockPenaltyWithReward())}
        onAccept={() => {
          if (game.pendingEffect?.challengeable) {
            const doChallenge = window.confirm(
              "Wild Draw 4 — You can still challenge after declining the ad.\n\nPress OK to Challenge, Cancel to Accept Penalty."
            );
            if (doChallenge) {
              dispatch(resolveWild4Challenge({ challenge: true }));
            } else {
              dispatch(acceptPenalty());
            }
          } else {
            dispatch(acceptPenalty());
          }
        }}
        onAdDone={() => {
          dispatch(completeRewardAd());
          window.alert("Penalty blocked! Reward completed. Penalty canceled.");
        }}
      />

      <CommentaryModal visible={commentaryVisible} npcId={commentaryNpcId} text={commentaryText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111f",
    paddingTop: Platform.OS === "web" ? 20 : 46,
    paddingBottom: 0,
    alignItems: "center"
  },
  board: {
    width: "100%",
    maxWidth: 980,
    flex: 1,
    paddingHorizontal: 10
  },
  tableShadow: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 64,
    bottom: 130,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 }
  },
  tableSurface: {
    flex: 1,
    borderRadius: 24,
    marginHorizontal: 4,
    marginBottom: 8,
    marginTop: 4,
    backgroundColor: "#0b5d3f",
    borderWidth: 3,
    borderColor: "#5a3a23",
    overflow: "hidden",
    justifyContent: "space-evenly"
  },
  tableEdge: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  centerPiles: {
    alignSelf: "center",
    width: 244,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 0
  },
  unoButton: {
    alignSelf: "center",
    backgroundColor: "#E53935",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10
  },
  unoText: {
    color: "#fff",
    fontWeight: "900"
  },
  challengeCard: {
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 12
  },
  challengeTitle: {
    color: "#fff",
    fontWeight: "800"
  },
  challengeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  challengeBtn: {
    flex: 1,
    backgroundColor: "#00C853",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  challengeBtnAlt: {
    flex: 1,
    backgroundColor: "#F4511E",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  challengeTxt: {
    color: "#fff",
    fontWeight: "800"
  },
  handDock: {
    width: "100%",
    marginTop: "auto",
    marginBottom: Platform.OS === "web" ? 8 : 0
  }
});

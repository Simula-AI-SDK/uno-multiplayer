import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardColor, GameState, Player } from "../types/game";
import { buildInitialState, drawFromPile, isPlayableCard, nextPlayerIndex } from "../utils/gameLogic";

type PlayCardPayload = {
  playerId: string;
  cardId: string;
  chosenColor?: CardColor;
};

const applyDrawToPlayer = (state: GameState, player: Player, amount: number) => {
  const draw = drawFromPile(state, amount);
  state.drawPile = draw.drawPile;
  state.discardPile = draw.discardPile;
  player.hand.push(...draw.cards);
};

const moveToNextActivePlayer = (state: GameState) => {
  state.currentPlayerIndex = nextPlayerIndex(state);
  state.turnCount += 1;
};

const gameSlice = createSlice({
  name: "game",
  initialState: buildInitialState(),
  reducers: {
    startNewGame: (state) => {
      const stats = state.stats;
      const settings = state.settings;
      const next = buildInitialState();
      next.stats = stats;
      next.settings = settings;
      return next;
    },
    toggleSetting: (state, action: PayloadAction<keyof GameState["settings"]>) => {
      const key = action.payload;
      state.settings[key] = !state.settings[key];
    },
    callUno: (state, action: PayloadAction<{ playerId: string }>) => {
      const player = state.players.find((p) => p.id === action.payload.playerId);
      if (!player) return;
      if (player.hand.length === 1) player.saidUno = true;
    },
    catchUno: (state, action: PayloadAction<{ playerId: string }>) => {
      const player = state.players.find((p) => p.id === action.payload.playerId);
      if (!player || player.hand.length !== 1 || player.saidUno) return;
      applyDrawToPlayer(state, player, 2);
      player.saidUno = false;
    },
    drawForCurrentPlayer: (state) => {
      if (state.winnerId || state.rewardModalVisible || state.pendingEffect) return;
      const player = state.players[state.currentPlayerIndex];
      if (!player) return;
      applyDrawToPlayer(state, player, 1);
      player.saidUno = false;
      moveToNextActivePlayer(state);
    },
    playCard: (state, action: PayloadAction<PlayCardPayload>) => {
      if (state.winnerId || state.rewardModalVisible || state.pendingEffect) return;
      const { playerId, cardId, chosenColor } = action.payload;
      const player = state.players[state.currentPlayerIndex];
      if (!player || player.id !== playerId) return;

      const topCard = state.discardPile[state.discardPile.length - 1];
      const cardIdx = player.hand.findIndex((card) => card.id === cardId);
      if (cardIdx < 0) return;
      const card = player.hand[cardIdx];
      if (!isPlayableCard(card, topCard, state.currentColor)) return;

      const colorMatchInHand = player.hand.some((c, idx) => idx !== cardIdx && c.color === state.currentColor && c.color !== "wild");
      if (card.type === "wild4" && colorMatchInHand) {
        // Illegal under official rules, but still playable; challenge can punish this.
      }

      player.hand.splice(cardIdx, 1);
      player.saidUno = player.hand.length === 1 ? player.saidUno : false;
      state.discardPile.push(card);
      state.currentColor = card.color === "wild" ? chosenColor ?? "red" : card.color;
      state.lastWild4CardId = card.type === "wild4" ? card.id : null;

      if (player.hand.length === 0) {
        state.winnerId = player.id;
        state.resultsVisible = true;
        state.stats.gamesPlayed += 1;
        if (player.kind === "human") state.stats.humanWins += 1;
        return;
      }

      if (card.type === "reverse") state.direction = state.direction === 1 ? -1 : 1;

      if (card.type === "draw2" || card.type === "skip" || card.type === "wild4") {
        const targetIndex = nextPlayerIndex(state);
        const target = state.players[targetIndex];
        const effectType = card.type === "skip" ? "skip" : "draw";
        const effectAmount = card.type === "draw2" ? 2 : card.type === "wild4" ? 4 : 0;

        const rewardEligible =
          target.kind === "human" &&
          state.rewardUsedCount < 1 &&
          state.turnCount >= state.rewardCooldownUntilTurn &&
          (card.type === "draw2" || card.type === "wild4" || card.type === "skip");

        if (rewardEligible || (target.kind === "human" && card.type === "wild4")) {
          state.currentPlayerIndex = targetIndex;
          state.pendingEffect = {
            type: effectType,
            amount: effectAmount,
            targetPlayerId: target.id,
            sourceCardId: card.id,
            sourcePlayerId: player.id,
            challengeable: card.type === "wild4",
            illegalWild4: card.type === "wild4" ? colorMatchInHand : false
          };
          state.wild4ChallengeWindow = card.type === "wild4";
          state.rewardModalVisible = rewardEligible;
          return;
        }

        if (effectType === "draw") applyDrawToPlayer(state, target, effectAmount);
        moveToNextActivePlayer(state);
        return;
      }

      moveToNextActivePlayer(state);
    },
    resolveWild4Challenge: (state, action: PayloadAction<{ challenge: boolean }>) => {
      const pending = state.pendingEffect;
      if (!pending || !pending.challengeable || !pending.sourcePlayerId) return;
      const target = state.players.find((p) => p.id === pending.targetPlayerId);
      const source = state.players.find((p) => p.id === pending.sourcePlayerId);
      if (!target || !source) return;

      state.wild4ChallengeWindow = false;

      if (!action.payload.challenge) {
        applyDrawToPlayer(state, target, 4);
      } else if (pending.illegalWild4) {
        applyDrawToPlayer(state, source, 4);
      } else {
        applyDrawToPlayer(state, target, 6);
      }

      state.pendingEffect = null;
      state.rewardModalVisible = false;
      moveToNextActivePlayer(state);
    },
    acceptPenalty: (state) => {
      const pending = state.pendingEffect;
      if (!pending) return;
      const target = state.players.find((p) => p.id === pending.targetPlayerId);
      if (!target) return;

      if (pending.type === "draw") applyDrawToPlayer(state, target, pending.amount ?? 0);
      state.pendingEffect = null;
      state.rewardModalVisible = false;
      state.wild4ChallengeWindow = false;
      moveToNextActivePlayer(state);
    },
    blockPenaltyWithReward: (state) => {
      if (!state.pendingEffect) return;
      state.adModalVisible = true;
      state.rewardModalVisible = false;
    },
    completeRewardAd: (state) => {
      if (!state.pendingEffect) return;
      state.pendingEffect = null;
      state.adModalVisible = false;
      state.wild4ChallengeWindow = false;
      state.rewardUsedCount += 1;
      state.rewardCooldownUntilTurn = state.turnCount + 3;
      moveToNextActivePlayer(state);
    },
    setResultsVisible: (state, action: PayloadAction<boolean>) => {
      state.resultsVisible = action.payload;
    }
  }
});

export const {
  startNewGame,
  toggleSetting,
  callUno,
  catchUno,
  drawForCurrentPlayer,
  playCard,
  resolveWild4Challenge,
  acceptPenalty,
  blockPenaltyWithReward,
  completeRewardAd,
  setResultsVisible
} = gameSlice.actions;

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

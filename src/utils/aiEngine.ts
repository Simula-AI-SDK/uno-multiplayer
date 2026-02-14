import { Card, CardColor, Difficulty, Player } from "../types/game";
import { cardPoints, getPlayableCards, hasColorMatchInHand } from "./gameLogic";

export interface AiTurnInput {
  self: Player;
  allPlayers: Player[];
  topCard: Card;
  currentColor: CardColor;
  humanCardsLeft: number;
}

export interface AiTurnOutput {
  action: "play" | "draw";
  cardId?: string;
  selectedColor?: CardColor;
}

const pickWildColor = (hand: Card[]): CardColor => {
  const colorCounts: Record<CardColor, number> = { red: 0, blue: 0, green: 0, yellow: 0, wild: 0 };
  hand.forEach((card) => {
    if (card.color !== "wild") colorCounts[card.color] += 1;
  });
  const sorted = (["red", "blue", "green", "yellow"] as CardColor[]).sort((a, b) => colorCounts[b] - colorCounts[a]);
  return sorted[0] ?? "red";
};

const baseCardScore = (card: Card): number => {
  let score = cardPoints(card);
  if (card.type === "wild4") score += 30;
  if (card.type === "draw2") score += 18;
  if (card.type === "skip" || card.type === "reverse") score += 12;
  return score;
};

const strategicCardScore = (card: Card, input: AiTurnInput): number => {
  const humanThreat = input.humanCardsLeft <= 2 ? 40 : input.humanCardsLeft <= 4 ? 20 : 0;
  let score = baseCardScore(card);

  if (humanThreat > 0 && (card.type === "draw2" || card.type === "skip" || card.type === "wild4")) {
    score += humanThreat;
  }

  if (card.type === "wild4" && hasColorMatchInHand(input.self.hand, input.currentColor)) {
    score -= 40;
  }

  if (input.self.hand.length <= 3 && (card.type === "wild" || card.type === "wild4")) {
    score += 20;
  }

  return score;
};

const easyPick = (cards: Card[]): Card => cards[Math.floor(Math.random() * cards.length)];

const mediumPick = (cards: Card[], input: AiTurnInput): Card =>
  [...cards].sort((a, b) => strategicCardScore(b, input) - strategicCardScore(a, input))[0];

const hardPick = (cards: Card[], input: AiTurnInput): Card => {
  const scored = cards
    .map((card) => ({ card, score: strategicCardScore(card, input) }))
    .sort((a, b) => b.score - a.score);
  return scored[0].card;
};

export const chooseAiMove = (input: AiTurnInput): AiTurnOutput => {
  const playable = getPlayableCards(input.self, input.topCard, input.currentColor);
  if (!playable.length) return { action: "draw" };

  const diff: Difficulty = input.self.difficulty ?? "easy";
  const selected =
    diff === "easy" ? easyPick(playable) : diff === "medium" ? mediumPick(playable, input) : hardPick(playable, input);

  return {
    action: "play",
    cardId: selected.id,
    selectedColor: selected.type === "wild" || selected.type === "wild4" ? pickWildColor(input.self.hand) : selected.color
  };
};

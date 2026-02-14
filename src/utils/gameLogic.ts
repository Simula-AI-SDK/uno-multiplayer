import { Card, CardColor, CardType, GameState, Player } from "../types/game";

const COLORS: CardColor[] = ["red", "blue", "green", "yellow"];
const ACTION_TYPES: CardType[] = ["skip", "reverse", "draw2"];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const color of COLORS) {
    deck.push({ id: uid(), color, type: "number", value: 0 });
    for (let n = 1; n <= 9; n += 1) {
      deck.push({ id: uid(), color, type: "number", value: n });
      deck.push({ id: uid(), color, type: "number", value: n });
    }
    for (const type of ACTION_TYPES) {
      deck.push({ id: uid(), color, type });
      deck.push({ id: uid(), color, type });
    }
  }
  for (let i = 0; i < 4; i += 1) {
    deck.push({ id: uid(), color: "wild", type: "wild" });
    deck.push({ id: uid(), color: "wild", type: "wild4" });
  }
  return deck;
};

export const shuffle = <T>(arr: T[]): T[] => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const cardLabel = (card: Card): string => {
  if (card.type === "number") return `${card.value}`;
  if (card.type === "draw2") return "+2";
  if (card.type === "wild4") return "W+4";
  if (card.type === "wild") return "W";
  return card.type.toUpperCase();
};

export const cardPoints = (card: Card): number => {
  if (card.type === "number") return card.value ?? 0;
  if (card.type === "wild" || card.type === "wild4") return 50;
  return 20;
};

export const isPlayableCard = (card: Card, topCard: Card, currentColor: CardColor): boolean => {
  if (card.type === "wild" || card.type === "wild4") return true;
  if (card.color === currentColor) return true;
  if (topCard.type === "number" && card.type === "number") return card.value === topCard.value;
  return card.type === topCard.type;
};

export const hasColorMatchInHand = (hand: Card[], color: CardColor): boolean => {
  if (color === "wild") return false;
  return hand.some((c) => c.color === color && c.type !== "wild" && c.type !== "wild4");
};

export const nextPlayerIndex = (state: Pick<GameState, "players" | "currentPlayerIndex" | "direction">): number => {
  const count = state.players.length;
  return (state.currentPlayerIndex + state.direction + count) % count;
};

export const getPlayableCards = (player: Player, topCard: Card, currentColor: CardColor): Card[] =>
  player.hand.filter((card) => isPlayableCard(card, topCard, currentColor));

export const drawFromPile = (state: Pick<GameState, "drawPile" | "discardPile">, amount: number): { cards: Card[]; drawPile: Card[]; discardPile: Card[] } => {
  let drawPile = [...state.drawPile];
  let discardPile = [...state.discardPile];
  const cards: Card[] = [];

  for (let i = 0; i < amount; i += 1) {
    if (drawPile.length === 0) {
      const topCard = discardPile[discardPile.length - 1];
      const recyclable = discardPile.slice(0, -1);
      drawPile = shuffle(recyclable);
      discardPile = topCard ? [topCard] : [];
    }
    const next = drawPile.shift();
    if (!next) break;
    cards.push(next);
  }

  return { cards, drawPile, discardPile };
};

export const buildInitialState = (): GameState => {
  const players: Player[] = [
    { id: "human", kind: "human", name: "You", hand: [], saidUno: false },
    { id: "npc-1", kind: "npc", name: "Tank", hand: [], difficulty: "easy", npcId: 1, saidUno: false },
    { id: "npc-2", kind: "npc", name: "Mimi", hand: [], difficulty: "medium", npcId: 2, saidUno: false },
    { id: "npc-3", kind: "npc", name: "Capybara", hand: [], difficulty: "hard", npcId: 3, saidUno: false }
  ];

  let drawPile = shuffle(createDeck());
  for (const player of players) {
    player.hand = drawPile.splice(0, 7);
  }

  let first = drawPile.shift()!;
  while (first.type === "wild4") {
    drawPile.push(first);
    drawPile = shuffle(drawPile);
    first = drawPile.shift()!;
  }

  return {
    players,
    drawPile,
    discardPile: [first],
    currentPlayerIndex: 0,
    direction: 1,
    currentColor: first.color === "wild" ? "red" : first.color,
    winnerId: null,
    turnCount: 1,
    pendingEffect: null,
    wild4ChallengeWindow: false,
    lastWild4CardId: null,
    rewardCooldownUntilTurn: 0,
    rewardUsedCount: 0,
    rewardModalVisible: false,
    adModalVisible: false,
    resultsVisible: false,
    stats: {
      gamesPlayed: 0,
      humanWins: 0
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true
    }
  };
};

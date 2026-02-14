export type CardColor = "red" | "blue" | "green" | "yellow" | "wild";
export type CardType = "number" | "skip" | "reverse" | "draw2" | "wild" | "wild4";
export type Difficulty = "easy" | "medium" | "hard";
export type PlayerKind = "human" | "npc";

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

export interface Player {
  id: string;
  kind: PlayerKind;
  name: string;
  hand: Card[];
  difficulty?: Difficulty;
  npcId?: number;
  saidUno: boolean;
}

export interface PendingEffect {
  type: "draw" | "skip";
  targetPlayerId: string;
  amount?: number;
  sourceCardId?: string;
  sourcePlayerId?: string;
  challengeable?: boolean;
  illegalWild4?: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  humanWins: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface GameState {
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  currentColor: CardColor;
  winnerId: string | null;
  turnCount: number;
  pendingEffect: PendingEffect | null;
  wild4ChallengeWindow: boolean;
  lastWild4CardId: string | null;
  rewardCooldownUntilTurn: number;
  rewardUsedCount: number;
  rewardModalVisible: boolean;
  adModalVisible: boolean;
  resultsVisible: boolean;
  stats: GameStats;
  settings: GameSettings;
}

export type CommentaryTrigger =
  | "playerHitDraw"
  | "playerHitSkip"
  | "playerUno"
  | "npcUno"
  | "reversePlayed"
  | "wild4Played"
  | "playerWin"
  | "npcWin"
  | "social"
  | "playerThinking";

export interface CommentaryItem {
  id: string;
  npcId: number;
  text: string;
  trigger: CommentaryTrigger;
}

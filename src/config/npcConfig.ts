export type NpcPersonality = "confident" | "flirty" | "friendly";

export interface NpcCharacter {
  id: number;
  name: string;
  personality: NpcPersonality;
  avatarSource: number;
  portraitSource: number;
}

export const NPC_CHARACTERS: NpcCharacter[] = [
  {
    id: 1,
    name: "Tank",
    personality: "confident",
    avatarSource: require("../assets/npcs/capybara.jpg"),
    portraitSource: require("../assets/npcs/capybara.jpg")
  },
  {
    id: 2,
    name: "Mimi",
    personality: "flirty",
    avatarSource: require("../assets/npcs/tank.png"),
    portraitSource: require("../assets/npcs/tank.png")
  },
  {
    id: 3,
    name: "Capybara",
    personality: "friendly",
    avatarSource: require("../assets/npcs/mimi.png"),
    portraitSource: require("../assets/npcs/mimi.png")
  }
];

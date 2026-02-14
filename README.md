# UNO Mini Game (React Native + TypeScript)

Production-oriented mobile UNO mini game scaffold with:
- 1 human + 3 NPC players
- Classic UNO deck/rules core
- AI difficulty tiers (easy, medium, hard)
- Wild Draw 4 challenge flow
- UNO call + catch penalty
- Reward ad "Watch to Block" penalty system
- NPC commentary modal with center-stage portrait presentation

## Run

```bash
npm install
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator

## Run on Web

```bash
npm run web
```

Then open:
- `http://localhost:8081` (or the port shown in terminal)

## NPC Assets

Put NPC image files in:
- `src/assets/npcs/`

Default expected names:
- `npc1_avatar.png`, `npc1_portrait.png`
- `npc2_avatar.png`, `npc2_portrait.png`
- `npc3_avatar.png`, `npc3_portrait.png`

Update `src/config/npcConfig.ts` paths if your file names differ.

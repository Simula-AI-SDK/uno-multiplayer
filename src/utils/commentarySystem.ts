import { NpcPersonality } from "../config/npcConfig";
import { CommentaryTrigger } from "../types/game";

const LINES: Record<NpcPersonality, Record<CommentaryTrigger, string[]>> = {
  confident: {
    playerHitDraw: ["Yikes, that hand got heavy 😏🃏", "Oof, that's rough for you 😬", "Yeah... that slows you down real quick 😎"],
    playerHitSkip: ["And you're skipped. Sit tight 😌⏭️", "No turn for you, that's tough 😬", "Momentum? Mine now 🔥"],
    playerUno: ["One card? Don't fold now 👀", "Okay okay, close... but not enough 😏", "Pressure looks good on you tbh 😎"],
    npcUno: ["UNO. Endgame mode activated 😎🔥", "One card left. Lock in 🎯", "You're in trouble now, be real 👀"],
    reversePlayed: ["UNO reverse, classic 😌🔄", "Plot twist. We're spinning it back 🔄", "Reverse at the perfect time, wow 😎"],
    wild4Played: ["W+4 is nasty work 😮‍💨🃏", "No mercy. None. 😈", "Yeah that's brutal, not gonna lie 😬"],
    playerWin: ["Beginner's luck... maybe 🙃", "Okay, respect. This round was yours 👏", "Enjoy it while it lasts 😏"],
    npcWin: ["Too easy 😎🏆", "Called it. GG 😌", "Clean win. Next. 🔥"],
    social: ["This lobby is kinda elite 😎", "You're keeping it interesting, I'll give you that 👏", "Good energy at this table ⚡"],
    playerThinking: ["Take your time, I'm chillin' 😌", "Need a timeout? Kidding 😅", "Clock is ticking though... ⏳"]
  },
  flirty: {
    playerHitDraw: ["Sorry not sorry 😘🃏", "Aww, bonus cards for you cutie 💋", "Don't be mad, it looked good on me 😏✨"],
    playerHitSkip: ["Sit this one out, babe 💋⏭️", "Skip turn. That's awkward 😬", "No move for you... tragic honestly 😘"],
    playerUno: ["One card? Okayyy spicy 👀🔥", "Wait you're actually close... 😳", "Don't choke at the finish line 😉"],
    npcUno: ["UNO, babe. Can you stop me? ✨", "One card left and I look good doing it 😘", "Catch me if you can 😏"],
    reversePlayed: ["Reverse? The dramaaa 💅🔄", "Plot twist and I love it 😍", "UNO reverse is always iconic ✨"],
    wild4Played: ["W+4? That's evil... I love it 😈🃏", "No mercy tonight 💋", "That was kinda savage ngl 😏"],
    playerWin: ["Okayyyy, you ate that 👏", "Impressive... this time 😌", "Fine. You looked good winning 😘"],
    npcWin: ["Better luck next time, cutie 😘", "I make winning look effortless ✨", "Another W for me, period 💅"],
    social: ["You're actually good at this 😍", "This is low-key so fun 😂", "Vibes are immaculate rn ✨"],
    playerThinking: ["No rush, I'm not going anywhere 😉", "Hello? You still with us? 😅", "Think it through, I can wait 💭"]
  },
  friendly: {
    playerHitDraw: ["Aw man, tough draw 😬🃏", "That's rough, but you're still in it 💪", "You'll bounce back, promise 🙂"],
    playerHitSkip: ["Skip turn, sorry friend! ⏭️", "No move this round 😅", "You'll be back in right after this 🙌"],
    playerUno: ["Whoa, one card left! 👀", "You're sooo close! 🔥", "Big moment, let's go! 🎉"],
    npcUno: ["UNO! One card left for me 😄", "Okay this is getting intense 😆", "Can you stop me in time? 👀"],
    reversePlayed: ["Reverse! Nice one 🔄", "Everything just flipped lol 😂", "Great timing on that reverse 👏"],
    wild4Played: ["Oof, W+4 is rough 😵🃏", "Huge swing right there 😮", "That one definitely hurt 😬"],
    playerWin: ["GG! You earned that 🎉👏", "Nice win, that was awesome 😄", "Well played fr 💯"],
    npcWin: ["GG! That was fun 😄", "I got this one, rematch? 🙌", "Great game either way 🤝"],
    social: ["This is honestly so fun 😄", "Love the competition here 🔥", "You're playing really well btw 👏"],
    playerThinking: ["No rush, take your time 🙂", "Big brain moment, I see 🧠", "You got this! 💪"]
  }
};

const TRIGGER_CHANCE: Record<CommentaryTrigger, number> = {
  playerHitDraw: 0.7,
  playerHitSkip: 0.7,
  playerUno: 0.75,
  npcUno: 0.75,
  reversePlayed: 0.65,
  wild4Played: 0.75,
  playerWin: 1,
  npcWin: 1,
  social: 0.45,
  playerThinking: 0.55
};

export const shouldTriggerCommentary = (trigger: CommentaryTrigger): boolean => Math.random() < TRIGGER_CHANCE[trigger];

export const getCommentaryLine = (personality: NpcPersonality, trigger: CommentaryTrigger): string => {
  const pool = LINES[personality][trigger];
  return pool[Math.floor(Math.random() * pool.length)];
};

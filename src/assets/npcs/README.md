Place provided NPC image assets in this folder.

Expected filenames:
- `tank.png`
- `mimi.png`
- `capybara.jpg`

These are wired in `src/config/npcConfig.ts` via `require(...)` so they work on web and mobile.

If you replace them with new files, update the corresponding `avatarSource` and `portraitSource` entries.

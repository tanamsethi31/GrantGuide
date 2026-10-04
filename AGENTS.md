# AGENTS.md

## Project context

GrantGuide is a React + Vite app that helps people in Ireland find grants and supports they may be owed. Start with `README.md` for setup.

The UI deliberately follows an Airbnb-style layout (white/grey palette, rounded photo cards, round header controls). Keep it simple: many users are older or not confident online, so favour plain English and clear tap targets over new UI patterns.

## Key files

- `src/index.css`: base tokens, DM Sans, 17px root size (one step up from 16px). Components use the original Airbnb hexes (`#222222`, `#717171`, `#dddddd`, `#f7f7f7`) with green `#15803D` (hover `#166534`) as the accent.
- `src/data/catalogue/`: scheme and source snapshots exported from Notion (the master copy). Don't hand-edit amounts or rules; fix them in Notion and re-export. `src/data/grants.js` maps them for the UI.
- `src/lib/searchGrants.js`: local search and matching.
- `src/hooks/useSaved.js`, `src/lib/localStore.js`: browser-only storage until accounts exist.

## Working notes

- `npm run dev` to run, `npm run build` and `npm run lint` before finishing a change.
- Never commit `.env` files or secrets.

# AGENTS.md

## Project context

GrantGuide is a React + Vite app that helps people in Ireland find grants and supports they may be owed. Start with `README.md` for setup.

Many users are older or not confident online, so the UI favours large text (18px root), plain English, high contrast and big tap targets. Keep it that way.

## Key files

- `src/index.css`: design tokens (green primary, Atkinson Hyperlegible font, 18px root size). Use the token classes (`bg-primary`, `text-muted-foreground`, `border-border`...) rather than hex colours.
- `src/data/catalogue/`: scheme and source snapshots exported from Notion (the master copy). Don't hand-edit amounts or rules; fix them in Notion and re-export. `src/data/grants.js` maps them for the UI.
- `src/lib/searchGrants.js`: local search and matching.
- `src/hooks/useSaved.js`, `src/lib/localStore.js`: browser-only storage until accounts exist.

## Working notes

- `npm run dev` to run, `npm run build` and `npm run lint` before finishing a change.
- Never commit `.env` files or secrets.

# GrantGuide

GrantGuide helps people in Ireland find the grants and supports they may be owed, and how to apply for them.

It's a React app built with Vite, Tailwind CSS and shadcn/ui. There's no backend yet:

- **Grants** come from a catalogue snapshot exported from Notion (`src/data/catalogue/`, 64 schemes checked against official sources), searched in the browser (`src/lib/searchGrants.js`). See `src/data/catalogue/README.md` for how to refresh it.
- **Saved grants and profile details** are kept in the browser's local storage. There are no accounts yet.

## Run locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:5173
```

## Other commands

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run lint     # ESLint
```

## Where things are

| Path | What it is |
| --- | --- |
| `src/pages/` | Home, Search, Saved and Profile pages |
| `src/components/search/` | The question box (type or speak) and the filters under it |
| `src/components/supports/` | Grant cards and the details pop-up |
| `src/data/catalogue/` | Scheme and official-source snapshots from Notion |
| `src/data/grants.js` | Maps the catalogue into what the UI shows |
| `src/index.css` | Colours, font and text size (the design tokens) |

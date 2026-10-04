# Grants catalogue snapshot

These files are exported from the team's Notion workspace ("Irish Supports Observatory | Official Sources & Schemes"). The website reads them directly.

| File | Notion database | What's in it |
| --- | --- | --- |
| `schemes.json` | Schemes & Benefits Catalogue | 64 schemes: amounts, eligibility summary, who runs it, status, deadline, official and apply links, last-checked date, verification status |
| `sources.json` | Official Source Register | 85 official sources (31 councils, departments, national agencies, portals) with coverage notes and crawl permissions |

Each file has a `meta` block with the Notion database link and the export date. Notion is the master copy: make corrections there, not in these files.

## How the app uses it

- `src/data/grants.js` maps each scheme to the UI shape. Council-specific schemes get a county from their `area`; national schemes apply everywhere.
- Closed rounds stay visible with a "Closed" badge and sink to the bottom of results. Schemes with `verification` other than "Official details checked" show a "not confirmed yet" warning.
- `evidenceNote` and `notes` are research notes for the team. They are kept in the snapshot but not shown to users.
- `sources.json` is not shown in the UI yet. It is the starting point for the source-checking and crawling work in `docs/ARCHITECTURE.md`.

## Refreshing

Re-export both databases with every property (the Notion SQL export keeps the column names used here, e.g. `Scheme key` as `key`, `Amount EUR` as `amountEur`), replace the files, update `meta.exportedOn`, then run `npm run build` and spot-check a few schemes in the app.

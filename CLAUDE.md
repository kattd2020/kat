# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Plateful365 — a PWA meal planner at **plateful365.com**. 365 days × 3 meals × 5 rotating proteins (beef, pork, chicken, ground turkey, seafood). React 19 + Vite 7, plain CSS, no UI libraries. Deployed as a Cloudflare Worker with static assets.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build → dist/ (emits service worker)
npm run preview      # preview the built bundle locally
npm run lint         # eslint (ignore _vanilla_backup/ errors — they predate the current codebase)
npm run deploy       # vite build + wrangler deploy → live plateful365.com
npm run deploy:dry   # build + wrangler --dry-run (no remote push)
```

`npm run deploy` requires `CLOUDFLARE_API_TOKEN` with Workers Scripts:Edit. Either export it or prefix the command: `CLOUDFLARE_API_TOKEN=… npm run deploy`. Wrangler otherwise prompts for browser login.

## Architecture — the big picture

### Data flow

```
mealsData.js (MEALS pool)  ┐
                            ├── recipes.js ── archetype detection ──► steps, ingredients, cook info
cuts.js (classifyCut)       ┘
                            ├── getRecipeSteps(name, protein)     → step-by-step instructions
                            ├── getRecipeIngredients(name, protein) → shopping list (base 4 servings)
                            ├── getCookTime(name, protein)         → total minutes
                            ├── getMeatCookInfo(name, protein)     → oven spec + air fryer alt
                            └── scaleIngredients(list, servings)   → recalculates quantities
```

**Meal names are strings.** Ingredients and steps are NOT stored per meal — they're generated at render time by matching the meal name against archetype regexes in `src/data/recipes.js` (stir-fry, soup, sandwich, salad, mexican, breakfastSkillet, roast, grill, pasta, casserole, risotto, breaded, bowl, pancakes, avocadoToast, plus `DEFAULT_STEPS`). First regex match wins.

This means **adding a new meal often requires no code** — just add the string to `MEALS[protein][mealType]`. If the archetype match is wrong, either rename the meal so keywords route correctly, or extend the archetype's `match` regex.

### Cuts system (`src/data/cuts.js`)

`classifyCut(protein, name)` returns a cut key (e.g. `'ribeye'`, `'thigh'`, `'boston butt'`). Used in two places:

- **`ProteinRecipesModal`** — tapping a protein chip in `FilterBar` opens this modal; the cut-chip row at the top filters the recipe list by `classifyCut`.
- **`CutTag` component** — renders next to every recipe name across DayModal, ProteinRecipesModal, EventsModal, DessertsModal, and both surfaces in GroceryListModal.

When adding a cut-specific recipe, make sure its name contains a keyword `classifyCut` routes correctly (check the switch in cuts.js). Use explicit phrasing like "Chicken Thigh Cacciatore" rather than "Chicken Cacciatore" if ambiguous.

### State hub (`src/hooks/useMealPlan.js`)

Central hook for everything cross-modal. Keys in localStorage:

| Key | Purpose |
|---|---|
| `mealplanner_startdate` | Day 1 of the plan |
| `mealplanner_servings` | 1–6, default 4 — scales every ingredient list |
| `mealplanner_grocery` | Rich grocery items `[{key, title, protein?, ingredients, dayNumber?, dateLabel?}]` |
| `mealplanner_calc` | Running-tally entries for the Cost calculator |

Legacy/older-shaped data is silently filtered on load so stale localStorage can't crash the app.

`makeGroceryKey(protein, title)` is exported so all modals compute the same dedupe key. Any component can add to the grocery list via the `toggleGrocery(item)` callback threaded from `App.jsx`.

### Banner/modal structure

`BannerGrid` is a 4-tile grid above the week view. Each tile has a key that `App.jsx` maps to a modal:

| Banner | Modal | Source data |
|---|---|---|
| 💰 Cost calculator | `CostModal` | running-tally input; `costs.js` is just `formatUSD` |
| 🛒 Smart grocery lists | `GroceryListModal` | the cart + search over the full MEALS pool |
| 🎉 Event menus | `EventsModal` | `eventMenus.js` — 8 themed packs; each recipe is either a MEALS-pool ref or an inline custom entry |
| 🍰 Cheap easy desserts | `DessertsModal` | `desserts.js` — 40 inline custom recipes |

The 🛒 banner shows a live count badge keyed on `grocerySelection.length` (React `key={count}` + CSS keyframe replays the pulse on every change).

### Recipe-step rendering gotcha

`.recipe-list li` and `.pr-recipe-steps li` are CSS grid containers (`28px 1fr`). `StepText` MUST wrap its output in a single `<span className="step-text">` — if it returns a fragment, each text chunk becomes its own grid cell and the words scatter. Don't change this back to a fragment.

### Cost model

Two distinct "cost" features exist:

- **💰 Cost calculator banner** — a running-tally adding machine for the user to punch in prices as they shop. User-owned, no estimates.
- **🔥 Meat cook callout** — NOT cost-related; shows protein cook method, temp, time, and an air-fryer alternative per recipe. Rendered above the Steps heading in DayModal / ProteinRecipesModal / EventsModal.

Automatic price estimates per ingredient were shipped once and then removed. Don't re-add them without the user asking.

## Deploy pipeline

- Production is the **`plateful`** Cloudflare Worker (not `kat`, despite that Worker existing on the same account). Custom domains `plateful365.com` + `www.plateful365.com` route here.
- `worker/index.js` strips `www.` via 301 and forces `CDN-Cache-Control: no-store` on HTML, `sw.js`, and `manifest.webmanifest` so deploys go live instantly. Hashed `/assets/*` files are NOT rewritten — they can cache long-term.
- `wrangler.jsonc` has `run_worker_first: true` — this is required. Without it Workers Static Assets bypasses the fetch handler for asset matches and the Cache-Control overrides never run, causing stale HTML at the edge after every deploy.
- No `public/_redirects` — Workers Static Assets uses `not_found_handling: "single-page-application"` for SPA fallback. The Pages-style `_redirects` file triggered Cloudflare validation error 10021 ("infinite loop") when it existed.

## House rules (stable across sessions)

- React 19 + Vite only. No Next.js, no vanilla rewrites.
- No Tailwind, no CSS-in-JS. All styles go in `src/styles.css`.
- QR codes use the `qrcode` npm package (canvas API) — never the `qrcodejs` CDN script.
- Ignore `_vanilla_backup/` — it's the pre-React version, intentionally lint-error-prone and frozen. Don't touch it, and the 15 lint errors it produces are expected.
- Keep cross-cutting state in `useMealPlan.js`, not prop-drilled deep trees.
- Modals follow a consistent shape: sticky header with close button, scrollable body, `qr-actions` row at the end; on mobile (≤480px) they auto-convert to bottom sheets via styles.css.
- When adding a meal whose ingredient list needs something the archetype generator can't produce (deviled eggs, mimosas, etc.), use a custom recipe with explicit `{title, time, ingredients, steps}` — this shape is already supported in `eventMenus.js` and `desserts.js`.

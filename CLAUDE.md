# Meal Planner PWA — Project Context

## Tech Stack
- **Framework:** React 19 (JSX, functional components, hooks)
- **Build Tool:** Vite 8
- **PWA:** vite-plugin-pwa (Workbox, auto-update service worker)
- **QR Codes:** `qrcode` npm package (canvas-based, no CDN)
- **Styling:** Plain CSS (`src/styles.css`) — no Tailwind, no CSS-in-JS
- **Package Manager:** npm

## Project Purpose
365-day meal planner PWA with:
- 3 meals/day (breakfast, lunch, dinner)
- 5 protein categories: Beef, Pork, Chicken, Ground Turkey, Seafood (rotate every 5 days)
- Step-by-step recipe for every meal (archetype-based generator in `src/data/recipes.js`)
- Cost estimator (per meal / day / week / year) in `src/data/costs.js`
- QR code per day — scannable, printable, shareable via Web Share API
- Print single day or full week
- Configurable start date (saved to localStorage)
- Fully offline after first load (service worker)

## File Structure
```
src/
  App.jsx                  # Root component, week print logic
  main.jsx                 # Entry point
  styles.css               # All app CSS
  index.css                # Minimal reset
  data/
    mealsData.js           # Meal pools + generateMealPlan()
  components/
    Header.jsx
    FilterBar.jsx
    WeekNav.jsx
    DayCard.jsx
    DayModal.jsx           # QR generation, print, share, download
    SettingsModal.jsx
  hooks/
    useMealPlan.js         # All state: week nav, filter, startDate
public/
  icon.svg                 # PWA icon
vite.config.js             # Vite + VitePWA config
```

## Dev Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build (includes SW)
npm run preview  # Preview production build
```

## Rules for Claude
- Always use Vite + React for this project — do NOT suggest vanilla JS, Next.js, or other frameworks
- Keep state in `useMealPlan.js` hook
- Add new meals to `src/data/mealsData.js` MEALS object pools
- Do not add Tailwind or external UI libraries — use plain CSS in `src/styles.css`
- QR codes use the `qrcode` npm package (canvas API), not qrcodejs CDN
- The `_vanilla_backup/` folder contains the old vanilla JS version — do not restore or modify it

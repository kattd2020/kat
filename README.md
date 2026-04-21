# Plateful365

A 365-day meal planner PWA. Three meals a day, four rotating proteins
(beef, pork, chicken, ground turkey), seasonal suggestions, smart grocery
lists by protein, quick swaps, and a scannable / printable / shareable QR
code for every day.

Live at **[plateful365.com](https://plateful365.com/)**.

## Tech

- React 19 + Vite 7
- `vite-plugin-pwa` (Workbox, auto-update service worker)
- `qrcode` (canvas) for per-day QR codes
- Plain CSS (`src/styles.css`)
- Deployed on Cloudflare Pages (see `public/_redirects` for SPA fallback)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (emits dist/ with SW)
npm run preview  # preview the production build
npm run lint     # eslint
```

## Structure

```
src/
  App.jsx                  root; wires banner grid, week view, modals, footer
  hooks/useMealPlan.js     state: week nav, filter, start date, meal swaps
  data/mealsData.js        meal pools + 365-day plan generator
  components/
    Header, FilterBar, WeekNav, DayCard     core UI
    BannerGrid                               feature banners
    DayModal                                 per-day view + QR + print/share
    GroceryListModal, SeasonalModal, SwapModal   banner actions
    SettingsModal                            start-date config
```

Add new meals to the `MEALS` object in `src/data/mealsData.js`.
All styling lives in `src/styles.css` — no Tailwind or CSS-in-JS.

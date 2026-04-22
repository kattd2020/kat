// Rough US grocery estimates to sit next to each ingredient in a recipe.
// Based on typical IGA / mainstream US supermarket averages circa 2024–2025.
// Regions and sale weeks move these around — treat as ballpark, not truth.

import { BASE_SERVINGS } from './recipes'

const UNICODE_FRACTIONS = {
  '¼': 0.25, '⅓': 1 / 3, '½': 0.5, '⅔': 2 / 3, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
}

// Quick helper: parse the first leading number/fraction/range from a string.
function parseLeadingNumber(s) {
  const range = s.match(/^(\d+)\s*[-–]\s*(\d+)/)
  if (range) return (Number(range[1]) + Number(range[2])) / 2
  const mix = s.match(/^(\d+)\s*([¼⅓½⅔¾⅕⅖⅗⅘⅛⅜⅝⅞])/)
  if (mix) return Number(mix[1]) + UNICODE_FRACTIONS[mix[2]]
  const whole = s.match(/^\d+/)
  if (whole) return Number(whole[0])
  const frac = s.match(/^[¼⅓½⅔¾⅕⅖⅗⅘⅛⅜⅝⅞]/)
  if (frac) return UNICODE_FRACTIONS[frac[0]]
  return 1
}

// Matches "1 lb beef", "2-4 lb roast", "½ lb shrimp" etc. and returns lbs.
function parseLbs(line) {
  const m = line.match(/^([\d¼⅓½⅔¾⅕⅖⅗⅘⅛⅜⅝⅞]+(?:[\s-–][\d¼⅓½⅔¾⅕⅖⅗⅘⅛⅜⅝⅞]+)?)\s*lbs?\b/i)
  if (!m) return 1
  return parseLeadingNumber(m[1])
}

// Table of price estimates. First match wins, so list more specific patterns
// first. `perLb` entries scale with the line's parsed lb quantity.
const PRICES = [
  // ── Proteins (per lb) ─────────────────────────────────
  { match: /\bground\s+beef\b/i,                 perLb: true,  price: 5.50 },
  { match: /\bground\s+turkey\b/i,               perLb: true,  price: 4.50 },
  { match: /\bbeef wellington\b/i,               perLb: true,  price: 18.00 },
  { match: /\b(ribeye|prime rib|ny strip|filet mignon|tenderloin roast)\b/i, perLb: true, price: 14.00 },
  { match: /\b(brisket|short ribs|pot roast|chuck roast|stew (beef|meat))\b/i, perLb: true, price: 7.50 },
  { match: /\bsteak\b/i,                         perLb: true,  price: 11.00 },
  { match: /\bbeef\b/i,                          perLb: true,  price: 7.00 },

  { match: /\bbacon|smoked ham\b/i,              perLb: true,  price: 6.50 },
  { match: /\bpork (chops?|tenderloin|loin|shoulder)\b/i, perLb: true, price: 5.50 },
  { match: /\bham\b/i,                           perLb: true,  price: 5.50 },
  { match: /\b(baby back|spare) ribs\b/i,        perLb: true,  price: 5.00 },
  { match: /\bpork\b/i,                          perLb: true,  price: 5.00 },

  { match: /\bchicken (breast|thigh)s?\b/i,      perLb: true,  price: 4.50 },
  { match: /\bwhole chicken\b/i,                 perLb: true,  price: 3.00 },
  { match: /\bchicken\b/i,                       perLb: true,  price: 4.00 },

  { match: /\blobster\b/i,                       perLb: true,  price: 28.00 },
  { match: /\bcrab\b/i,                          perLb: true,  price: 18.00 },
  { match: /\b(ahi )?tuna\b/i,                   perLb: true,  price: 14.00 },
  { match: /\bsalmon\b/i,                        perLb: true,  price: 12.00 },
  { match: /\bshrimp\b/i,                        perLb: true,  price: 10.00 },
  { match: /\bcod\b/i,                           perLb: true,  price: 10.00 },
  { match: /\bclams\b/i,                         perLb: true,  price: 7.00 },
  { match: /\blox\b/i,                           perLb: true,  price: 22.00 },
  { match: /\bsardines?\b/i,                     perLb: false, price: 2.50 },
  { match: /\bkippers?\b/i,                      perLb: false, price: 4.50 },
  { match: /\bfish\b/i,                          perLb: true,  price: 10.00 },

  // ── Pantry, produce, dairy (flat per line) ───────────
  { match: /\bsoy sauce\b/i,                     price: 0.30 },
  { match: /\b(rice|white wine|red wine|balsamic|apple cider) vinegar\b/i, price: 0.25 },
  { match: /\bsesame oil\b/i,                    price: 0.35 },
  { match: /\bcornstarch\b/i,                    price: 0.15 },
  { match: /\bfresh ginger\b/i,                  price: 0.75 },
  { match: /\b(cloves? )?garlic\b/i,             price: 0.30 },
  { match: /\bstir[- ]?fry vegetables\b/i,       price: 4.50 },
  { match: /\bcooked rice|rice or noodles\b/i,   price: 1.50 },
  { match: /\brice, quinoa, or grain\b/i,        price: 2.50 },
  { match: /\b(neutral|vegetable) oil\b/i,       price: 0.30 },
  { match: /\bolive oil\b/i,                     price: 0.40 },
  { match: /\bgreen onions?\b/i,                 price: 0.85 },
  { match: /\bshallots?\b/i,                     price: 0.80 },
  { match: /\b(chicken|beef|veg(etable)?) stock\b/i, price: 2.80 },
  { match: /\byellow onion|onion\b/i,            price: 0.75 },
  { match: /\bcarrots?\b/i,                      price: 0.60 },
  { match: /\bcelery\b/i,                        price: 0.80 },
  { match: /\bdiced tomatoes|tomato sauce|marinara\b/i, price: 2.80 },
  { match: /\bcrushed tomatoes\b/i,              price: 2.50 },
  { match: /\bheavy cream\b/i,                   price: 3.00 },
  { match: /\bcream\b/i,                         price: 2.50 },
  { match: /\bwhite wine\b/i,                    price: 5.00 },
  { match: /\bbeans\b/i,                         price: 1.25 },
  { match: /\b(fresh )?(thyme|rosemary|basil|parsley|cilantro|chives|dill|mint|oregano|sage|tarragon|bay leaf|sprigs?|herbs?)\b/i, price: 1.75 },
  { match: /\bsalt (and|&) pepper|salt, pepper\b/i, price: 0.10 },
  { match: /\bflaky salt\b/i,                    price: 0.15 },
  { match: /\bsalt\b/i,                          price: 0.05 },
  { match: /\bblack pepper|cracked pepper|pepper\b/i, price: 0.10 },
  { match: /\bred pepper flakes|chili flakes\b/i, price: 0.15 },
  { match: /\b(cumin|chili powder|smoked paprika|paprika|cardamom|cinnamon)\b/i, price: 0.25 },

  // Dairy / eggs / protein-adjacent
  { match: /\beggs?\b/i,                         price: 2.00 },
  { match: /\bgreek yogurt\b/i,                  price: 3.50 },
  { match: /\byogurt\b/i,                        price: 3.00 },
  { match: /\bmilk\b/i,                          price: 1.10 },
  { match: /\bbutter\b/i,                        price: 0.60 },
  { match: /\bsoftened butter\b/i,               price: 0.60 },
  { match: /\bcheese|parmesan|mozzarella|monterey jack|cotija|feta|blue cheese|crema|sour cream\b/i, price: 3.00 },

  // Produce / fruit
  { match: /\bavocado\b/i,                       price: 1.25 },
  { match: /\bbell peppers?\b/i,                 price: 1.00 },
  { match: /\bradishes?\b/i,                     price: 1.50 },
  { match: /\basparagus\b/i,                     price: 3.50 },
  { match: /\b(fresh|frozen) peas\b/i,           price: 2.00 },
  { match: /\bstrawberries|berries|mixed berries|blueberries|raspberries\b/i, price: 4.50 },
  { match: /\bpeaches?\b/i,                      price: 2.00 },
  { match: /\bapples?\b/i,                       price: 1.75 },
  { match: /\bpears?\b/i,                        price: 2.00 },
  { match: /\bpomegranate|pomegranate seeds\b/i, price: 4.00 },
  { match: /\bcitrus|oranges?\b/i,               price: 1.00 },
  { match: /\blemons?\b/i,                       price: 0.65 },
  { match: /\blimes?\b/i,                        price: 0.45 },
  { match: /\bzucchini\b/i,                      price: 1.25 },
  { match: /\btomato(es)?\b/i,                   price: 1.25 },
  { match: /\bcorn\b/i,                          price: 0.75 },
  { match: /\bkale\b/i,                          price: 2.50 },
  { match: /\bsquash\b/i,                        price: 3.00 },
  { match: /\broot veg|parsnips|turnips|beets\b/i, price: 3.50 },
  { match: /\bpotatoes?\b/i,                     price: 1.25 },
  { match: /\bsweet potatoes?\b/i,               price: 1.50 },
  { match: /\bmushrooms?\b/i,                    price: 3.00 },
  { match: /\bbrussels sprouts\b/i,              price: 3.50 },
  { match: /\bpumpkin|pumpkin puree\b/i,         price: 2.50 },
  { match: /\bcranberries\b/i,                   price: 2.50 },
  { match: /\bartichokes?\b/i,                   price: 4.00 },

  // Greens and salad bases
  { match: /\blettuce|romaine|greens|arugula\b/i, price: 3.00 },
  { match: /\bspinach\b/i,                       price: 3.00 },

  // Bread / grains
  { match: /\bbuns?|rolls?|bread|biscuits?|shortcakes?|sourdough|pita\b/i, price: 3.00 },
  { match: /\btortillas?\b/i,                    price: 2.50 },
  { match: /\bpasta|linguine|spaghetti|orecchiette|shells|penne|rigatoni\b/i, price: 1.75 },
  { match: /\barborio rice\b/i,                  price: 3.50 },
  { match: /\brice\b/i,                          price: 1.50 },
  { match: /\bflour\b/i,                         price: 0.40 },
  { match: /\boats\b/i,                          price: 0.45 },
  { match: /\bpanko|breadcrumbs?\b/i,            price: 1.50 },
  { match: /\bgranola\b/i,                       price: 1.50 },

  // Condiments / misc
  { match: /\bmayo|mustard|ketchup|aioli|dijon\b/i, price: 1.25 },
  { match: /\bpickles\b/i,                       price: 3.00 },
  { match: /\bsalsa\b/i,                         price: 3.00 },
  { match: /\bmaple syrup\b/i,                   price: 1.25 },
  { match: /\bhoney\b/i,                         price: 0.75 },
  { match: /\bpine nuts\b/i,                     price: 2.50 },
  { match: /\b(walnuts|almonds|pistachios|nuts)\b/i, price: 1.50 },
  { match: /\bvanilla ice cream|ice cream\b/i,   price: 4.50 },
  { match: /\bbaking powder\b/i,                 price: 0.10 },
  { match: /\bsugar\b/i,                         price: 0.15 },
  { match: /\bmicrogreens\b/i,                   price: 3.00 },
  { match: /\bcoconut milk\b/i,                  price: 2.50 },

  // Fallbacks
  { match: /\b(sauce|dressing|topping)\b/i,      price: 2.00 },
  { match: /\bseasonal topping\b/i,              price: 2.00 },
  { match: /\bvegetables?|side veg(etable)?\b/i, price: 2.50 },
]

// Drop parenthetical descriptors like "(corn or flour)" before matching so
// the primary item takes priority over words hidden inside a descriptor.
function stripParens(s) {
  return s.replace(/\s*\([^)]*\)/g, '')
}

export function estimateBasePrice(line) {
  const cleaned = stripParens(line)
  for (const entry of PRICES) {
    if (entry.match.test(cleaned)) {
      if (entry.perLb) {
        return entry.price * parseLbs(cleaned)
      }
      return entry.price
    }
  }
  return 0
}

export function estimateScaledPrice(line, servings) {
  const base = estimateBasePrice(line)
  if (base === 0) return 0
  return base * ((servings || BASE_SERVINGS) / BASE_SERVINGS)
}

export function estimateRecipePrice(ingredients, servings) {
  if (!Array.isArray(ingredients)) return 0
  return ingredients.reduce((sum, line) => sum + estimateScaledPrice(line, servings), 0)
}

export function formatUSD(n) {
  return `$${(n || 0).toFixed(2)}`
}

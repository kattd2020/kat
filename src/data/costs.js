// Default USD cost-per-serving estimates. These are deliberately coarse —
// US grocery averages (late 2025) for a single adult portion, cooked at home.
// Users can override any of these via the Cost calculator.

export const DEFAULT_PROTEIN_BASE = {
  beef:         4.00,
  pork:         3.00,
  chicken:      2.50,
  groundTurkey: 3.00,
  seafood:      5.50,
}

export const DEFAULT_MEAL_PANTRY = {
  breakfast: 1.50,
  lunch:     2.50,
  dinner:    3.50,
}

// Name-based modifiers. First match wins. These aren't user-editable today
// — they capture "this meal uses a premium ingredient" (lobster, ribeye, etc.)
// rather than the base store prices users want to tweak.
const PREMIUMS = [
  { match: /lobster/i,                                          add: 8.00 },
  { match: /prime rib|wellington|ribeye|ny strip|filet mignon/i,add: 6.00 },
  { match: /paella|seafood linguine|cioppino|seafood stew/i,    add: 4.00 },
  { match: /crab|scallop|tuna steak|ahi tuna/i,                 add: 3.00 },
  { match: /salmon/i,                                           add: 2.00 },
  { match: /shrimp/i,                                           add: 1.50 },
  { match: /baby back|short ribs|bbq ribs|pot roast|brisket/i,  add: 2.50 },
  { match: /risotto|lasagna|seafood|bolognese/i,                add: 1.50 },
  { match: /poke|sushi/i,                                       add: 2.00 },
  { match: /pasta|linguine|spaghetti|ravioli|pad thai/i,        add: 1.00 },
  { match: /steak/i,                                            add: 3.00 },
]

function premium(name) {
  for (const p of PREMIUMS) if (p.match.test(name)) return p.add
  return 0
}

function pick(overrides, category, key, fallback) {
  const v = overrides?.[category]?.[key]
  if (v === undefined || v === null || v === '' || Number.isNaN(Number(v))) return fallback
  return Number(v)
}

export function getProteinBase(protein, overrides) {
  return pick(overrides, 'proteinBase', protein, DEFAULT_PROTEIN_BASE[protein] ?? 3.50)
}

export function getMealPantry(mealType, overrides) {
  return pick(overrides, 'mealPantry', mealType, DEFAULT_MEAL_PANTRY[mealType] ?? 2.50)
}

export function estimateMealCost(name, protein, mealType, overrides) {
  const base   = getProteinBase(protein, overrides)
  const pantry = getMealPantry(mealType, overrides)
  const extra  = premium(name)
  return Math.round((base + pantry + extra) * 100) / 100
}

export function estimateDayCost(day, overrides) {
  const b = estimateMealCost(day.breakfast, day.protein, 'breakfast', overrides)
  const l = estimateMealCost(day.lunch,     day.protein, 'lunch',     overrides)
  const d = estimateMealCost(day.dinner,    day.protein, 'dinner',    overrides)
  return Math.round((b + l + d) * 100) / 100
}

export function estimateWeekCost(weekDays, overrides) {
  return Math.round(
    weekDays.reduce((sum, day) => sum + estimateDayCost(day, overrides), 0) * 100
  ) / 100
}

export function formatUSD(n) {
  return `$${n.toFixed(2)}`
}

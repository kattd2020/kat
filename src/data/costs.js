// Rough USD cost-per-serving estimates. These are deliberately coarse —
// US grocery averages (late 2025) for a single adult portion, cooked at home.

const PROTEIN_BASE = {
  beef:         4.00,
  pork:         3.00,
  chicken:      2.50,
  groundTurkey: 3.00,
  seafood:      5.50,
}

const MEAL_PANTRY = {
  breakfast: 1.50,
  lunch:     2.50,
  dinner:    3.50,
}

// Name-based modifiers. First match wins.
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

export function estimateMealCost(name, protein, mealType) {
  const base   = PROTEIN_BASE[protein] ?? 3.50
  const pantry = MEAL_PANTRY[mealType] ?? 2.50
  const extra  = premium(name)
  return Math.round((base + pantry + extra) * 100) / 100
}

export function estimateDayCost(day) {
  const b = estimateMealCost(day.breakfast, day.protein, 'breakfast')
  const l = estimateMealCost(day.lunch,     day.protein, 'lunch')
  const d = estimateMealCost(day.dinner,    day.protein, 'dinner')
  return Math.round((b + l + d) * 100) / 100
}

export function estimateWeekCost(weekDays) {
  return Math.round(
    weekDays.reduce((sum, day) => sum + estimateDayCost(day), 0) * 100
  ) / 100
}

export function formatUSD(n) {
  return `$${n.toFixed(2)}`
}

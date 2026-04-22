import { PROTEIN_LABELS } from './mealsData'

const PROTEIN_NOUN = {
  beef:         'beef',
  pork:         'pork',
  chicken:      'chicken',
  groundTurkey: 'ground turkey',
  seafood:      'fish',
}

function proteinNoun(name, protein) {
  if (protein !== 'seafood') return PROTEIN_NOUN[protein] || 'protein'
  const n = name.toLowerCase()
  if (n.includes('shrimp'))  return 'shrimp'
  if (n.includes('salmon'))  return 'salmon'
  if (n.includes('tuna'))    return 'tuna'
  if (n.includes('cod'))     return 'cod'
  if (n.includes('crab'))    return 'crab'
  if (n.includes('lobster')) return 'lobster'
  if (n.includes('clam'))    return 'clams'
  if (n.includes('lox'))     return 'lox'
  if (n.includes('sardine')) return 'sardines'
  if (n.includes('kipper'))  return 'kippers'
  return 'fish'
}

const ARCHETYPES = [
  {
    key: 'stirFry',
    match: /stir[- ]?fry|fried rice|lo mein|bulgogi|char siu|chow mein|teriyaki/i,
    steps: (m) => [
      `Slice ${m.proteinNoun} thin against the grain (½-inch strips). Pat dry.`,
      `In a small bowl, whisk 2 tbsp soy sauce, 1 tbsp rice vinegar, 1 tsp sesame oil, and 1 tsp cornstarch. Set aside.`,
      `Heat 1 tbsp oil in a wok or wide skillet over high heat until shimmering.`,
      `Stir-fry the ${m.proteinNoun} 2–3 minutes until just browned; remove to a plate.`,
      `Add aromatics (garlic + ginger) and vegetables; stir-fry 3–4 minutes until crisp-tender.`,
      `Return ${m.proteinNoun} and sauce to the pan, toss 60 seconds until glossy, and serve over rice or noodles.`,
    ],
  },
  {
    key: 'soup',
    match: /soup|stew|chili|ramen|pho|gumbo|bean (soup|stew)|braised|cacciatore|and dumplings|paprikash/i,
    steps: (m) => [
      `Season ${m.proteinNoun} with salt and pepper.`,
      `In a heavy pot, heat 1 tbsp oil and brown the ${m.proteinNoun} in batches; transfer to a plate.`,
      `Sauté diced onion, carrot, and celery in the rendered fat until soft, 5–7 minutes. Add garlic the last minute.`,
      `Deglaze with a splash of stock, scraping up the browned bits.`,
      `Return the ${m.proteinNoun}, add 4 cups stock and any canned tomatoes/beans, and bring to a simmer.`,
      `Simmer 25–40 minutes until everything is tender; taste and adjust salt. Finish with fresh herbs.`,
    ],
  },
  {
    key: 'sandwich',
    match: /sandwich|sub|panini|bánh mì|banh mi|wrap|gyro|hoagie|club|burger|slider|cheesesteak|philly|melt|sloppy joe|egg muffin|egg (wrap|burrito)/i,
    steps: (m) => [
      `Cook the ${m.proteinNoun} to temperature: griddle, grill, or pan-sear depending on the cut. Season well.`,
      `Toast or warm the bread/bun so it holds up to the fillings.`,
      `Spread condiments on both sides of the bread (mayo, mustard, aioli, or a house sauce).`,
      `Layer the ${m.proteinNoun} with cheese and any hot toppings so the cheese melts from residual heat.`,
      `Add crisp toppings (lettuce, pickles, onions, tomato) last so they don't wilt.`,
      `Press or slice in half on the diagonal, and serve immediately with chips or fries.`,
    ],
  },
  {
    key: 'salad',
    match: /salad|cobb|caesar|grain bowl|pasta salad/i,
    steps: (m) => [
      `Cook the ${m.proteinNoun} and let it rest, then slice or dice into bite-sized pieces.`,
      `Whisk the dressing: oil, acid (lemon/vinegar), Dijon, salt, pepper — taste until it tingles.`,
      `Wash and dry the greens thoroughly; a salad spinner is your friend.`,
      `Prep the mix-ins: cheese, nuts, fruit, pickled veg, soft-boiled eggs as the recipe suggests.`,
      `In a wide bowl, toss the greens with a little dressing first, then arrange the ${m.proteinNoun} and mix-ins on top.`,
      `Finish with flaky salt, cracked pepper, and the remaining dressing to taste.`,
    ],
  },
  {
    key: 'mexican',
    match: /taco|burrito|enchilada|quesadilla|fajita|carnitas|tortilla|tostada|nacho|chilaquiles/i,
    steps: (m) => [
      `Season the ${m.proteinNoun} with cumin, chili powder, smoked paprika, garlic powder, salt, and pepper.`,
      `Cook the ${m.proteinNoun}: sear ground meat until browned, or sear whole cuts and shred once tender.`,
      `Warm the tortillas in a dry skillet or directly over a flame for 15 seconds per side until pliable and charred.`,
      `Prep toppings: diced onion, cilantro, lime wedges, crumbled cheese or crema, hot sauce, salsa.`,
      `Build each tortilla with ${m.proteinNoun} first, then toppings — not too full, or it'll split.`,
      `Serve immediately with lime to squeeze over the top and extra salsa on the side.`,
    ],
  },
  {
    key: 'breakfastSkillet',
    match: /omelet|omelette|scramble|frittata|hash|skillet|breakfast bowl|breakfast burrito|biscuits & gravy|gravy on biscuits|breakfast plate|breakfast wrap/i,
    steps: (m) => [
      `Dice the ${m.proteinNoun} and any vegetables (onion, peppers, potatoes) into uniform ½-inch pieces.`,
      `Heat a heavy skillet over medium-high with a glug of oil. Render or brown the ${m.proteinNoun} first.`,
      `Add the vegetables and cook until tender and lightly caramelized, 6–8 minutes.`,
      `Beat the eggs with salt, pepper, and a splash of milk until uniform.`,
      `Pour the eggs into the skillet, lower the heat, and stir gently as they set into soft curds.`,
      `Finish with cheese, herbs, or hot sauce; plate and serve immediately while hot.`,
    ],
  },
  {
    key: 'grill',
    match: /grilled|grill|steak|ribeye|ny strip|bbq (ribs|baby back|pork)|baby back|chop(s)?|kebab|skewer|shawarma|\bjerk\b|souvlaki/i,
    steps: (m) => [
      `Bring the ${m.proteinNoun} to room temperature 30 minutes before cooking. Pat dry.`,
      `Season generously with salt, pepper, and a light drizzle of oil just before grilling.`,
      `Heat the grill to high (for steaks/chops) or medium-low (for ribs). Clean and oil the grates.`,
      `Grill undisturbed to get deep sear marks — 3–4 minutes per side for medium steaks, longer for larger cuts.`,
      `Use a thermometer: 130°F rare, 140°F medium for beef; 145°F for pork; 165°F for chicken.`,
      `Rest 5–10 minutes, slice across the grain, and finish with flaky salt and a pat of compound butter.`,
    ],
  },
  {
    key: 'roast',
    match: /roast(ed)?|baked|loin|tenderloin|whole chicken|prime rib|pot roast|maple glazed|honey glazed|honey garlic (pork|chicken)/i,
    steps: (m) => [
      `Pat the ${m.proteinNoun} dry and season generously with salt, pepper, and herbs (rosemary, thyme, garlic).`,
      `Let it sit at room temp 30 minutes while the oven heats to 400°F (or 325°F for large cuts).`,
      `Sear on the stovetop in a heavy oven-proof pan until deeply browned on all sides.`,
      `Transfer to the oven and roast to internal temperature (135°F beef, 145°F pork, 165°F chicken).`,
      `Baste with pan juices halfway through; add root vegetables around the meat for a one-pan meal.`,
      `Rest 10–15 minutes tented with foil before slicing across the grain. Spoon pan juices over each serving.`,
    ],
  },
  {
    key: 'pasta',
    match: /pasta|lasagna|bolognese|spaghetti|ravioli|alfredo|marsala|parmesan|piccata|noodle(s)?|ziti|penne|rigatoni/i,
    steps: (m) => [
      `Bring a large pot of heavily salted water to a rolling boil.`,
      `While it heats, brown the ${m.proteinNoun} in olive oil until nicely crusted; remove and set aside.`,
      `Build the sauce in the same pan: aromatics → tomato or cream base → simmer 10 minutes to meld flavors.`,
      `Cook the pasta 1 minute shy of the package time. Reserve a mug of pasta water before draining.`,
      `Return the ${m.proteinNoun} to the sauce, then toss in the pasta with a splash of pasta water to emulsify.`,
      `Finish with grated Parmesan, fresh basil or parsley, and a swirl of olive oil. Serve hot.`,
    ],
  },
  {
    key: 'casserole',
    match: /pot pie|shepherd'?s pie|casserole|meatloaf|stuffed pepper|stuffed pork|stuffed|zucchini boat|enchilada/i,
    steps: (m) => [
      `Preheat the oven to 375°F and butter or oil a 9×13 baking dish.`,
      `Cook the ${m.proteinNoun} with onion, garlic, and seasoning until browned and fragrant. Drain excess fat.`,
      `Build the filling: combine cooked ${m.proteinNoun} with vegetables, sauce or gravy, and herbs. Taste for salt.`,
      `Layer or stuff into the dish, then top with mashed potato, biscuit, crust, cheese, or breadcrumbs as fits the recipe.`,
      `Bake uncovered 25–35 minutes until the top is deep golden and the edges are bubbling.`,
      `Rest 10 minutes out of the oven so the layers set before you slice and serve.`,
    ],
  },
  {
    key: 'risotto',
    match: /risotto/i,
    steps: (m) => [
      `Heat 4 cups of stock in a saucepan and keep it at a bare simmer.`,
      `In a wide pan, sauté finely diced shallot in butter until translucent, then add 1½ cups arborio rice.`,
      `Toast the rice 2 minutes, then deglaze with ½ cup dry white wine and stir until absorbed.`,
      `Add hot stock one ladle at a time, stirring often and letting each addition absorb before the next.`,
      `When rice is just al dente (about 18–22 minutes), fold in the cooked ${m.proteinNoun} and any mushrooms/greens.`,
      `Finish off-heat with a knob of butter and a generous handful of Parmesan. Serve immediately.`,
    ],
  },
  {
    key: 'breaded',
    match: /schnitzel|parmesan|piccata|nashville|fried chicken|katsu|\btenders?\b|\bnuggets?\b|cordon bleu|general tso/i,
    steps: (m) => [
      `Pound the ${m.proteinNoun} to even ½-inch thickness between sheets of plastic so it cooks evenly.`,
      `Set up three shallow dishes: seasoned flour, beaten eggs, and breadcrumbs (panko is crispest).`,
      `Dredge each piece: flour → egg → breadcrumbs, pressing gently so the coating adheres.`,
      `Heat ¼ inch of oil in a skillet to 350°F — a breadcrumb should sizzle on contact.`,
      `Fry 3–4 minutes per side until golden and cooked through; drain on a wire rack, not paper towels.`,
      `Season immediately with salt and serve with lemon wedges or the sauce called for in the recipe.`,
    ],
  },
  {
    key: 'bowl',
    match: /bowl|burrito bowl|rice bowl|grain bowl|buddha bowl|poke|lettuce wrap/i,
    steps: (m) => [
      `Cook the base (rice, quinoa, or cauliflower rice) and keep warm. Season with salt and a little acid.`,
      `Cook the ${m.proteinNoun}: sear, grill, or slow-cook as the recipe suggests. Slice or shred.`,
      `Prep 2–3 toppings: roasted veg, raw slaw, beans, avocado, pickled onion — whatever adds color and texture.`,
      `Whisk a quick sauce: soy + sesame, tahini + lemon, or lime + chili, depending on the flavor direction.`,
      `Assemble: base on the bottom, ${m.proteinNoun} next, then toppings arranged in bright wedges around the bowl.`,
      `Drizzle the sauce, top with herbs or seeds, and serve with a wedge of lime or lemon.`,
    ],
  },
  {
    key: 'pancakes',
    match: /pancake(s)?|waffle(s)?/i,
    steps: (m) => [
      `Cook the ${m.proteinNoun} first so it stays warm on a low sheet tray while you cook the pancakes/waffles.`,
      `Whisk the dry (flour, sugar, baking powder, salt) and wet (milk, egg, melted butter) separately, then fold together until just combined — lumps are fine.`,
      `Rest the batter 5 minutes while the skillet or waffle iron heats to medium.`,
      `Cook the pancakes until bubbles form and the edges look set (about 2 minutes), flip, and cook 1 more minute.`,
      `Hold finished pancakes in a 200°F oven on a wire rack so they stay crisp.`,
      `Plate with the ${m.proteinNoun}, a pat of butter, and warm maple syrup.`,
    ],
  },
  {
    key: 'avocadoToast',
    match: /avocado toast/i,
    steps: (m) => [
      `Toast thick slices of sourdough or seeded bread until deep golden and crisp.`,
      `Cook the ${m.proteinNoun} (crisp-edged, with fond) so it contrasts the creamy avocado.`,
      `Mash ripe avocado with a fork, lemon juice, flaky salt, and chili flakes — keep some texture.`,
      `Spread the avocado generously on each toast slice, right up to the edges.`,
      `Top with the cooked ${m.proteinNoun} and a soft-fried or jammy egg if serving for brunch.`,
      `Finish with microgreens, more flaky salt, and cracked black pepper.`,
    ],
  },
]

const SEAFOOD_NOUNS = new Set(['salmon', 'cod', 'tuna', 'fish', 'shrimp', 'crab', 'lobster', 'clams', 'lox', 'sardines', 'kippers'])

const DEFAULT_STEPS = (m) => {
  if (SEAFOOD_NOUNS.has(m.proteinNoun)) {
    return [
      `Pat the ${m.proteinNoun} dry and season with salt, pepper, and a squeeze of lemon juice.`,
      `Heat a nonstick or cast-iron pan over medium-high with a thin layer of neutral oil.`,
      `Cook the ${m.proteinNoun} skin-side down first (if applicable) until crisp, pressing gently so it doesn't curl.`,
      `Flip once and cook until the flesh is just opaque and flakes easily — about 2–4 minutes more, depending on thickness.`,
      `Finish with a pat of butter, fresh herbs (dill or parsley), and more lemon off the heat.`,
      `Serve immediately; seafood keeps cooking on the plate, so don't let it overshoot.`,
    ]
  }
  return [
    `Pat the ${m.proteinNoun} dry and season it with salt and pepper at least 15 minutes ahead.`,
    `Prep everything else first: measure sauces, chop vegetables, and have plates warming.`,
    `Heat a heavy pan over medium-high with a tablespoon of oil until it shimmers.`,
    `Sear the ${m.proteinNoun} until deeply browned on one side, then flip and finish cooking through.`,
    `Rest the ${m.proteinNoun} on a warm plate for 5 minutes while you reduce any pan sauce or plate the sides.`,
    `Slice against the grain, plate with the sides, and finish with a squeeze of lemon or fresh herbs.`,
  ]
}

function findArchetype(name) {
  return ARCHETYPES.find(a => a.match.test(name))
}

export function getRecipeSteps(name, protein) {
  const meta = {
    name,
    proteinNoun: proteinNoun(name, protein),
    proteinLabel: PROTEIN_LABELS[protein]?.label || 'Protein',
  }
  const arch = findArchetype(name)
  return (arch ? arch.steps(meta) : DEFAULT_STEPS(meta))
}

export function getRecipeArchetype(name) {
  return findArchetype(name)?.key || 'default'
}

// ── Ingredients ─────────────────────────────────────────
// Rough shopping lists per archetype, serving about 4. The
// protein noun is interpolated in via `m.proteinNoun` from the same
// archetype detection used for steps so the list reads naturally for
// beef, pork, chicken, ground turkey, and seafood variants.

const INGREDIENTS = {
  stirFry: (m) => [
    `1 lb ${m.proteinNoun}, sliced thin or cubed`,
    '3 tbsp soy sauce',
    '1 tbsp rice vinegar',
    '1 tsp sesame oil',
    '1 tsp cornstarch',
    '2 cloves garlic, minced',
    '1 tbsp fresh ginger, grated',
    '3 cups mixed stir-fry vegetables (broccoli, peppers, snap peas)',
    '2 cups cooked rice or noodles',
    '2 tbsp neutral oil',
    '2 green onions, sliced',
  ],
  soup: (m) => [
    `1 lb ${m.proteinNoun}`,
    '4 cups chicken or beef stock',
    '1 yellow onion',
    '2 carrots',
    '2 celery stalks',
    '3 cloves garlic',
    '1 can (15 oz) diced tomatoes or beans',
    'Fresh thyme or a bay leaf',
    '2 tbsp olive oil',
    'Salt and pepper',
  ],
  sandwich: (m) => [
    `1 lb ${m.proteinNoun}`,
    '4 buns, rolls, or slices of good bread',
    '4 slices cheese (cheddar, Swiss, or provolone)',
    '1 head lettuce or a handful of greens',
    '1 tomato',
    '½ red onion',
    'Pickles',
    'Mayo and/or mustard',
  ],
  salad: (m) => [
    `1 lb ${m.proteinNoun}`,
    '6 cups mixed greens or romaine',
    '½ cup cheese (feta, blue, or Parmesan)',
    '¼ cup toasted nuts (walnuts, almonds, pine nuts)',
    '1 seasonal topping (apple, pear, berries, avocado)',
    '3 tbsp olive oil',
    '1 tbsp red wine vinegar or lemon juice',
    '1 tsp Dijon mustard',
    'Salt and pepper',
  ],
  mexican: (m) => [
    `1 lb ${m.proteinNoun}`,
    '8 tortillas (corn or flour)',
    '1 tsp cumin',
    '1 tsp chili powder',
    '½ tsp smoked paprika',
    '1 yellow onion',
    '2 cloves garlic',
    'Fresh cilantro',
    '2 limes',
    '1 cup shredded cheese (cheddar or Monterey jack)',
    'Salsa',
    'Sour cream or crema',
  ],
  breakfastSkillet: (m) => [
    `½ lb ${m.proteinNoun}`,
    '8 eggs',
    '2 medium potatoes',
    '1 yellow onion',
    '1 bell pepper',
    '1 cup shredded cheese',
    '2 tbsp butter or oil',
    'Splash of milk',
    'Salt, pepper, fresh chives or parsley',
  ],
  roast: (m) => [
    `2–4 lb ${m.proteinNoun} roast (or whole chicken)`,
    '3 tbsp olive oil',
    'Kosher salt and black pepper',
    '2 sprigs rosemary',
    '4 sprigs thyme',
    '6 cloves garlic',
    '2 lbs root vegetables (potatoes, carrots, onions)',
  ],
  grill: (m) => [
    `1 lb ${m.proteinNoun} (steak, chops, or cubed for kebabs)`,
    '2 tbsp olive oil',
    'Kosher salt',
    'Black pepper',
    '2 tbsp butter',
    'Fresh herbs (rosemary, parsley)',
    '1 lemon',
  ],
  pasta: (m) => [
    `1 lb ${m.proteinNoun}`,
    '1 lb pasta',
    '3 tbsp olive oil',
    '3 cloves garlic',
    '1 jar (24 oz) marinara or 1 cup heavy cream',
    '½ cup grated Parmesan',
    'Fresh basil or parsley',
    'Salt and pepper',
  ],
  casserole: (m) => [
    `1 lb ${m.proteinNoun}`,
    '1 yellow onion',
    '2 cloves garlic',
    '2 cups sauce, gravy, or crushed tomatoes',
    '1 cup topping (mashed potato, biscuit, or breadcrumbs)',
    '1 cup shredded cheese',
    'Fresh herbs',
    'Salt and pepper',
  ],
  risotto: (m) => [
    `1 lb ${m.proteinNoun}`,
    '1½ cups arborio rice',
    '4 cups warm stock',
    '½ cup dry white wine',
    '1 shallot',
    '3 tbsp butter',
    '½ cup grated Parmesan',
  ],
  breaded: (m) => [
    `1 lb ${m.proteinNoun}, pounded thin`,
    '1 cup flour',
    '3 eggs',
    '1½ cups panko breadcrumbs',
    'Neutral oil for frying',
    '1 lemon',
    'Salt',
  ],
  bowl: (m) => [
    `1 lb ${m.proteinNoun}`,
    '2 cups cooked rice, quinoa, or grain',
    '2 cups roasted or raw vegetables',
    '1 avocado',
    'Sauce (soy + sesame, tahini + lemon, or lime + chili)',
    'Fresh herbs or seeds (cilantro, sesame)',
    '1 lime',
  ],
  pancakes: (m) => [
    `1 lb ${m.proteinNoun} (sausage or bacon)`,
    '1½ cups flour',
    '2 tbsp sugar',
    '1 tbsp baking powder',
    '½ tsp salt',
    '1¼ cups milk',
    '1 egg',
    '2 tbsp melted butter',
    'Maple syrup',
  ],
  avocadoToast: (m) => [
    `½ lb ${m.proteinNoun}`,
    '4 slices thick sourdough or seeded bread',
    '2 ripe avocados',
    '1 lemon',
    'Flaky salt',
    'Chili flakes',
    '4 eggs (optional)',
    'Microgreens or cilantro',
  ],
  default: (m) => {
    if (SEAFOOD_NOUNS.has(m.proteinNoun)) {
      return [
        `1 lb ${m.proteinNoun}`,
        '2 tbsp olive oil',
        '2 tbsp butter',
        '1 lemon',
        'Fresh dill or parsley',
        'Salt and pepper',
      ]
    }
    return [
      `1 lb ${m.proteinNoun}`,
      '3 tbsp olive oil',
      '2 cloves garlic',
      'Fresh herbs (rosemary, thyme, or parsley)',
      '1 lemon',
      '2 cups side vegetable or grain of your choice',
      'Salt and pepper',
    ]
  },
}

export function getRecipeIngredients(name, protein) {
  const meta = {
    name,
    proteinNoun: proteinNoun(name, protein),
  }
  const key = findArchetype(name)?.key || 'default'
  return (INGREDIENTS[key] || INGREDIENTS.default)(meta)
}

// ── Serving-size scaling ────────────────────────────────
// Default ingredient lists above are written to serve about 4. The
// functions below let a caller re-scale them at render time without
// touching stored data.

export const BASE_SERVINGS = 4

const UNICODE_FRACTIONS = {
  '¼': 0.25, '⅓': 1 / 3, '½': 0.5, '⅔': 2 / 3, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
}
const INVERSE_FRACTIONS = [
  [0.125, '⅛'], [0.25, '¼'], [1 / 3, '⅓'], [0.375, '⅜'],
  [0.5, '½'], [0.625, '⅝'], [2 / 3, '⅔'], [0.75, '¾'], [0.875, '⅞'],
]

function parseLeadingQty(s) {
  const range = s.match(/^(\d+)\s*[-–]\s*(\d+)\b/)
  if (range) {
    return { range: [Number(range[1]), Number(range[2])], matchLen: range[0].length }
  }
  const mix = s.match(/^(\d+)\s*([¼⅓½⅔¾⅕⅖⅗⅘⅛⅜⅝⅞])/)
  if (mix) {
    return { value: Number(mix[1]) + UNICODE_FRACTIONS[mix[2]], matchLen: mix[0].length }
  }
  const whole = s.match(/^\d+/)
  if (whole) return { value: Number(whole[0]), matchLen: whole[0].length }
  const frac = s.match(/^[¼⅓½⅔¾⅕⅖⅗⅘⅛⅜⅝⅞]/)
  if (frac) return { value: UNICODE_FRACTIONS[frac[0]], matchLen: 1 }
  return null
}

function formatQty(n) {
  if (n <= 0) return '0'
  const whole = Math.floor(n + 1e-9)
  const frac = n - whole
  for (const [v, ch] of INVERSE_FRACTIONS) {
    if (Math.abs(frac - v) < 0.04) {
      return whole > 0 ? `${whole}${ch}` : ch
    }
  }
  if (frac < 0.04) return String(whole)
  return Number(n.toFixed(2)).toString()
}

export function scaleIngredient(line, factor) {
  if (factor === 1) return line
  const parsed = parseLeadingQty(line)
  if (!parsed) return line
  const rest = line.slice(parsed.matchLen)
  if (parsed.range) {
    const [lo, hi] = parsed.range
    return `${formatQty(lo * factor)}–${formatQty(hi * factor)}${rest}`
  }
  return `${formatQty(parsed.value * factor)}${rest}`
}

export function scaleIngredients(list, servings) {
  const factor = (servings || BASE_SERVINGS) / BASE_SERVINGS
  if (factor === 1) return list
  return list.map(line => scaleIngredient(line, factor))
}

// ── Cook time estimates (total, including prep) ───────────
// Rough "start to plate" minutes per archetype. Intentionally ballpark
// — real times swing with cut, skill, and whether you pre-prep.

const COOK_TIMES = {
  stirFry:          20,
  soup:             45,
  sandwich:         15,
  salad:            15,
  mexican:          25,
  breakfastSkillet: 20,
  roast:            90,
  grill:            25,
  pasta:            25,
  casserole:        50,
  risotto:          40,
  breaded:          25,
  bowl:             25,
  pancakes:         20,
  avocadoToast:     10,
  default:          30,
}

export function getCookTime(name, protein) {
  const noun = proteinNoun(name, protein)
  const key = findArchetype(name)?.key || 'default'
  let minutes = COOK_TIMES[key]
  // Seafood cooks fast when no archetype matches
  if (key === 'default' && SEAFOOD_NOUNS.has(noun)) minutes = 15
  return minutes || COOK_TIMES.default
}

export function formatCookTime(minutes) {
  if (!minutes) return ''
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes} min`
}

// Per-step cook-time estimate — uses an explicit duration in the text
// when present, otherwise a verb-based heuristic.
export function estimateStepMinutes(text) {
  if (!text) return 5
  const t = text.toLowerCase()

  // Explicit duration — take the TOP of any range.
  const m = t.match(/(\d+)(?:\s*[-–]\s*(\d+))?\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)/i)
  if (m) {
    const hi = m[2] ? parseInt(m[2], 10) : parseInt(m[1], 10)
    const unit = m[3].toLowerCase()
    if (unit.startsWith('hour') || unit.startsWith('hr')) return hi * 60
    if (unit.startsWith('sec')) return Math.max(1, Math.round(hi / 60))
    return hi
  }

  // Verb-based fallbacks
  if (/\bsimmer|\bbraise|\bstew\b|\bslow[- ]cook|\bcook covered/.test(t)) return 20
  if (/\bmarinate|\bbrine\b/.test(t))                                   return 30
  if (/\broast|\bbake\b/.test(t))                                       return 30
  if (/\bboil|\bsteam\b/.test(t))                                       return 10
  if (/\bsear\b|\bfry\b|\bsaut[ée]|\bbrown\b|\bgrill\b|\bcook\b/.test(t)) return 8
  if (/\bheat\b|\bpreheat\b|\bwarm\b/.test(t))                          return 3
  if (/\brest\b|\blet sit\b|\blet cool\b|\bchill\b|\brefrigerate/.test(t)) return 5
  if (/\bslice\b|\bchop\b|\bdice\b|\bcut\b|\bpat\b|\bseason\b|\bdrizzle\b|\bwhisk\b|\bmix\b|\bcombine\b|\bprep\b|\barrange\b|\bspread\b|\btoss\b|\bfold\b|\bstir\b|\bmash\b|\bbeat\b/.test(t)) return 3
  if (/\bserve\b|\bplate\b|\bfinish\b|\bgarnish\b|\btop\b/.test(t))    return 1

  return 5
}

export function formatStepMinutes(minutes) {
  if (!minutes) return ''
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes}m`
}

// ── Meat cook callout ─────────────────────────────────
// The ONE directive that tells you exactly how to cook the protein
// in this recipe: method, temperature, and time. Shown above the
// step-by-step so shoppers/cooks know the critical spec at a glance
// ("Roast chicken at 400°F for 45 min").

export function getMeatCookInfo(name, protein) {
  if (!protein) return null
  const noun = proteinNoun(name, protein)
  const key = findArchetype(name)?.key || 'default'

  switch (key) {
    case 'roast':
      if (protein === 'beef')    return { noun, method: 'Roast', temp: '325°F', time: '1½–2 hr (internal 135°F)' }
      if (protein === 'pork')    return { noun, method: 'Roast', temp: '350°F', time: '45 min–1 hr (internal 145°F)' }
      if (protein === 'chicken') return { noun, method: 'Roast', temp: '400°F', time: '45 min (internal 165°F)' }
      if (protein === 'seafood') return { noun, method: 'Bake',  temp: '400°F', time: '12–15 min (flakes easily)' }
      return { noun, method: 'Roast', temp: '350°F', time: '45 min' }

    case 'grill':
      if (protein === 'seafood') return { noun, method: 'Grill', temp: 'medium-high', time: '4 min per side' }
      if (protein === 'chicken') return { noun, method: 'Grill', temp: 'medium-high', time: '6 min per side (internal 165°F)' }
      if (protein === 'pork')    return { noun, method: 'Grill', temp: 'medium-high', time: '4 min per side (internal 145°F)' }
      return { noun, method: 'Grill', temp: 'high',          time: '3–4 min per side (internal 135°F medium)' }

    case 'breaded':
      return { noun, method: 'Pan-fry', temp: '350°F oil', time: '3–4 min per side' }

    case 'stirFry':
      return { noun, method: 'Stir-fry', temp: 'high heat', time: '2–3 min' }

    case 'soup':
      return { noun, method: 'Simmer', temp: 'low',        time: '25–40 min until tender' }

    case 'casserole':
      return { noun, method: 'Bake',   temp: '375°F',      time: '25–35 min uncovered' }

    case 'pasta':
      return { noun, method: 'Brown',  temp: 'medium-high',time: '5–8 min' }

    case 'sandwich':
      return { noun, method: 'Cook to temp', time: '5–8 min' }

    case 'salad':
      return { noun, method: 'Cook + slice', time: '6–8 min' }

    case 'mexican':
      return { noun, method: 'Brown or shred', time: '8–10 min' }

    case 'breakfastSkillet':
      return { noun, method: 'Render / brown', temp: 'medium-high', time: '6–8 min' }

    case 'risotto':
      return { noun, method: 'Sear separately, fold in', time: '6 min' }

    case 'bowl':
      return { noun, method: 'Sear or grill', time: '3–6 min per side' }

    case 'pancakes':
      return { noun, method: 'Cook per package', time: '4–6 min' }

    case 'avocadoToast':
      return { noun, method: 'Crisp in pan', time: '4–5 min' }

    default:
      if (protein === 'seafood') return { noun, method: 'Pan-sear', time: '3–4 min per side (flakes easily)' }
      return { noun, method: 'Sear to temp', temp: 'medium-high', time: '5–8 min' }
  }
}

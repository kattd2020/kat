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
    match: /soup|stew|chili|ramen|pho|gumbo|bean (soup|stew)|braised/i,
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
    match: /taco|burrito|enchilada|quesadilla|fajita|carnitas|tortilla|tostada|nacho/i,
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
    match: /grilled|grill|steak|ribeye|ny strip|bbq (ribs|baby back|pork)|baby back|chop(s)?|kebab|skewer/i,
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
    match: /schnitzel|parmesan|piccata|nashville|fried chicken|katsu/i,
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

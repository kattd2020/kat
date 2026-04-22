// Sub-cuts of each protein so the recipe browser can filter
// "show me only pork chops", "only baby back ribs", etc.
//
// Each CUTS[protein] array is the chip row (first entry "all" is always
// the reset). `classifyCut(protein, mealName)` returns the matching cut
// key for a given meal — first rule that matches wins.

export const CUTS = {
  beef: [
    { key: 'all',         label: 'All',             emoji: '🥩' },
    { key: 'ground',      label: 'Ground',          emoji: '🥩' },
    { key: 'steak',       label: 'Steak',           emoji: '🥩' },
    { key: 'roast',       label: 'Roast',           emoji: '🍖' },
    { key: 'shortRib',    label: 'Short rib / Stew',emoji: '🍖' },
    { key: 'philly',      label: 'Philly / Cheesesteak', emoji: '🥖' },
    { key: 'cornedBeef',  label: 'Corned beef',     emoji: '🥩' },
  ],
  pork: [
    { key: 'all',         label: 'All',              emoji: '🥓' },
    { key: 'bacon',       label: 'Bacon',            emoji: '🥓' },
    { key: 'ham',         label: 'Ham',              emoji: '🍖' },
    { key: 'sausage',     label: 'Sausage / Chorizo',emoji: '🌭' },
    { key: 'chops',       label: 'Pork chops',       emoji: '🥩' },
    { key: 'tenderloin',  label: 'Tenderloin / Loin',emoji: '🍖' },
    { key: 'belly',       label: 'Pork belly',       emoji: '🥓' },
    { key: 'ribs',        label: 'Baby back / Ribs', emoji: '🍖' },
    { key: 'pulled',      label: 'Boston butt / Pulled', emoji: '🍖' },
    { key: 'schnitzel',   label: 'Schnitzel',        emoji: '🍗' },
  ],
  chicken: [
    { key: 'all',         label: 'All',                 emoji: '🍗' },
    { key: 'breast',      label: 'Chicken breast',      emoji: '🍗' },
    { key: 'thigh',       label: 'Chicken thighs',      emoji: '🍗' },
    { key: 'whole',       label: 'Whole / Rotisserie',  emoji: '🍗' },
    { key: 'chickenSausage', label: 'Chicken sausage',  emoji: '🌭' },
  ],
  groundTurkey: [
    { key: 'all',         label: 'All',               emoji: '🦃' },
    { key: 'ground',      label: 'Ground turkey',     emoji: '🦃' },
    { key: 'turkeySausage', label: 'Turkey sausage',  emoji: '🌭' },
  ],
  seafood: [
    { key: 'all',         label: 'All',                emoji: '🐟' },
    { key: 'salmon',      label: 'Salmon',             emoji: '🐟' },
    { key: 'shrimp',      label: 'Shrimp',             emoji: '🦐' },
    { key: 'tuna',        label: 'Tuna',               emoji: '🐟' },
    { key: 'cod',         label: 'Cod',                emoji: '🐟' },
    { key: 'crab',        label: 'Crab',               emoji: '🦀' },
    { key: 'lobster',     label: 'Lobster',            emoji: '🦞' },
    { key: 'lox',         label: 'Lox / Smoked salmon',emoji: '🐟' },
    { key: 'mixed',       label: 'Mixed seafood',      emoji: '🦪' },
    { key: 'sardines',    label: 'Sardines / Kippers', emoji: '🐟' },
    { key: 'otherFish',   label: 'Other fish',         emoji: '🐟' },
  ],
}

export function classifyCut(protein, name) {
  const n = name.toLowerCase()

  if (protein === 'beef') {
    if (/\bcorned beef\b/.test(n))                         return 'cornedBeef'
    if (/\bphilly\b|\bcheesesteak\b/.test(n))              return 'philly'
    if (/\bshort ribs?\b|\bbrisket\b|\bbeef stew\b|\bnoodle soup\b/.test(n)) return 'shortRib'
    if (/\bwellington\b|\bprime rib\b|\bpot roast\b|\broast beef\b/.test(n)) return 'roast'
    if (/\bribeye\b|\bny strip\b|\bsteak\b|\bfajitas?\b|\bbulgogi\b|\bstir[- ]?fry\b|\brisotto\b|\bcobb salad\b/.test(n)) return 'steak'
    return 'ground'
  }

  if (protein === 'pork') {
    if (/\bschnitzel\b/.test(n))                           return 'schnitzel'
    if (/\bbaby back\b|\bbbq (pork )?ribs?\b/.test(n))     return 'ribs'
    if (/\bpulled pork\b|\bcarnitas\b|\bcuban\b|\bbbq pork\b|\bb(á|a)nh m(ì|i)\b|\bpork burrito\b/.test(n)) return 'pulled'
    if (/\bpork belly\b|\bchar siu\b|\bpork ramen\b/.test(n)) return 'belly'
    if (/\bbacon\b|\bblt\b|\bprosciutto\b/.test(n))        return 'bacon'
    if (/\bham\b/.test(n))                                 return 'ham'
    if (/\bsausage\b|\bchorizo\b/.test(n))                 return 'sausage'
    if (/\bchops?\b/.test(n))                              return 'chops'
    if (/\btenderloin\b|\bpork loin\b|\bmaple glazed pork\b|\bpork & sauerkraut\b/.test(n)) return 'tenderloin'
    // Default catch-all for miscellaneous pork dishes (stir-fry, lo mein,
    // fried rice, gyoza, egg roll bowl) — typical home cook uses loin/
    // tenderloin for these.
    return 'tenderloin'
  }

  if (protein === 'chicken') {
    if (/\bwhole chicken\b|\broasted whole\b|\brotisserie\b|\bsmoked chicken\b/.test(n)) return 'whole'
    if (/\bthigh\b/.test(n))                               return 'thigh'
    if (/\bchicken sausage\b/.test(n))                     return 'chickenSausage'
    return 'breast'
  }

  if (protein === 'groundTurkey') {
    if (/\bturkey sausage\b|\bchorizo\b/.test(n))          return 'turkeySausage'
    return 'ground'
  }

  if (protein === 'seafood') {
    if (/\bshrimp\b/.test(n))                              return 'shrimp'
    if (/\blox\b|\bsmoked salmon\b/.test(n))               return 'lox'
    if (/\bsalmon\b/.test(n))                              return 'salmon'
    if (/\bahi\b|\btuna\b/.test(n))                        return 'tuna'
    if (/\bcod\b/.test(n))                                 return 'cod'
    if (/\bcrab\b/.test(n))                                return 'crab'
    if (/\blobster\b/.test(n))                             return 'lobster'
    if (/\bclam\b|\bpaella\b|\bcioppino\b|\bseafood (linguine|paella|stew)\b/.test(n)) return 'mixed'
    if (/\bsardines?\b|\bkippers?\b/.test(n))              return 'sardines'
    return 'otherFish'
  }

  return 'all'
}

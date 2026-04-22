import { useMemo, useState } from 'react'
import { MEALS, PROTEIN_LABELS } from '../data/mealsData'
import { getRecipeIngredients, scaleIngredients } from '../data/recipes'
import { makeGroceryKey } from '../hooks/useMealPlan'
import ServingsPicker from './ServingsPicker'
import CutTag from './CutTag'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

function SearchResultRow({ recipe, picked, servings, setServings, onToggleAdd }) {
  const [open, setOpen] = useState(false)
  const pLabel = PROTEIN_LABELS[recipe.protein]
  const mLabel = MEAL_TYPES.find(m => m.key === recipe.mealType)
  const ingredients = open
    ? scaleIngredients(getRecipeIngredients(recipe.title, recipe.protein), servings)
    : null

  return (
    <li className={`search-result ${open ? 'open' : ''} ${picked ? 'picked' : ''}`}>
      <button
        type="button"
        className="grocery-pick search-pick"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="grocery-check" aria-hidden="true">{picked ? '✓' : ''}</span>
        <span className="grocery-pick-time">{pLabel.emoji} {mLabel.emoji} {mLabel.label}</span>
        <span className="grocery-pick-name">
          {recipe.title}
          <CutTag protein={recipe.protein} name={recipe.title} />
        </span>
        <span className="search-chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="search-result-body">
          <div className="recipe-subhead-row">
            <h4 className="pr-recipe-subhead">Ingredients</h4>
            <ServingsPicker servings={servings} onChange={setServings} />
          </div>
          <ul className="pr-recipe-ingredients">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <button
            type="button"
            className={`add-to-grocery-btn ${picked ? 'picked' : ''}`}
            onClick={() => onToggleAdd(recipe)}
            aria-pressed={picked}
          >
            {picked ? '✓ Added to grocery list' : '🛒 Add to grocery list'}
          </button>
        </div>
      )}
    </li>
  )
}

function buildPool() {
  const out = []
  for (const [protein, types] of Object.entries(MEALS)) {
    for (const t of MEAL_TYPES) {
      for (const name of types[t.key]) {
        out.push({ protein, mealType: t.key, title: name })
      }
    }
  }
  return out
}

function buildPrintHTML(picks, weekNum, servings) {
  const sections = picks.map(p => {
    const scaled = scaleIngredients(p.ingredients, servings)
    return `
    <section class="pick">
      <h3>${p.title}</h3>
      ${p.dateLabel || p.protein ? `<p class="meta">${p.dateLabel ? p.dateLabel + ' · ' : ''}${p.protein ? `${PROTEIN_LABELS[p.protein]?.emoji || ''} ${PROTEIN_LABELS[p.protein]?.label || p.protein}` : 'Seasonal'} · serves ${servings}</p>` : ''}
      <ul>${scaled.map(ing => `<li>${ing}</li>`).join('')}</ul>
    </section>`
  }).join('')
  return `<html><head><title>Grocery List — Week ${weekNum}</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;padding:1.5rem;color:#0F172A;max-width:640px;margin:auto}
      h2{margin-bottom:1rem;background:linear-gradient(90deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;background-clip:text;color:transparent}
      .pick{page-break-inside:avoid;margin-bottom:1.25rem;padding:1rem 1.15rem;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0}
      .pick h3{margin-bottom:.2rem;font-size:1.05rem}
      .meta{color:#475569;font-size:.85rem;margin-bottom:.6rem}
      .pick ul{padding-left:1.2rem}
      .pick li{margin-bottom:.25rem;line-height:1.45;font-size:.93rem}
    </style></head><body>
    <h2>🛒 Grocery List — Week ${weekNum}</h2>
    ${sections}
    </body></html>`
}

export default function GroceryListModal({ weekNum, grocerySelection, toggleGrocery, clearGrocery, servings, setServings, onClose }) {
  const [query, setQuery] = useState('')
  const pool = useMemo(buildPool, [])

  const pickedKeys = useMemo(
    () => new Set(grocerySelection.map(i => i.key)),
    [grocerySelection]
  )
  const isPicked = (protein, title) => pickedKeys.has(makeGroceryKey(protein, title))

  const trimmed = query.trim().toLowerCase()
  const searchResults = trimmed
    ? pool.filter(r => r.title.toLowerCase().includes(trimmed)).slice(0, 40)
    : []

  const handleTogglePoolItem = (protein, mealType, title) => {
    toggleGrocery({
      title,
      protein,
      mealType,
      ingredients: getRecipeIngredients(title, protein),
    })
  }

  const totalItems = grocerySelection.reduce((n, p) => n + p.ingredients.length, 0)

  const handlePrint = () => {
    if (grocerySelection.length === 0) return
    const win = window.open('', '_blank')
    win.document.write(buildPrintHTML(grocerySelection, weekNum, servings))
    win.document.close()
    win.print()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="grocery-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content grocery-modal">
        <div className="modal-header">
          <div>
            <h2 id="grocery-title">🛒 Grocery list</h2>
            <p className="modal-date">Only the recipes you pick show up here. Add them from any day, the protein browser, or the search below.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="grocery-search">
            <span className="grocery-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search any recipe to add (e.g. taco, salmon, stir-fry)…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search recipes"
            />
            {query && (
              <button
                type="button"
                className="grocery-search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {trimmed && (
            <div className="grocery-search-results">
              <p className="setting-hint" style={{ marginBottom: '.6rem' }}>
                {searchResults.length === 0
                  ? 'No matches. Try a simpler term like "soup" or "stir-fry".'
                  : `${searchResults.length} match${searchResults.length === 1 ? '' : 'es'} · tap any to see ingredients`}
              </p>
              <ul className="grocery-pick-list">
                {searchResults.map(r => (
                  <SearchResultRow
                    key={`${r.protein}-${r.mealType}-${r.title}`}
                    recipe={r}
                    picked={isPicked(r.protein, r.title)}
                    servings={servings}
                    setServings={setServings}
                    onToggleAdd={(recipe) => handleTogglePoolItem(recipe.protein, recipe.mealType, recipe.title)}
                  />
                ))}
              </ul>
            </div>
          )}

          <div className="grocery-summary">
            <div className="grocery-summary-header">
              <h3 className="grocery-summary-title">
                Your grocery list
                <span className="grocery-count" key={grocerySelection.length}>
                  {grocerySelection.length} {grocerySelection.length === 1 ? 'recipe' : 'recipes'} · {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </h3>
              <ServingsPicker servings={servings} onChange={setServings} />
            </div>
            {grocerySelection.length === 0 ? (
              <p className="setting-hint">
                Nothing picked yet. Browse a day, the protein chips, seasonal suggestions, or search above — every recipe has a 🛒 Add to list button.
              </p>
            ) : (
              <ul className="grocery-summary-list">
                {grocerySelection.map(p => (
                  <li key={p.key}>
                    <div className="grocery-summary-head">
                      <span className="grocery-summary-meal">
                        {p.title}
                        <CutTag protein={p.protein} name={p.title} />
                      </span>
                      <div className="grocery-summary-meta">
                        <span className="grocery-summary-date">
                          {p.dateLabel
                            ? p.dateLabel
                            : p.protein
                              ? `${PROTEIN_LABELS[p.protein]?.emoji || ''} ${PROTEIN_LABELS[p.protein]?.label || ''}`
                              : 'Seasonal'}
                        </span>
                        <button
                          type="button"
                          className="grocery-summary-remove"
                          onClick={() => toggleGrocery({
                            title: p.title,
                            protein: p.protein,
                            mealType: p.mealType,
                            ingredients: p.ingredients,
                          })}
                          aria-label={`Remove ${p.title} from list`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <ul className="grocery-ingredients">
                      {scaleIngredients(p.ingredients, servings).map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="qr-actions" style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handlePrint}
              disabled={grocerySelection.length === 0}
            >
              🖨️ Print list
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearGrocery}
              disabled={grocerySelection.length === 0}
            >
              Clear list
            </button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

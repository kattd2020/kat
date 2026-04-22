import { useMemo, useState } from 'react'
import { MEALS, PROTEIN_LABELS } from '../data/mealsData'
import { getRecipeIngredients } from '../data/recipes'
import { makeGroceryKey } from '../hooks/useMealPlan'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

// One flat list of every recipe in the MEALS pool for searching.
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

function buildPrintHTML(picks, weekNum) {
  const sections = picks.map(p => `
    <section class="pick">
      <h3>${p.title}</h3>
      ${p.dateLabel || p.protein ? `<p class="meta">${p.dateLabel ? p.dateLabel + ' · ' : ''}${p.protein ? `${PROTEIN_LABELS[p.protein]?.emoji || ''} ${PROTEIN_LABELS[p.protein]?.label || p.protein}` : 'Seasonal'}</p>` : ''}
      <ul>${p.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
    </section>`).join('')
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

export default function GroceryListModal({ weekDays, weekNum, grocerySelection, toggleGrocery, clearGrocery, onClose }) {
  const [query, setQuery] = useState('')
  const pool = useMemo(buildPool, [])

  const pickedKeys = useMemo(
    () => new Set(grocerySelection.map(i => i.key)),
    [grocerySelection]
  )
  const isPicked = (protein, title) => pickedKeys.has(makeGroceryKey(protein, title))

  const trimmed = query.trim().toLowerCase()
  const searching = trimmed.length > 0
  const searchResults = searching
    ? pool
        .filter(r => r.title.toLowerCase().includes(trimmed))
        .slice(0, 40)
    : []

  const handleTogglePoolItem = (protein, mealType, title) => {
    toggleGrocery({
      title,
      protein,
      mealType,
      ingredients: getRecipeIngredients(title, protein),
    })
  }

  const handleToggleDayItem = (day, mealType) => {
    const title = day[mealType]
    toggleGrocery({
      title,
      protein: day.protein,
      mealType,
      ingredients: getRecipeIngredients(title, day.protein),
      dayNumber: day.dayNumber,
      dateLabel: day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    })
  }

  const totalItems = grocerySelection.reduce((n, p) => n + p.ingredients.length, 0)

  const handlePrint = () => {
    if (grocerySelection.length === 0) return
    const win = window.open('', '_blank')
    win.document.write(buildPrintHTML(grocerySelection, weekNum))
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
            <p className="modal-date">Week {weekNum} · pick from the week or search every recipe</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="grocery-search">
            <span className="grocery-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Search any recipe (e.g. taco, salmon, stir-fry)…"
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

          {searching ? (
            <div className="grocery-search-results">
              <p className="setting-hint" style={{ marginBottom: '.6rem' }}>
                {searchResults.length === 0
                  ? 'No matches. Try a simpler term like "soup" or "stir-fry".'
                  : `${searchResults.length} match${searchResults.length === 1 ? '' : 'es'} across all recipes`}
              </p>
              <ul className="grocery-pick-list">
                {searchResults.map(r => {
                  const picked = isPicked(r.protein, r.title)
                  const pLabel = PROTEIN_LABELS[r.protein]
                  const mLabel = MEAL_TYPES.find(m => m.key === r.mealType)
                  return (
                    <li key={`${r.protein}-${r.mealType}-${r.title}`}>
                      <button
                        type="button"
                        className={`grocery-pick ${picked ? 'picked' : ''}`}
                        onClick={() => handleTogglePoolItem(r.protein, r.mealType, r.title)}
                        aria-pressed={picked}
                      >
                        <span className="grocery-check" aria-hidden="true">{picked ? '✓' : ''}</span>
                        <span className="grocery-pick-time">{pLabel.emoji} {mLabel.emoji} {mLabel.label}</span>
                        <span className="grocery-pick-name">{r.title}</span>
                        <span className="grocery-pick-action">{picked ? 'Added' : '+ Add to list'}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="grocery-days">
              {weekDays.map(day => {
                const pLabel = PROTEIN_LABELS[day.protein]
                return (
                  <div key={day.dayNumber} className="grocery-day-block">
                    <div className="grocery-day-head">
                      <strong>
                        {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </strong>
                      <span className={`protein-tag ${day.protein}`}>
                        {pLabel.emoji} {pLabel.label}
                      </span>
                    </div>
                    <ul className="grocery-pick-list">
                      {MEAL_TYPES.map(t => {
                        const picked = isPicked(day.protein, day[t.key])
                        return (
                          <li key={t.key}>
                            <button
                              type="button"
                              className={`grocery-pick ${picked ? 'picked' : ''}`}
                              onClick={() => handleToggleDayItem(day, t.key)}
                              aria-pressed={picked}
                            >
                              <span className="grocery-check" aria-hidden="true">{picked ? '✓' : ''}</span>
                              <span className="grocery-pick-time">{t.emoji} {t.label}</span>
                              <span className="grocery-pick-name">{day[t.key]}</span>
                              <span className="grocery-pick-action">{picked ? 'Added' : '+ Add to list'}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}

          <div className="grocery-summary">
            <h3 className="grocery-summary-title">
              Your grocery list
              <span className="grocery-count">
                {grocerySelection.length} {grocerySelection.length === 1 ? 'recipe' : 'recipes'} · {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </h3>
            {grocerySelection.length === 0 ? (
              <p className="setting-hint">Nothing picked yet. Tap any recipe above — or search — to add its ingredients.</p>
            ) : (
              <ul className="grocery-summary-list">
                {grocerySelection.map(p => (
                  <li key={p.key}>
                    <div className="grocery-summary-head">
                      <span className="grocery-summary-meal">{p.title}</span>
                      <span className="grocery-summary-date">
                        {p.dateLabel
                          ? p.dateLabel
                          : p.protein
                            ? `${PROTEIN_LABELS[p.protein]?.emoji || ''} ${PROTEIN_LABELS[p.protein]?.label || ''}`
                            : 'Seasonal'}
                      </span>
                    </div>
                    <ul className="grocery-ingredients">
                      {p.ingredients.map((ing, i) => (
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
              Clear picks
            </button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

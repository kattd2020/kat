import { useMemo, useState } from 'react'
import { MEALS, PROTEIN_LABELS } from '../data/mealsData'
import { getRecipeSteps, getRecipeIngredients, scaleIngredients } from '../data/recipes'
import { CUTS, classifyCut } from '../data/cuts'
import { makeGroceryKey } from '../hooks/useMealPlan'
import ServingsPicker from './ServingsPicker'
import CutTag from './CutTag'
import TimeTag from './TimeTag'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

function RecipeRow({ name, protein, servings, setServings, picked, onToggleGrocery }) {
  const [open, setOpen] = useState(false)
  const steps = open ? getRecipeSteps(name, protein) : null
  const ingredients = open ? scaleIngredients(getRecipeIngredients(name, protein), servings) : null
  return (
    <li className={`pr-recipe ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="pr-recipe-head"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="pr-recipe-name-col">
          <span className="pr-recipe-name">{name}</span>
          <span className="recipe-tag-row">
            <CutTag protein={protein} name={name} />
            <TimeTag protein={protein} name={name} />
          </span>
        </span>
        <span className="pr-recipe-chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="pr-recipe-body">
          <div className="recipe-subhead-row">
            <h4 className="pr-recipe-subhead">Ingredients</h4>
            <ServingsPicker servings={servings} onChange={setServings} />
          </div>
          <ul className="pr-recipe-ingredients">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <h4 className="pr-recipe-subhead">Steps</h4>
          <ol className="pr-recipe-steps">
            {steps.map((s, i) => (
              <li key={i}><span className="recipe-num">{i + 1}</span>{s}</li>
            ))}
          </ol>
          <button
            type="button"
            className={`add-to-grocery-btn ${picked ? 'picked' : ''}`}
            onClick={() => onToggleGrocery({
              title: name,
              protein,
              mealType: null,
              ingredients: getRecipeIngredients(name, protein),
            })}
            aria-pressed={picked}
          >
            {picked ? '✓ Added to grocery list' : '🛒 Add to grocery list'}
          </button>
        </div>
      )}
    </li>
  )
}

export default function ProteinRecipesModal({ protein, grocerySelection, toggleGrocery, servings, setServings, onClose }) {
  const pool = MEALS[protein]
  const { label, emoji } = PROTEIN_LABELS[protein]
  const cuts = CUTS[protein] || [{ key: 'all', label: 'All' }]
  const [activeCut, setActiveCut] = useState('all')

  const pickedKeys = useMemo(
    () => new Set((grocerySelection || []).map(i => i.key)),
    [grocerySelection]
  )
  const isPicked = (title) => pickedKeys.has(makeGroceryKey(protein, title))

  const filteredPool = useMemo(() => {
    if (activeCut === 'all') return pool
    const filter = (list) => list.filter(n => classifyCut(protein, n) === activeCut)
    return {
      breakfast: filter(pool.breakfast),
      lunch:     filter(pool.lunch),
      dinner:    filter(pool.dinner),
    }
  }, [protein, pool, activeCut])

  const countFor = (cutKey) => {
    if (cutKey === 'all') return pool.breakfast.length + pool.lunch.length + pool.dinner.length
    return [...pool.breakfast, ...pool.lunch, ...pool.dinner]
      .filter(n => classifyCut(protein, n) === cutKey)
      .length
  }

  const filteredTotal =
    filteredPool.breakfast.length + filteredPool.lunch.length + filteredPool.dinner.length

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pr-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content protein-recipes-modal">
        <div className="modal-header">
          <div>
            <h2 id="pr-title">{emoji} {label} recipes</h2>
            <p className="modal-date">
              {filteredTotal} {filteredTotal === 1 ? 'recipe' : 'recipes'}
              {activeCut !== 'all' && ` · ${cuts.find(c => c.key === activeCut)?.label}`}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="pr-cuts" role="group" aria-label="Filter by cut">
            {cuts.map(c => {
              const count = countFor(c.key)
              const disabled = count === 0 && c.key !== 'all'
              return (
                <button
                  key={c.key}
                  type="button"
                  className={`pr-cut ${activeCut === c.key ? 'active' : ''}`}
                  onClick={() => setActiveCut(c.key)}
                  disabled={disabled}
                  aria-pressed={activeCut === c.key}
                >
                  <span aria-hidden="true">{c.emoji}</span> {c.label}
                  <span className="pr-cut-count">{count}</span>
                </button>
              )
            })}
          </div>

          {filteredTotal === 0 ? (
            <p className="setting-hint" style={{ marginTop: '1rem' }}>
              No recipes for that cut yet. Try "All" or another option.
            </p>
          ) : (
            MEAL_TYPES.map(t => (
              filteredPool[t.key].length > 0 && (
                <section key={t.key} className="pr-section">
                  <h3 className="pr-section-title">
                    {t.emoji} {t.label}
                    <span className="pr-count">{filteredPool[t.key].length}</span>
                  </h3>
                  <ul className="pr-list">
                    {filteredPool[t.key].map(name => (
                      <RecipeRow
                        key={name}
                        name={name}
                        protein={protein}
                        servings={servings}
                        setServings={setServings}
                        picked={isPicked(name)}
                        onToggleGrocery={toggleGrocery}
                      />
                    ))}
                  </ul>
                </section>
              )
            ))
          )}

          <div className="qr-actions" style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

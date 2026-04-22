import { useMemo, useState } from 'react'
import { getSeasonalRecipe } from '../data/seasonalRecipes'
import { scaleIngredients } from '../data/recipes'
import { makeGroceryKey } from '../hooks/useMealPlan'

const SEASONS = [
  { name: 'Winter', months: [12, 1, 2], emoji: '❄️', foods: ['citrus', 'root veg', 'kale', 'squash', 'pears', 'pomegranate'] },
  { name: 'Spring', months: [3, 4, 5], emoji: '🌱', foods: ['asparagus', 'peas', 'strawberries', 'radishes', 'herbs', 'artichokes'] },
  { name: 'Summer', months: [6, 7, 8], emoji: '☀️', foods: ['tomatoes', 'corn', 'berries', 'peaches', 'zucchini', 'basil'] },
  { name: 'Fall',   months: [9, 10, 11], emoji: '🍂', foods: ['apples', 'pumpkin', 'Brussels sprouts', 'mushrooms', 'cranberries'] },
]

function currentSeason() {
  const m = new Date().getMonth() + 1
  return SEASONS.find(s => s.months.includes(m)) || SEASONS[0]
}

export default function SeasonalModal({ grocerySelection, toggleGrocery, servings, onClose }) {
  const season = currentSeason()
  const [selected, setSelected] = useState(null)
  const recipe = selected ? getSeasonalRecipe(selected) : null

  const pickedKeys = useMemo(
    () => new Set((grocerySelection || []).map(i => i.key)),
    [grocerySelection]
  )
  const picked = recipe ? pickedKeys.has(makeGroceryKey(undefined, recipe.title)) : false

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="seasonal-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content seasonal-modal">
        <div className="modal-header">
          <div>
            <h2 id="seasonal-title">{season.emoji} Seasonal suggestions</h2>
            <p className="modal-date">{season.name} · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p className="setting-hint" style={{ marginBottom: '1rem' }}>
            These ingredients are at peak flavor and lowest price right now. Tap one for a quick recipe.
          </p>
          <div className="seasonal-chips">
            {season.foods.map(f => (
              <button
                key={f}
                type="button"
                className={`seasonal-chip ${selected === f ? 'active' : ''}`}
                onClick={() => setSelected(selected === f ? null : f)}
                aria-pressed={selected === f}
              >
                {f}
              </button>
            ))}
          </div>

          {recipe && (
            <div className="seasonal-recipe" role="region" aria-label={`Recipe for ${selected}`}>
              <div className="seasonal-recipe-head">
                <div>
                  <h3>{recipe.title}</h3>
                  <p className="seasonal-recipe-meta">⏱ {recipe.time} · using {selected}</p>
                </div>
                <button
                  type="button"
                  className="seasonal-recipe-close"
                  onClick={() => setSelected(null)}
                  aria-label="Close recipe"
                >
                  ✕
                </button>
              </div>

              <h4 className="seasonal-recipe-subhead">Ingredients · serves {servings}</h4>
              <ul className="seasonal-recipe-ingredients">
                {scaleIngredients(recipe.ingredients, servings).map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <h4 className="seasonal-recipe-subhead">Steps</h4>
              <ol className="seasonal-recipe-steps">
                {recipe.steps.map((s, i) => (
                  <li key={i}><span className="recipe-num">{i + 1}</span>{s}</li>
                ))}
              </ol>

              <button
                type="button"
                className={`add-to-grocery-btn ${picked ? 'picked' : ''}`}
                onClick={() => toggleGrocery({
                  title: recipe.title,
                  protein: undefined,
                  mealType: null,
                  ingredients: recipe.ingredients,
                })}
                aria-pressed={picked}
              >
                {picked ? '✓ Added to grocery list' : '🛒 Add to grocery list'}
              </button>
            </div>
          )}

          <div className="qr-actions" style={{ marginTop: '1.75rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

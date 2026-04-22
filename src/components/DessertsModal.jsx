import { useMemo, useState } from 'react'
import { DESSERTS } from '../data/desserts'
import { scaleIngredients } from '../data/recipes'
import { makeGroceryKey } from '../hooks/useMealPlan'
import ServingsPicker from './ServingsPicker'
import StepText from './StepText'

function DessertRow({ recipe, picked, servings, setServings, onToggleAdd }) {
  const [open, setOpen] = useState(false)
  const ingredients = open ? scaleIngredients(recipe.ingredients, servings) : null

  return (
    <li className={`event-recipe ${open ? 'open' : ''} ${picked ? 'picked' : ''}`}>
      <button
        type="button"
        className="event-recipe-head"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="event-recipe-badge">🍰</span>
        <span className="event-recipe-name">
          {recipe.title}
          <span className="recipe-tag-row">
            <span className="time-tag"><span aria-hidden="true">⏱</span> {recipe.time}</span>
          </span>
        </span>
        <span className="event-recipe-chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="event-recipe-body">
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
            {recipe.steps.map((s, i) => (
              <li key={i}>
                <span className="recipe-num">{i + 1}</span>
                <StepText text={s} />
              </li>
            ))}
          </ol>
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

export default function DessertsModal({ grocerySelection, toggleGrocery, servings, setServings, onClose }) {
  const pickedKeys = useMemo(
    () => new Set((grocerySelection || []).map(i => i.key)),
    [grocerySelection]
  )
  const isPicked = (title) => pickedKeys.has(makeGroceryKey(undefined, title))

  const handleToggleAdd = (recipe) => {
    toggleGrocery({
      title: recipe.title,
      protein: undefined,
      mealType: null,
      ingredients: recipe.ingredients,
    })
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="desserts-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content events-modal">
        <div className="modal-header">
          <div>
            <h2 id="desserts-title">🍰 Cheap easy desserts</h2>
            <p className="modal-date">{DESSERTS.length} pantry-friendly treats · mostly under 30 minutes</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <ul className="event-recipes">
            {DESSERTS.map(r => (
              <DessertRow
                key={r.title}
                recipe={r}
                picked={isPicked(r.title)}
                servings={servings}
                setServings={setServings}
                onToggleAdd={handleToggleAdd}
              />
            ))}
          </ul>

          <div className="qr-actions" style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

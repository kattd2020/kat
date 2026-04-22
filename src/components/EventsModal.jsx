import { useMemo, useState } from 'react'
import { PROTEIN_LABELS } from '../data/mealsData'
import { EVENT_MENUS } from '../data/eventMenus'
import { getRecipeIngredients, getRecipeSteps, scaleIngredients } from '../data/recipes'
import { makeGroceryKey } from '../hooks/useMealPlan'
import ServingsPicker from './ServingsPicker'

function resolveRecipe(recipe) {
  if (recipe.custom) {
    return {
      title: recipe.title,
      protein: undefined,
      mealType: null,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    }
  }
  return {
    title: recipe.title,
    protein: recipe.protein,
    mealType: null,
    ingredients: getRecipeIngredients(recipe.title, recipe.protein),
    steps: getRecipeSteps(recipe.title, recipe.protein),
  }
}

function EventRecipeRow({ resolved, picked, servings, setServings, onToggleAdd }) {
  const [open, setOpen] = useState(false)
  const ingredients = open ? scaleIngredients(resolved.ingredients, servings) : null

  return (
    <li className={`event-recipe ${open ? 'open' : ''} ${picked ? 'picked' : ''}`}>
      <button
        type="button"
        className="event-recipe-head"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {resolved.protein && (
          <span className="event-recipe-badge">
            {PROTEIN_LABELS[resolved.protein]?.emoji}
          </span>
        )}
        {!resolved.protein && <span className="event-recipe-badge">✨</span>}
        <span className="event-recipe-name">{resolved.title}</span>
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
            {resolved.steps.map((s, i) => (
              <li key={i}><span className="recipe-num">{i + 1}</span>{s}</li>
            ))}
          </ol>
          <button
            type="button"
            className={`add-to-grocery-btn ${picked ? 'picked' : ''}`}
            onClick={() => onToggleAdd(resolved)}
            aria-pressed={picked}
          >
            {picked ? '✓ Added to grocery list' : '🛒 Add to grocery list'}
          </button>
        </div>
      )}
    </li>
  )
}

export default function EventsModal({ grocerySelection, toggleGrocery, servings, setServings, onClose }) {
  const [activeEvent, setActiveEvent] = useState(null)

  const pickedKeys = useMemo(
    () => new Set((grocerySelection || []).map(i => i.key)),
    [grocerySelection]
  )
  const isPicked = (protein, title) => pickedKeys.has(makeGroceryKey(protein, title))

  const event = activeEvent ? EVENT_MENUS.find(e => e.key === activeEvent) : null

  const handleToggleAdd = (resolved) => {
    toggleGrocery({
      title: resolved.title,
      protein: resolved.protein,
      mealType: null,
      ingredients: resolved.ingredients,
    })
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="events-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content events-modal">
        <div className="modal-header">
          <div>
            <h2 id="events-title">🎉 Event menus</h2>
            <p className="modal-date">
              {event ? `${event.emoji} ${event.title}` : 'Pick an occasion for a curated menu'}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {!event ? (
            <>
              <p className="setting-hint" style={{ marginBottom: '.85rem' }}>
                Tap an event to see a themed set of recipes you can browse and add to your grocery list.
              </p>
              <div className="events-grid">
                {EVENT_MENUS.map(e => (
                  <button
                    key={e.key}
                    type="button"
                    className="event-btn"
                    onClick={() => setActiveEvent(e.key)}
                  >
                    <span className="event-btn-icon" aria-hidden="true">{e.emoji}</span>
                    <span className="event-btn-title">{e.title}</span>
                    <span className="event-btn-blurb">{e.blurb}</span>
                    <span className="event-btn-count">{e.recipes.length} recipes</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="events-back"
                onClick={() => setActiveEvent(null)}
              >
                ← All events
              </button>
              <p className="setting-hint" style={{ marginBottom: '.85rem' }}>
                {event.blurb}
              </p>
              <ul className="event-recipes">
                {event.recipes.map((r, i) => {
                  const resolved = resolveRecipe(r)
                  return (
                    <EventRecipeRow
                      key={`${activeEvent}-${i}-${resolved.title}`}
                      resolved={resolved}
                      picked={isPicked(resolved.protein, resolved.title)}
                      servings={servings}
                      setServings={setServings}
                      onToggleAdd={handleToggleAdd}
                    />
                  )
                })}
              </ul>
            </>
          )}

          <div className="qr-actions" style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

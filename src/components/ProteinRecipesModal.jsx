import { useState } from 'react'
import { MEALS, PROTEIN_LABELS } from '../data/mealsData'
import { getRecipeSteps } from '../data/recipes'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

function RecipeRow({ name, protein }) {
  const [open, setOpen] = useState(false)
  const steps = open ? getRecipeSteps(name, protein) : null
  return (
    <li className={`pr-recipe ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="pr-recipe-head"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="pr-recipe-name">{name}</span>
        <span className="pr-recipe-chevron" aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <ol className="pr-recipe-steps">
          {steps.map((s, i) => (
            <li key={i}><span className="recipe-num">{i + 1}</span>{s}</li>
          ))}
        </ol>
      )}
    </li>
  )
}

export default function ProteinRecipesModal({ protein, onClose }) {
  const pool = MEALS[protein]
  const { label, emoji } = PROTEIN_LABELS[protein]
  const totalCount =
    pool.breakfast.length + pool.lunch.length + pool.dinner.length

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pr-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content protein-recipes-modal">
        <div className="modal-header">
          <div>
            <h2 id="pr-title">{emoji} {label} recipes</h2>
            <p className="modal-date">{totalCount} recipes · tap any to see the steps</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {MEAL_TYPES.map(t => (
            <section key={t.key} className="pr-section">
              <h3 className="pr-section-title">
                {t.emoji} {t.label}
                <span className="pr-count">{pool[t.key].length}</span>
              </h3>
              <ul className="pr-list">
                {pool[t.key].map(name => (
                  <RecipeRow key={name} name={name} protein={protein} />
                ))}
              </ul>
            </section>
          ))}

          <div className="qr-actions" style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

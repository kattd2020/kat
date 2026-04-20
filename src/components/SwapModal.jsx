import { MEALS, PROTEIN_LABELS } from '../data/mealsData'

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { key: 'lunch',     label: 'Lunch',     emoji: '☀️' },
  { key: 'dinner',    label: 'Dinner',    emoji: '🌙' },
]

function pickAlternative(pool, current) {
  const choices = pool.filter(m => m !== current)
  if (choices.length === 0) return current
  return choices[Math.floor(Math.random() * choices.length)]
}

export default function SwapModal({ weekDays, weekNum, onSwap, onClose }) {
  const handleSwap = (day, mealType) => {
    const pool = MEALS[day.protein][mealType]
    const next = pickAlternative(pool, day[mealType])
    onSwap(day.dayNumber, mealType, next)
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="swap-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content swap-modal">
        <div className="modal-header">
          <div>
            <h2 id="swap-title">⚡ Quick-swap recipes</h2>
            <p className="modal-date">Week {weekNum} · tap any meal to swap it</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          {weekDays.map(day => (
            <div key={day.dayNumber} className="swap-day">
              <div className="swap-day-header">
                <strong>{day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
                <span className={`protein-tag ${day.protein}`}>
                  {PROTEIN_LABELS[day.protein].emoji} {PROTEIN_LABELS[day.protein].label}
                </span>
              </div>
              <ul className="swap-meals">
                {MEAL_TYPES.map(t => (
                  <li key={t.key}>
                    <div className="swap-meal-info">
                      <span className="meal-time">{t.emoji} {t.label}</span>
                      <span className="meal-name">{day[t.key]}</span>
                    </div>
                    <button
                      className="btn btn-secondary swap-btn"
                      onClick={() => handleSwap(day, t.key)}
                      aria-label={`Swap ${t.label}`}
                    >
                      🎲 Swap
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="qr-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}

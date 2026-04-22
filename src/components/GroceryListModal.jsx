import { PROTEIN_LABELS } from '../data/mealsData'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

function buildPrintHTML(picks, weekNum) {
  const rows = picks.map(p => `
    <tr>
      <td>${p.date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</td>
      <td>${p.mealEmoji} ${p.mealLabel}</td>
      <td>${p.meal}</td>
      <td>${p.proteinEmoji} ${p.proteinLabel}</td>
    </tr>`).join('')
  return `<html><head><title>Grocery List — Week ${weekNum}</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;padding:1.5rem;color:#0F172A}
      h2{margin-bottom:1rem;background:linear-gradient(90deg,#0EA5E9,#22D3EE);-webkit-background-clip:text;background-clip:text;color:transparent}
      table{border-collapse:collapse;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(15,23,42,.08)}
      th,td{border:1px solid #E2E8F0;padding:10px;text-align:left;font-size:.9rem}
      th{background:linear-gradient(135deg,#0EA5E9,#22D3EE);color:#fff;font-weight:700}
      tr:nth-child(even) td{background:#F8FAFC}
    </style></head><body>
    <h2>🛒 Grocery List — Week ${weekNum}</h2>
    <table>
      <thead><tr><th>Day</th><th>Meal</th><th>Recipe</th><th>Protein</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </body></html>`
}

export default function GroceryListModal({ weekDays, weekNum, grocerySelection, toggleGrocery, clearGrocery, onClose }) {
  const isPicked = (dayNumber, mealType) =>
    grocerySelection.includes(`${dayNumber}-${mealType}`)

  const picks = []
  for (const day of weekDays) {
    for (const t of MEAL_TYPES) {
      if (isPicked(day.dayNumber, t.key)) {
        picks.push({
          date: day.date,
          meal: day[t.key],
          mealEmoji: t.emoji,
          mealLabel: t.label,
          proteinEmoji: PROTEIN_LABELS[day.protein].emoji,
          proteinLabel: PROTEIN_LABELS[day.protein].label,
        })
      }
    }
  }

  const handlePrint = () => {
    if (picks.length === 0) return
    const win = window.open('', '_blank')
    win.document.write(buildPrintHTML(picks, weekNum))
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
            <p className="modal-date">Week {weekNum} · tap meals to add them to your list</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="grocery-days">
            {weekDays.map(day => {
              const proteinLabel = PROTEIN_LABELS[day.protein]
              return (
                <div key={day.dayNumber} className="grocery-day-block">
                  <div className="grocery-day-head">
                    <strong>
                      {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </strong>
                    <span className={`protein-tag ${day.protein}`}>
                      {proteinLabel.emoji} {proteinLabel.label}
                    </span>
                  </div>
                  <ul className="grocery-pick-list">
                    {MEAL_TYPES.map(t => {
                      const picked = isPicked(day.dayNumber, t.key)
                      return (
                        <li key={t.key}>
                          <button
                            type="button"
                            className={`grocery-pick ${picked ? 'picked' : ''}`}
                            onClick={() => toggleGrocery(day.dayNumber, t.key)}
                            aria-pressed={picked}
                          >
                            <span className="grocery-check" aria-hidden="true">
                              {picked ? '✓' : ''}
                            </span>
                            <span className="grocery-pick-time">{t.emoji} {t.label}</span>
                            <span className="grocery-pick-name">{day[t.key]}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="grocery-summary">
            <h3 className="grocery-summary-title">
              Your list <span className="grocery-count">{picks.length} {picks.length === 1 ? 'meal' : 'meals'}</span>
            </h3>
            {picks.length === 0 ? (
              <p className="setting-hint">Nothing picked yet. Tap any meal above to add it.</p>
            ) : (
              <ul className="grocery-summary-list">
                {picks.map((p, i) => (
                  <li key={i}>
                    <span className="grocery-summary-date">
                      {p.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="grocery-summary-meal">
                      {p.mealEmoji} {p.meal}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="qr-actions" style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handlePrint}
              disabled={picks.length === 0}
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

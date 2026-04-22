import { PROTEIN_LABELS } from '../data/mealsData'
import { getRecipeIngredients } from '../data/recipes'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

function buildPrintHTML(picks, weekNum) {
  const sections = picks.map(p => `
    <section class="pick">
      <h3>${p.mealEmoji} ${p.meal}</h3>
      <p class="meta">${p.dateLabel} · ${p.proteinEmoji} ${p.proteinLabel}</p>
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
  const isPicked = (dayNumber, mealType) =>
    grocerySelection.includes(`${dayNumber}-${mealType}`)

  const picks = []
  for (const day of weekDays) {
    for (const t of MEAL_TYPES) {
      if (isPicked(day.dayNumber, t.key)) {
        picks.push({
          key: `${day.dayNumber}-${t.key}`,
          date: day.date,
          dateLabel: day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          meal: day[t.key],
          mealEmoji: t.emoji,
          mealLabel: t.label,
          proteinEmoji: PROTEIN_LABELS[day.protein].emoji,
          proteinLabel: PROTEIN_LABELS[day.protein].label,
          ingredients: getRecipeIngredients(day[t.key], day.protein),
        })
      }
    }
  }

  const totalItems = picks.reduce((n, p) => n + p.ingredients.length, 0)

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
            <p className="modal-date">Week {weekNum} · tap meals to add their ingredients to your list</p>
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
                            <span className="grocery-pick-action">
                              {picked ? 'Added' : '+ Add to list'}
                            </span>
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
              Your grocery list
              <span className="grocery-count">
                {picks.length} {picks.length === 1 ? 'recipe' : 'recipes'} · {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </h3>
            {picks.length === 0 ? (
              <p className="setting-hint">Nothing picked yet. Tap any meal above to add its ingredients.</p>
            ) : (
              <ul className="grocery-summary-list">
                {picks.map(p => (
                  <li key={p.key}>
                    <div className="grocery-summary-head">
                      <span className="grocery-summary-meal">
                        {p.mealEmoji} {p.meal}
                      </span>
                      <span className="grocery-summary-date">{p.dateLabel}</span>
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

import { useEffect } from 'react'
import { PROTEIN_LABELS } from '../data/mealsData'

// Estimated cost per meal per protein type (USD)
const MEAL_COST = {
  beef:         { breakfast: 4.50, lunch: 7.50, dinner: 11.00 },
  pork:         { breakfast: 3.50, lunch: 6.00, dinner: 8.50  },
  chicken:      { breakfast: 3.00, lunch: 5.50, dinner: 7.50  },
  groundTurkey: { breakfast: 2.75, lunch: 5.00, dinner: 7.00  },
  seafood:      { breakfast: 4.00, lunch: 7.00, dinner: 10.50 },
}

const TIPS = [
  'Buy proteins in bulk and freeze in meal-sized portions.',
  'Ground turkey and chicken are consistently the cheapest proteins.',
  'Shop store-brand pantry staples — they cut costs 20–30%.',
  'Plan your week around what\'s on sale this week at your store.',
  'Eggs are always the cheapest breakfast protein — swap in freely.',
  'Frozen seafood is just as nutritious and 40% cheaper than fresh.',
]

function fmt(n) { return `$${n.toFixed(2)}` }

export default function CostCalculatorModal({ weekDays, weekNum, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const days = weekDays.map(d => {
    const costs = MEAL_COST[d.protein]
    const daily = costs.breakfast + costs.lunch + costs.dinner
    return { ...d, costs, daily }
  })

  const weekTotal = days.reduce((s, d) => s + d.daily, 0)
  const monthEst  = weekTotal * 4.33
  const yearEst   = weekTotal * 52

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cost-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content cost-modal">
        <div className="modal-header">
          <div>
            <h2 id="cost-title">💰 Cost Calculator</h2>
            <p className="modal-date">Week {weekNum} · estimated meal costs</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="cost-summary">
            <div className="cost-stat">
              <span className="cost-stat-value">{fmt(weekTotal)}</span>
              <span className="cost-stat-label">this week</span>
            </div>
            <div className="cost-stat">
              <span className="cost-stat-value">{fmt(monthEst)}</span>
              <span className="cost-stat-label">per month</span>
            </div>
            <div className="cost-stat">
              <span className="cost-stat-value">{fmt(yearEst)}</span>
              <span className="cost-stat-label">per year</span>
            </div>
          </div>

          <div className="cost-breakdown">
            {days.map(d => (
              <div key={d.dayNumber} className="cost-row">
                <div className="cost-row-left">
                  <span className="cost-protein-emoji">{PROTEIN_LABELS[d.protein].emoji}</span>
                  <div>
                    <div className="cost-row-date">
                      {d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="cost-row-protein">{PROTEIN_LABELS[d.protein].label}</div>
                  </div>
                </div>
                <div className="cost-row-meals">
                  <span title="Breakfast">{fmt(d.costs.breakfast)}</span>
                  <span title="Lunch">{fmt(d.costs.lunch)}</span>
                  <span title="Dinner">{fmt(d.costs.dinner)}</span>
                </div>
                <div className="cost-row-total">{fmt(d.daily)}</div>
              </div>
            ))}
          </div>

          <div className="cost-legend">
            <span>🌅 Breakfast</span><span>☀️ Lunch</span><span>🌙 Dinner</span>
          </div>

          <div className="cost-tips">
            <h4 className="cost-tips-heading">💡 Budget tips</h4>
            <ul>
              {TIPS.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>

          <div className="qr-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

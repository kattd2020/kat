import { useState } from 'react'
import { PROTEIN_LABELS } from '../data/mealsData'
import { estimateMealCost, estimateDayCost, estimateWeekCost, formatUSD } from '../data/costs'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function CostModal({ weekDays, weekNum, totalWeeks, onClose }) {
  const [people, setPeople] = useState(1)

  const weekTotal  = estimateWeekCost(weekDays)
  const weekScaled = weekTotal * people
  const yearScaled = Math.round(weekScaled * (totalWeeks || 52) * 100) / 100
  const avgPerDay  = Math.round((weekScaled / Math.max(weekDays.length, 1)) * 100) / 100

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cost-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content cost-modal">
        <div className="modal-header">
          <div>
            <h2 id="cost-title">💰 Cost estimator</h2>
            <p className="modal-date">Week {weekNum} · rough US grocery estimates</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="cost-controls">
            <label htmlFor="peopleInput">Diners</label>
            <input
              id="peopleInput"
              type="number"
              min="1"
              max="20"
              value={people}
              onChange={e => setPeople(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            />
          </div>

          <div className="cost-summary">
            <div className="cost-stat">
              <span className="cost-stat-label">Weekly</span>
              <span className="cost-stat-value">{formatUSD(weekScaled)}</span>
            </div>
            <div className="cost-stat">
              <span className="cost-stat-label">Per day</span>
              <span className="cost-stat-value">{formatUSD(avgPerDay)}</span>
            </div>
            <div className="cost-stat cost-stat-hero">
              <span className="cost-stat-label">Yearly projection</span>
              <span className="cost-stat-value">{formatUSD(yearScaled)}</span>
            </div>
          </div>

          <table className="cost-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Protein</th>
                <th className="num">🌅</th>
                <th className="num">☀️</th>
                <th className="num">🌙</th>
                <th className="num">Day</th>
              </tr>
            </thead>
            <tbody>
              {weekDays.map(day => {
                const dayName = DAY_NAMES[day.date.getDay()]
                const { emoji } = PROTEIN_LABELS[day.protein]
                const costs = MEAL_TYPES.map(t =>
                  estimateMealCost(day[t.key], day.protein, t.key) * people
                )
                const dayTotal = estimateDayCost(day) * people
                return (
                  <tr key={day.dayNumber}>
                    <td>
                      <strong>{dayName}</strong>
                      <br/>
                      <small>{day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small>
                    </td>
                    <td><span className="cost-protein">{emoji}</span></td>
                    {costs.map((c, i) => (
                      <td key={i} className="num">{formatUSD(c)}</td>
                    ))}
                    <td className="num"><strong>{formatUSD(dayTotal)}</strong></td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <p className="setting-hint" style={{ marginTop: '1rem' }}>
            Estimates blend typical US grocery prices for the protein, pantry basics for the
            meal time, and a small premium for specialty ingredients (shrimp, salmon, ribeye,
            lobster, risotto, etc.). Actual costs vary with store, sales, and servings.
          </p>

          <div className="qr-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

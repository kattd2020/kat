import { useState } from 'react'
import { PROTEIN_LABELS } from '../data/mealsData'
import {
  estimateMealCost, estimateDayCost, estimateWeekCost, formatUSD,
  getProteinBase, getMealPantry,
  DEFAULT_PROTEIN_BASE, DEFAULT_MEAL_PANTRY,
} from '../data/costs'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const PROTEINS = ['beef', 'pork', 'chicken', 'groundTurkey', 'seafood']

function PriceInput({ id, value, defaultValue, onChange }) {
  return (
    <div className="price-input">
      <span className="price-input-prefix">$</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step="0.25"
        placeholder={defaultValue.toFixed(2)}
        value={value === undefined ? '' : value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default function CostModal({ weekDays, weekNum, totalWeeks, priceOverrides, setPrice, resetPrices, onClose }) {
  const [people, setPeople] = useState(1)
  const [showEditor, setShowEditor] = useState(true)

  const weekTotal  = estimateWeekCost(weekDays, priceOverrides)
  const weekScaled = weekTotal * people
  const yearScaled = Math.round(weekScaled * (totalWeeks || 52) * 100) / 100
  const avgPerDay  = Math.round((weekScaled / Math.max(weekDays.length, 1)) * 100) / 100

  const hasOverrides =
    (priceOverrides?.proteinBase && Object.keys(priceOverrides.proteinBase).length > 0) ||
    (priceOverrides?.mealPantry   && Object.keys(priceOverrides.mealPantry).length > 0)

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cost-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content cost-modal">
        <div className="modal-header">
          <div>
            <h2 id="cost-title">💰 Cost calculator</h2>
            <p className="modal-date">
              Week {weekNum}
              {hasOverrides ? ' · using your custom prices' : ' · using default estimates'}
            </p>
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

          <div className="price-editor">
            <button
              type="button"
              className="price-editor-toggle"
              onClick={() => setShowEditor(v => !v)}
              aria-expanded={showEditor}
            >
              {showEditor ? '▾ Your store prices' : '▸ Your store prices'}
            </button>

            {showEditor && (
              <>
                <p className="setting-hint" style={{ margin: '.35rem 0 .85rem' }}>
                  Enter what you actually pay per serving at your store. Leave blank to use the defaults shown as placeholders. Changes save automatically and flow through the daily cards and weekly total.
                </p>

                <h4 className="price-editor-subhead">Protein (per serving)</h4>
                <div className="price-grid">
                  {PROTEINS.map(p => {
                    const label = PROTEIN_LABELS[p]
                    return (
                      <label key={p} className="price-row">
                        <span><span className="price-emoji">{label.emoji}</span> {label.label}</span>
                        <PriceInput
                          id={`price-protein-${p}`}
                          value={priceOverrides?.proteinBase?.[p]}
                          defaultValue={DEFAULT_PROTEIN_BASE[p]}
                          onChange={v => setPrice('proteinBase', p, v)}
                        />
                      </label>
                    )
                  })}
                </div>

                <h4 className="price-editor-subhead">Pantry & sides (per meal)</h4>
                <div className="price-grid">
                  {MEAL_TYPES.map(t => (
                    <label key={t.key} className="price-row">
                      <span><span className="price-emoji">{t.emoji}</span> {t.label}</span>
                      <PriceInput
                        id={`price-meal-${t.key}`}
                        value={priceOverrides?.mealPantry?.[t.key]}
                        defaultValue={DEFAULT_MEAL_PANTRY[t.key]}
                        onChange={v => setPrice('mealPantry', t.key, v)}
                      />
                    </label>
                  ))}
                </div>

                <div className="price-editor-footer">
                  <button
                    type="button"
                    className="btn btn-secondary price-reset-btn"
                    onClick={resetPrices}
                    disabled={!hasOverrides}
                  >
                    Reset to defaults
                  </button>
                  <span className="price-editor-hint">
                    Effective protein now: {PROTEINS.map(p => `${PROTEIN_LABELS[p].emoji} ${formatUSD(getProteinBase(p, priceOverrides))}`).join('  ·  ')}
                  </span>
                </div>
              </>
            )}
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
                  estimateMealCost(day[t.key], day.protein, t.key, priceOverrides) * people
                )
                const dayTotal = estimateDayCost(day, priceOverrides) * people
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
            Totals also add a small premium for meals with specialty ingredients (shrimp, salmon, ribeye, lobster, risotto, etc.). Those extras aren't editable yet. Effective pantry: {MEAL_TYPES.map(t => `${t.emoji} ${formatUSD(getMealPantry(t.key, priceOverrides))}`).join(' · ')}.
          </p>

          <div className="qr-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

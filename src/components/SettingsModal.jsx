import { useState } from 'react'

function toInputValue(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const SERVING_OPTIONS = [1, 2, 3, 4, 5, 6]

export default function SettingsModal({ startDate, servings, onSaveStartDate, onSetServings, onClose }) {
  const [dateValue, setDateValue] = useState(toInputValue(startDate))

  const handleSaveDate = () => {
    if (dateValue) {
      onSaveStartDate(dateValue)
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content settings-modal">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="setting-group">
            <label htmlFor="startDateInput">Plan start date</label>
            <div className="setting-row">
              <input
                id="startDateInput"
                type="date"
                value={dateValue}
                onChange={e => setDateValue(e.target.value)}
              />
              <button className="btn btn-primary setting-save-btn" onClick={handleSaveDate}>
                Save
              </button>
            </div>
            <p className="setting-hint">
              Day 1 of your 365-day plan. Adjust this to align meals with any start date.
            </p>
          </div>

          <div className="setting-group">
            <label>Servings per recipe</label>
            <div className="servings-picker" role="radiogroup" aria-label="Servings per recipe">
              {SERVING_OPTIONS.map(n => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={servings === n}
                  className={`servings-btn ${servings === n ? 'active' : ''}`}
                  onClick={() => onSetServings(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="setting-hint">
              Recipes and grocery quantities scale automatically to this many people. Changes apply instantly across the app.
            </p>
          </div>

          <div className="qr-actions" style={{ marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}

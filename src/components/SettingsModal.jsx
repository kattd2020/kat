import { useState } from 'react'

function toInputValue(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function SettingsModal({ startDate, onSave, onClose }) {
  const [value, setValue] = useState(toInputValue(startDate))

  const handleSave = () => {
    if (value) {
      onSave(value)
      onClose()
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
            <label htmlFor="startDateInput">Plan Start Date</label>
            <input
              id="startDateInput"
              type="date"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <p className="setting-hint">
              Day 1 of your 365-day plan. Adjust this to align meals with any start date.
            </p>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

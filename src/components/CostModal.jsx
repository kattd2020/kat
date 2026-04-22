import { useRef, useState } from 'react'
import { formatUSD } from '../data/costs'

export default function CostModal({ calcEntries, addCalcEntry, removeCalcEntry, clearCalc, onClose }) {
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  const total = calcEntries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

  const handleAdd = (e) => {
    e?.preventDefault?.()
    const n = Number(draft)
    if (!Number.isFinite(n) || n <= 0) return
    addCalcEntry(n)
    setDraft('')
    inputRef.current?.focus()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="calc-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content calc-modal">
        <div className="modal-header">
          <h2 id="calc-title">💰 Cost calculator</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="calc-total" aria-live="polite" aria-label={`Total ${formatUSD(total)}`}>
            {formatUSD(total)}
          </div>

          <form className="calc-entry" onSubmit={handleAdd}>
            <span className="calc-prefix">$</span>
            <input
              ref={inputRef}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary calc-add">Add</button>
          </form>

          {calcEntries.length > 0 && (
            <>
              <ul className="calc-list">
                {calcEntries.map(e => (
                  <li key={e.id}>
                    <span>{formatUSD(e.amount)}</span>
                    <button
                      type="button"
                      className="calc-remove"
                      onClick={() => removeCalcEntry(e.id)}
                      aria-label={`Remove ${formatUSD(e.amount)}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="calc-actions">
                <button type="button" className="btn btn-secondary" onClick={clearCalc}>
                  Clear all
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'

export default function CostCalculatorModal({ onClose }) {
  const [items, setItems]   = useState([{ id: 1, name: '', price: '' }])
  const [nextId, setNextId] = useState(2)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const total = items.reduce((sum, it) => {
    const p = parseFloat(it.price)
    return sum + (isNaN(p) ? 0 : p)
  }, 0)

  const updateItem = (id, field, value) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it))

  const addRow = () => {
    setItems(prev => [...prev, { id: nextId, name: '', price: '' }])
    setNextId(n => n + 1)
  }

  const removeRow = (id) =>
    setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== id) : prev)

  const reset = () => { setItems([{ id: 1, name: '', price: '' }]); setNextId(2) }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cost-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content cost-modal">
        <div className="modal-header">
          <div>
            <h2 id="cost-title">💰 Cost Calculator</h2>
            <p className="modal-date">Punch in prices as you shop</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="cost-total-banner">
            <span className="cost-total-label">Running total</span>
            <span className="cost-total-value">${total.toFixed(2)}</span>
          </div>

          <div className="cost-items">
            {items.map((item, idx) => (
              <div key={item.id} className="cost-item-row">
                <input
                  className="cost-item-name"
                  type="text"
                  placeholder={`Item ${idx + 1}`}
                  value={item.name}
                  onChange={e => updateItem(item.id, 'name', e.target.value)}
                  autoFocus={idx === items.length - 1 && idx > 0}
                />
                <div className="cost-item-price-wrap">
                  <span className="cost-dollar">$</span>
                  <input
                    className="cost-item-price"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={e => updateItem(item.id, 'price', e.target.value)}
                  />
                </div>
                <button
                  className="cost-remove"
                  onClick={() => removeRow(item.id)}
                  aria-label="Remove item"
                >✕</button>
              </div>
            ))}
          </div>

          <button className="btn btn-secondary cost-add-btn" onClick={addRow}>
            + Add item
          </button>

          <div className="qr-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={reset}>🗑️ Reset</button>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  )
}

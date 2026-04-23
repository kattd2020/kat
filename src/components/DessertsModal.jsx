import { useEffect } from 'react'

const DESSERTS = [
  { name: 'Mug Brownie',          cost: '$0.60', time: '3 min',  emoji: '🍫' },
  { name: 'Banana Ice Cream',     cost: '$0.50', time: '5 min',  emoji: '🍌' },
  { name: 'Fruit Dip',            cost: '$1.25', time: '5 min',  emoji: '🍓' },
  { name: 'No-Bake Cookies',      cost: '$0.75', time: '15 min', emoji: '🍪' },
  { name: 'Rice Krispie Treats',  cost: '$0.65', time: '10 min', emoji: '🟡' },
  { name: 'Peanut Butter Fudge',  cost: '$0.80', time: '10 min', emoji: '🥜' },
  { name: 'Chia Pudding',         cost: '$0.90', time: '5 min',  emoji: '🥛' },
  { name: 'Cinnamon Baked Pears', cost: '$1.00', time: '20 min', emoji: '🍐' },
  { name: 'Chocolate Bark',       cost: '$1.10', time: '15 min', emoji: '🍫' },
  { name: 'Apple Nachos',         cost: '$1.25', time: '5 min',  emoji: '🍎' },
  { name: 'Stovetop Popcorn',     cost: '$0.40', time: '5 min',  emoji: '🍿' },
  { name: 'Greek Yogurt Parfait', cost: '$1.50', time: '5 min',  emoji: '🫙' },
]

export default function DessertsModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="desserts-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content desserts-modal">
        <div className="modal-header">
          <div>
            <h2 id="desserts-title">🍰 Cheap Easy Desserts</h2>
            <p className="modal-date">Under $2 a serving · mostly under 15 min</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="desserts-list">
            {DESSERTS.map(d => (
              <div key={d.name} className="dessert-row">
                <span className="dessert-emoji">{d.emoji}</span>
                <span className="dessert-name">{d.name}</span>
                <span className="dessert-meta">
                  <span className="dessert-cost">{d.cost}</span>
                  <span className="dessert-time">{d.time}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="qr-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'

const EVENTS = [
  {
    key: 'cookout',
    emoji: '🔥',
    name: 'Cookout',
    meals: ['BBQ Ribs', 'Grilled Corn', 'Coleslaw', 'Potato Salad', 'Grilled Chicken Thighs', 'Watermelon Slices'],
  },
  {
    key: 'july4',
    emoji: '🎆',
    name: '4th of July',
    meals: ['Hot Dogs', 'Hamburgers', 'Baked Beans', 'Deviled Eggs', 'Pasta Salad', 'Strawberry Shortcake'],
  },
  {
    key: 'football',
    emoji: '🏈',
    name: 'Football Party',
    meals: ['Buffalo Wings', 'Chili', 'Nachos', 'Pigs in a Blanket', 'Guacamole & Chips', 'Spinach Dip'],
  },
  {
    key: 'holiday',
    emoji: '🦃',
    name: 'Holiday Dinner',
    meals: ['Roast Turkey', 'Mashed Potatoes', 'Green Bean Casserole', 'Stuffing', 'Cranberry Sauce', 'Pumpkin Pie'],
  },
  {
    key: 'brunch',
    emoji: '🥂',
    name: 'Brunch',
    meals: ['Eggs Benedict', 'Avocado Toast', 'Pancakes', 'Mimosas', 'Fresh Fruit Bowl', 'Smoked Salmon Bagels'],
  },
  {
    key: 'taco',
    emoji: '🌮',
    name: 'Taco Night',
    meals: ['Ground Beef Tacos', 'Chicken Fajitas', 'Pico de Gallo', 'Guacamole', 'Mexican Rice', 'Churros'],
  },
]

export default function EventMenusModal({ onClose }) {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (selected ? setSelected(null) : onClose())
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, selected])

  const event = selected ? EVENTS.find(e => e.key === selected) : null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="events-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content events-modal">
        <div className="modal-header">
          <div>
            <h2 id="events-title">🎉 Event Menus</h2>
            <p className="modal-date">Curated recipe packs for every occasion</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {!event ? (
            <div className="event-grid">
              {EVENTS.map(e => (
                <button
                  key={e.key}
                  className="event-card"
                  onClick={() => setSelected(e.key)}
                >
                  <span className="event-emoji">{e.emoji}</span>
                  <span className="event-name">{e.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <button className="event-back" onClick={() => setSelected(null)}>
                ← Back
              </button>
              <div className="event-detail-header">
                <span className="event-emoji-lg">{event.emoji}</span>
                <h3>{event.name}</h3>
              </div>
              <ul className="event-meal-list">
                {event.meals.map(m => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </>
          )}

          <div className="qr-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SEASONS = [
  { name: 'Winter', months: [12, 1, 2], emoji: '❄️', foods: ['citrus', 'root veg', 'kale', 'squash', 'pears', 'pomegranate'] },
  { name: 'Spring', months: [3, 4, 5], emoji: '🌱', foods: ['asparagus', 'peas', 'strawberries', 'radishes', 'herbs', 'artichokes'] },
  { name: 'Summer', months: [6, 7, 8], emoji: '☀️', foods: ['tomatoes', 'corn', 'berries', 'peaches', 'zucchini', 'basil'] },
  { name: 'Fall',   months: [9, 10, 11], emoji: '🍂', foods: ['apples', 'pumpkin', 'Brussels sprouts', 'mushrooms', 'cranberries'] },
]

function currentSeason() {
  const m = new Date().getMonth() + 1
  return SEASONS.find(s => s.months.includes(m)) || SEASONS[0]
}

export default function SeasonalModal({ onClose }) {
  const season = currentSeason()
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="seasonal-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content seasonal-modal">
        <div className="modal-header">
          <div>
            <h2 id="seasonal-title">{season.emoji} Seasonal suggestions</h2>
            <p className="modal-date">{season.name} · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p className="setting-hint" style={{ marginBottom: '1rem' }}>
            These ingredients are at peak flavor and lowest price right now. Build your meals around them.
          </p>
          <div className="seasonal-chips">
            {season.foods.map(f => (
              <span key={f} className="seasonal-chip">{f}</span>
            ))}
          </div>
          <div className="qr-actions" style={{ marginTop: '1.75rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

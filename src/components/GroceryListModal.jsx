import { PROTEIN_LABELS } from '../data/mealsData'

function buildPrintHTML(weekDays, weekNum) {
  const rows = weekDays.map(d => `
    <tr>
      <td>${d.date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</td>
      <td>${d.breakfast}</td>
      <td>${d.lunch}</td>
      <td>${d.dinner}</td>
    </tr>`).join('')
  return `<html><head><title>Grocery List — Week ${weekNum}</title>
    <style>
      body{font-family:sans-serif;padding:1.5rem}
      h2{margin-bottom:1rem}
      table{border-collapse:collapse;width:100%}
      th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:.85rem}
      th{background:#0F172A;color:#fff}
    </style></head><body>
    <h2>🛒 Grocery List — Week ${weekNum}</h2>
    <table>
      <thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </body></html>`
}

export default function GroceryListModal({ weekDays, weekNum, onClose }) {
  const handlePrint = () => {
    const win = window.open('', '_blank')
    win.document.write(buildPrintHTML(weekDays, weekNum))
    win.document.close()
    win.print()
  }

  const byProtein = weekDays.reduce((acc, d) => {
    acc[d.protein] = acc[d.protein] || []
    acc[d.protein].push(d)
    return acc
  }, {})

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="grocery-title">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content grocery-modal">
        <div className="modal-header">
          <div>
            <h2 id="grocery-title">🛒 Grocery List</h2>
            <p className="modal-date">Week {weekNum} · {weekDays.length} days</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p className="setting-hint" style={{ marginBottom: '1rem' }}>
            Meals this week grouped by protein. Print for the store.
          </p>
          {Object.entries(byProtein).map(([protein, days]) => (
            <div key={protein} className="grocery-group">
              <h3 className="grocery-protein">
                {PROTEIN_LABELS[protein].emoji} {PROTEIN_LABELS[protein].label}
              </h3>
              <ul className="grocery-list">
                {days.map(d => (
                  <li key={d.dayNumber}>
                    <span className="grocery-day">
                      {d.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="grocery-meals">
                      {d.breakfast} · {d.lunch} · {d.dinner}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="qr-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handlePrint}>🖨️ Print list</button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

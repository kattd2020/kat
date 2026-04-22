import { PROTEIN_LABELS } from '../data/mealsData'

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const fmt = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

export default function DayCard({ day, dimmed, onClick }) {
  const { label, emoji } = PROTEIN_LABELS[day.protein]
  const dayName = DAY_NAMES[day.date.getDay()]

  return (
    <article
      className={`day-card ${day.protein} ${dimmed ? 'dimmed' : ''}`}
      onClick={() => onClick(day)}
      tabIndex={0}
      role="button"
      aria-label={`Day ${day.dayNumber}: ${dayName} ${fmt(day.date)}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(day)}
    >
      <div className="day-card-header">
        <div className="day-card-date">
          <span className="day-name">{dayName}</span>
          <span className="day-date">{fmt(day.date)}</span>
        </div>
        <div className="day-number">Day {day.dayNumber}</div>
      </div>

      <div className="protein-tag">
        <span>{emoji}</span> {label}
      </div>

      <ul className="meal-list">
        <li><span className="meal-time">🌅 Breakfast</span><span className="meal-name">{day.breakfast}</span></li>
        <li><span className="meal-time">☀️ Lunch</span><span className="meal-name">{day.lunch}</span></li>
        <li><span className="meal-time">🌙 Dinner</span><span className="meal-name">{day.dinner}</span></li>
      </ul>
    </article>
  )
}

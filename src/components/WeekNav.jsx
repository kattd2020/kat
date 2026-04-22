const fmt = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

export default function WeekNav({
  currentWeek, totalWeeks, weekStartDate, weekEndDate,
  onPrev, onNext, onToday, onJump,
}) {
  return (
    <>
      <div className="week-nav">
        <button className="nav-btn" onClick={onPrev} disabled={currentWeek === 0} aria-label="Previous week">
          ‹ Prev
        </button>
        <div className="week-info">
          <span className="week-label">Week {currentWeek + 1}</span>
          <span className="week-dates">{fmt(weekStartDate)} – {fmt(weekEndDate)}</span>
        </div>
        <button className="today-btn" onClick={onToday}>Today</button>
        <button className="nav-btn" onClick={onNext} disabled={currentWeek === totalWeeks - 1} aria-label="Next week">
          Next ›
        </button>
      </div>

      <div className="week-jump">
        <label htmlFor="weekSelect">Jump to:</label>
        <select
          id="weekSelect"
          value={currentWeek}
          onChange={e => onJump(e.target.value)}
          aria-label="Jump to week"
        >
          {Array.from({ length: totalWeeks }, (_, i) => (
            <option key={i} value={i}>Week {i + 1}</option>
          ))}
        </select>
      </div>
    </>
  )
}

import { useState, useCallback } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import WeekNav from './components/WeekNav'
import DayCard from './components/DayCard'
import DayModal from './components/DayModal'
import SettingsModal from './components/SettingsModal'
import { useMealPlan } from './hooks/useMealPlan'
import './styles.css'

function buildWeekPrintHTML(weekDays, weekNum) {
  const rows = weekDays.map(d => `
    <tr>
      <td>${d.date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}<br/><small>Day ${d.dayNumber}</small></td>
      <td>${d.breakfast}</td>
      <td>${d.lunch}</td>
      <td>${d.dinner}</td>
    </tr>`).join('')
  return `<html><head><title>Week ${weekNum} Meal Plan</title>
    <style>
      body{font-family:sans-serif;padding:1.5rem}
      h2{margin-bottom:1rem}
      table{border-collapse:collapse;width:100%}
      th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:.85rem}
      th{background:#2C3E50;color:#fff}
    </style></head><body>
    <h2>🍽️ Meal Plan — Week ${weekNum}</h2>
    <table>
      <thead><tr><th>Day</th><th>🌅 Breakfast</th><th>☀️ Lunch</th><th>🌙 Dinner</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </body></html>`
}

export default function App() {
  const {
    startDate, currentWeek, totalWeeks, weekDays,
    weekStartDate, weekEndDate, activeFilter, setActiveFilter,
    selectedDay, setSelectedDay,
    goToPrevWeek, goToNextWeek, goToToday, jumpToWeek, saveStartDate,
  } = useMealPlan()

  const [showSettings, setShowSettings] = useState(false)

  const handlePrintWeek = useCallback(() => {
    const win = window.open('', '_blank')
    win.document.write(buildWeekPrintHTML(weekDays, currentWeek + 1))
    win.document.close()
    win.print()
  }, [weekDays, currentWeek])

  return (
    <div id="app">
      <Header onPrintWeek={handlePrintWeek} onOpenSettings={() => setShowSettings(true)} />

      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      <WeekNav
        currentWeek={currentWeek}
        totalWeeks={totalWeeks}
        weekStartDate={weekStartDate}
        weekEndDate={weekEndDate}
        onPrev={goToPrevWeek}
        onNext={goToNextWeek}
        onToday={goToToday}
        onJump={jumpToWeek}
      />

      <main className="week-view" aria-live="polite">
        {weekDays.map(day => (
          <DayCard
            key={day.dayNumber}
            day={day}
            dimmed={activeFilter !== 'all' && day.protein !== activeFilter}
            onClick={setSelectedDay}
          />
        ))}
      </main>

      {selectedDay && (
        <DayModal day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}

      {showSettings && (
        <SettingsModal
          startDate={startDate}
          onSave={saveStartDate}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div id="toast" role="status" aria-live="polite" />
    </div>
  )
}

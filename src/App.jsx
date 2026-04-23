import { useState, useCallback } from 'react'
import Header from './components/Header'
import BannerGrid from './components/BannerGrid'
import FilterBar from './components/FilterBar'
import WeekNav from './components/WeekNav'
import DayCard from './components/DayCard'
import DayModal from './components/DayModal'
import SettingsModal from './components/SettingsModal'
import CostCalculatorModal from './components/CostCalculatorModal'
import GroceryListModal from './components/GroceryListModal'
import EventMenusModal from './components/EventMenusModal'
import DessertsModal from './components/DessertsModal'
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
      body{font-family:Inter,system-ui,sans-serif;padding:1.5rem;color:#0F172A}
      h2{margin-bottom:1rem;background:linear-gradient(90deg,#6366F1,#EC4899);-webkit-background-clip:text;background-clip:text;color:transparent}
      table{border-collapse:collapse;width:100%;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(15,23,42,.08)}
      th,td{border:1px solid #E2E8F0;padding:10px;text-align:left;font-size:.9rem}
      th{background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;font-weight:700}
      tr:nth-child(even) td{background:#F8FAFC}
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
    swapMeal,
  } = useMealPlan()

  const [beefSub, setBeefSub] = useState('all')

  const [showSettings,  setShowSettings]  = useState(false)
  const [showCost,      setShowCost]      = useState(false)
  const [showGrocery,   setShowGrocery]   = useState(false)
  const [showEvents,    setShowEvents]    = useState(false)
  const [showDesserts,  setShowDesserts]  = useState(false)

  const handlePrintWeek = useCallback(() => {
    const win = window.open('', '_blank')
    win.document.write(buildWeekPrintHTML(weekDays, currentWeek + 1))
    win.document.close()
    win.print()
  }, [weekDays, currentWeek])

  const matchesBeefSub = (day, sub) => {
    if (sub === 'all') return true
    const d = (day.dinner || '').toLowerCase()
    if (sub === 'roast') return d.includes('prime rib') || d.includes('pot roast') || d.includes('short rib') || d.includes('beef stew') || d.includes('beef wellington')
    if (sub === 'steak') return d.includes('ribeye') || d.includes('ny strip') || d.includes('steak')
    if (sub === 'ground') return d.includes('lasagna') || d.includes('bolognese') || d.includes('taco') || d.includes('shepherd') || d.includes('enchilada') || d.includes('chili') || d.includes('stuffed pepper') || d.includes('bulgogi') || d.includes('meatball')
    return true
  }

  const handleBanner = useCallback((key) => {
    if (key === 'cost')     setShowCost(true)
    if (key === 'grocery')  setShowGrocery(true)
    if (key === 'events')   setShowEvents(true)
    if (key === 'desserts') setShowDesserts(true)
  }, [])

  return (
    <div id="app">
      <Header onPrintWeek={handlePrintWeek} onOpenSettings={() => setShowSettings(true)} />

      <BannerGrid onSelect={handleBanner} />

      <FilterBar
        active={activeFilter}
        onChange={setActiveFilter}
        beefSub={beefSub}
        onBeefSub={setBeefSub}
      />

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
            dimmed={
              (activeFilter !== 'all' && day.protein !== activeFilter) ||
              (activeFilter === 'beef' && day.protein === 'beef' && beefSub !== 'all' && !matchesBeefSub(day, beefSub))
            }
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

      {showCost     && <CostCalculatorModal onClose={() => setShowCost(false)} />}
      {showGrocery  && <GroceryListModal weekDays={weekDays} weekNum={currentWeek + 1} onClose={() => setShowGrocery(false)} />}
      {showEvents   && <EventMenusModal onClose={() => setShowEvents(false)} />}
      {showDesserts && <DessertsModal onClose={() => setShowDesserts(false)} />}

      <div id="toast" role="status" aria-live="polite" />
    </div>
  )
}

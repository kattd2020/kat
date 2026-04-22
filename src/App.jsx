import { useState, useCallback, useRef } from 'react'
import Header from './components/Header'
import BannerGrid from './components/BannerGrid'
import FilterBar from './components/FilterBar'
import WeekNav from './components/WeekNav'
import DayCard from './components/DayCard'
import DayModal from './components/DayModal'
import SettingsModal from './components/SettingsModal'
import GroceryListModal from './components/GroceryListModal'
import SeasonalModal from './components/SeasonalModal'
import CostModal from './components/CostModal'
import ProteinRecipesModal from './components/ProteinRecipesModal'
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
    weekStartDate, weekEndDate,
    selectedDay, setSelectedDay,
    goToPrevWeek, goToNextWeek, goToToday, jumpToWeek, saveStartDate,
    calcEntries, addCalcEntry, removeCalcEntry, clearCalc,
    grocerySelection, toggleGrocery, clearGrocery,
    servings, setServings,
  } = useMealPlan()

  const [showSettings, setShowSettings] = useState(false)
  const [showGrocery, setShowGrocery] = useState(false)
  const [showSeasonal, setShowSeasonal] = useState(false)
  const [showCost, setShowCost] = useState(false)
  const [browseProtein, setBrowseProtein] = useState(null)
  const weekViewRef = useRef(null)

  const handlePrintWeek = useCallback(() => {
    const win = window.open('', '_blank')
    win.document.write(buildWeekPrintHTML(weekDays, currentWeek + 1))
    win.document.close()
    win.print()
  }, [weekDays, currentWeek])

  const handleBanner = useCallback((key) => {
    if (key === 'planYear') {
      weekViewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (key === 'grocery') {
      setShowGrocery(true)
    } else if (key === 'seasonal') {
      setShowSeasonal(true)
    } else if (key === 'cost') {
      setShowCost(true)
    }
  }, [])

  return (
    <div id="app">
      <Header onPrintWeek={handlePrintWeek} onOpenSettings={() => setShowSettings(true)} />

      <BannerGrid onSelect={handleBanner} />

      <FilterBar onSelect={setBrowseProtein} />

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

      <main className="week-view" ref={weekViewRef} aria-live="polite">
        {weekDays.map(day => (
          <DayCard
            key={day.dayNumber}
            day={day}
            onClick={setSelectedDay}
          />
        ))}
      </main>

      {selectedDay && (
        <DayModal
          day={selectedDay}
          grocerySelection={grocerySelection}
          toggleGrocery={toggleGrocery}
          servings={servings}
          setServings={setServings}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          startDate={startDate}
          servings={servings}
          onSaveStartDate={saveStartDate}
          onSetServings={setServings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showGrocery && (
        <GroceryListModal
          weekDays={weekDays}
          weekNum={currentWeek + 1}
          grocerySelection={grocerySelection}
          toggleGrocery={toggleGrocery}
          clearGrocery={clearGrocery}
          servings={servings}
          setServings={setServings}
          onClose={() => setShowGrocery(false)}
        />
      )}

      {showSeasonal && (
        <SeasonalModal
          grocerySelection={grocerySelection}
          toggleGrocery={toggleGrocery}
          servings={servings}
          setServings={setServings}
          onClose={() => setShowSeasonal(false)}
        />
      )}

      {showCost && (
        <CostModal
          calcEntries={calcEntries}
          addCalcEntry={addCalcEntry}
          removeCalcEntry={removeCalcEntry}
          clearCalc={clearCalc}
          onClose={() => setShowCost(false)}
        />
      )}

      {browseProtein && (
        <ProteinRecipesModal
          protein={browseProtein}
          grocerySelection={grocerySelection}
          toggleGrocery={toggleGrocery}
          servings={servings}
          setServings={setServings}
          onClose={() => setBrowseProtein(null)}
        />
      )}

      <footer className="app-footer">
        <span>
          <strong>Plateful365</strong> · A full year of meals, planned
        </span>
        <span className="app-footer-meta">
          365 days · 3 meals · 5 proteins · works offline
        </span>
      </footer>

      <div id="toast" role="status" aria-live="polite" />
    </div>
  )
}

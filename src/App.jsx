import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import WeekNav from './components/WeekNav'
import DayCard from './components/DayCard'
import DayModal from './components/DayModal'
import SettingsModal from './components/SettingsModal'
import UpgradeModal from './components/UpgradeModal'
import AuthModal from './components/AuthModal'
import { useMealPlan } from './hooks/useMealPlan'
import { useAuth } from './hooks/useAuth'
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
  const { user, loading: authLoading, signup, login, logout, updateUser, isLoggedIn } = useAuth()

  const {
    startDate, currentWeek, totalWeeks, weekDays,
    weekStartDate, weekEndDate, activeFilter, setActiveFilter,
    selectedDay, setSelectedDay,
    goToPrevWeek, goToNextWeek, goToToday, jumpToWeek, saveStartDate,
    swapMeal, swaps,
    isPro,
  } = useMealPlan()

  const [showSettings, setShowSettings] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  // Sync server user data into local state on login
  useEffect(() => {
    if (!user) return
    if (user.start_date) saveStartDate(user.start_date)
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // Push local changes to server when logged in
  const handleSaveStartDate = useCallback((dateStr) => {
    saveStartDate(dateStr)
    if (isLoggedIn) updateUser({ start_date: dateStr })
  }, [saveStartDate, isLoggedIn, updateUser])

  const handlePrintWeek = useCallback(() => {
    if (!isPro) { setShowUpgrade(true); return }
    const win = window.open('', '_blank')
    win.document.write(buildWeekPrintHTML(weekDays, currentWeek + 1))
    win.document.close()
    win.print()
  }, [weekDays, currentWeek, isPro])

  const handleAuth = useCallback(async (mode, email, password) => {
    const u = mode === 'signup' ? await signup(email, password) : await login(email, password)
    setShowAuth(false)
    // Sync local swaps up to server after login
    if (u && Object.keys(swaps).length > 0) updateUser({ swaps })
  }, [signup, login, swaps, updateUser])

  return (
    <div id="app">
      <Header
        onPrintWeek={handlePrintWeek}
        onOpenSettings={() => setShowSettings(true)}
        isPro={isPro}
        onUpgrade={() => setShowUpgrade(true)}
        user={user}
        onLogin={() => setShowAuth(true)}
        onLogout={logout}
      />

      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      {/* Ad slot — replace data-ad-slot with your AdSense slot ID once approved */}
      <div className="ad-slot">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

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
          onSave={handleSaveStartDate}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      {showAuth && <AuthModal onAuth={handleAuth} onClose={() => setShowAuth(false)} />}

      <div id="toast" role="status" aria-live="polite" />
    </div>
  )
}

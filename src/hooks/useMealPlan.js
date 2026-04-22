import { useState, useCallback } from 'react'
import { MEAL_PLAN } from '../data/mealsData'

const STORAGE_KEY = 'mealplanner_startdate'
const CALC_KEY = 'mealplanner_calc'
const GROCERY_KEY = 'mealplanner_grocery'

function getStoredCalcEntries() {
  try {
    const v = JSON.parse(localStorage.getItem(CALC_KEY))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function getStoredGrocery() {
  try {
    const v = JSON.parse(localStorage.getItem(GROCERY_KEY))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function getStoredStartDate() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return new Date(stored)
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekForDay(dayIndex) {
  return Math.floor(dayIndex / 7)
}

function getTodayDayIndex(startDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((today - startDate) / 86400000)
  return Math.max(0, Math.min(diff, 364))
}

export function useMealPlan() {
  const [startDate, setStartDate] = useState(getStoredStartDate)
  const [currentWeek, setCurrentWeek] = useState(() =>
    getWeekForDay(getTodayDayIndex(getStoredStartDate()))
  )
  const [selectedDay, setSelectedDay] = useState(null)
  const [calcEntries, setCalcEntries] = useState(getStoredCalcEntries)
  const [grocerySelection, setGrocerySelection] = useState(getStoredGrocery)

  const totalWeeks = Math.ceil(MEAL_PLAN.length / 7)

  const weekDays = MEAL_PLAN.slice(currentWeek * 7, currentWeek * 7 + 7).map((day) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day.dayNumber - 1)
    return { ...day, date }
  })

  const addCalcEntry = useCallback((amount) => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return
    setCalcEntries(prev => {
      const next = [...prev, { id: Date.now() + Math.random(), amount: Math.round(n * 100) / 100 }]
      localStorage.setItem(CALC_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeCalcEntry = useCallback((id) => {
    setCalcEntries(prev => {
      const next = prev.filter(e => e.id !== id)
      if (next.length === 0) localStorage.removeItem(CALC_KEY)
      else localStorage.setItem(CALC_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearCalc = useCallback(() => {
    localStorage.removeItem(CALC_KEY)
    setCalcEntries([])
  }, [])

  const toggleGrocery = useCallback((dayNumber, mealType) => {
    const key = `${dayNumber}-${mealType}`
    setGrocerySelection(prev => {
      const next = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
      if (next.length === 0) localStorage.removeItem(GROCERY_KEY)
      else localStorage.setItem(GROCERY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearGrocery = useCallback(() => {
    localStorage.removeItem(GROCERY_KEY)
    setGrocerySelection([])
  }, [])

  const goToPrevWeek = useCallback(() => setCurrentWeek(w => Math.max(0, w - 1)), [])
  const goToNextWeek = useCallback(() => setCurrentWeek(w => Math.min(totalWeeks - 1, w + 1)), [totalWeeks])
  const goToToday   = useCallback(() => setCurrentWeek(getWeekForDay(getTodayDayIndex(startDate))), [startDate])
  const jumpToWeek  = useCallback((week) => setCurrentWeek(Number(week)), [])

  const saveStartDate = useCallback((dateStr) => {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    localStorage.setItem(STORAGE_KEY, d.toISOString())
    setStartDate(d)
  }, [])

  const weekStartDate = weekDays[0]?.date
  const weekEndDate   = weekDays[weekDays.length - 1]?.date

  return {
    startDate,
    currentWeek,
    totalWeeks,
    weekDays,
    weekStartDate,
    weekEndDate,
    selectedDay,
    setSelectedDay,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    jumpToWeek,
    saveStartDate,
    calcEntries,
    addCalcEntry,
    removeCalcEntry,
    clearCalc,
    grocerySelection,
    toggleGrocery,
    clearGrocery,
  }
}

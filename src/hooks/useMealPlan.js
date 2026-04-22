import { useState, useCallback } from 'react'
import { MEAL_PLAN } from '../data/mealsData'

const STORAGE_KEY = 'mealplanner_startdate'
const SWAPS_KEY = 'mealplanner_swaps'
const CALC_KEY = 'mealplanner_calc'

function getStoredSwaps() {
  try {
    return JSON.parse(localStorage.getItem(SWAPS_KEY)) || {}
  } catch {
    return {}
  }
}

function getStoredCalcEntries() {
  try {
    const v = JSON.parse(localStorage.getItem(CALC_KEY))
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
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState(null)
  const [swaps, setSwaps] = useState(getStoredSwaps)
  const [calcEntries, setCalcEntries] = useState(getStoredCalcEntries)

  const totalWeeks = Math.ceil(MEAL_PLAN.length / 7)

  const weekDays = MEAL_PLAN.slice(currentWeek * 7, currentWeek * 7 + 7).map((day) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day.dayNumber - 1)
    const override = swaps[day.dayNumber] || {}
    return { ...day, ...override, date }
  })

  const swapMeal = useCallback((dayNumber, mealType, newMealName) => {
    setSwaps(prev => {
      const next = {
        ...prev,
        [dayNumber]: { ...(prev[dayNumber] || {}), [mealType]: newMealName },
      }
      localStorage.setItem(SWAPS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

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
    activeFilter,
    setActiveFilter,
    selectedDay,
    setSelectedDay,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    jumpToWeek,
    saveStartDate,
    swapMeal,
    calcEntries,
    addCalcEntry,
    removeCalcEntry,
    clearCalc,
  }
}

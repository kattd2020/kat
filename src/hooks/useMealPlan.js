import { useState, useCallback } from 'react'
import { MEAL_PLAN } from '../data/mealsData'

const STORAGE_KEY = 'mealplanner_startdate'

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

  const totalWeeks = Math.ceil(MEAL_PLAN.length / 7)

  const weekDays = MEAL_PLAN.slice(currentWeek * 7, currentWeek * 7 + 7).map((day) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day.dayNumber - 1)
    return { ...day, date }
  })

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
  }
}

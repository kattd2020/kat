import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { PROTEIN_LABELS } from '../data/mealsData'

const fmt = (d) =>
  d
    ? d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : ''

function buildText(day) {
  const { label } = PROTEIN_LABELS[day.protein]
  const lines = [
    `📅 Day ${day.dayNumber} — ${fmt(day.date)}`,
    `Protein: ${label}`,
    `🌅 Breakfast: ${day.breakfast}`,
    `☀️  Lunch: ${day.lunch}`,
    `🌙 Dinner: ${day.dinner}`,
  ]
  if (day.snack) lines.push(`💪 Snack: ${day.snack}`)
  return lines.join('\n')
}

function showToast(msg) {
  const t = document.getElementById('toast')
  if (!t) return
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2500)
}

export default function DayModal({ day, onClose }) {
  const

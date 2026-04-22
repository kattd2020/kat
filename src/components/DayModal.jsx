import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { PROTEIN_LABELS } from '../data/mealsData'
import { getRecipeSteps, getRecipeIngredients } from '../data/recipes'
import { makeGroceryKey } from '../hooks/useMealPlan'

const MEAL_TYPES = [
  { key: 'breakfast', emoji: '🌅', label: 'Breakfast' },
  { key: 'lunch',     emoji: '☀️', label: 'Lunch' },
  { key: 'dinner',    emoji: '🌙', label: 'Dinner' },
]

const fmt = (d) =>
  d
    ? d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : ''

function buildText(day) {
  const { label } = PROTEIN_LABELS[day.protein]
  return [
    `📅 Day ${day.dayNumber} — ${fmt(day.date)}`,
    `Protein: ${label}`,
    `🌅 Breakfast: ${day.breakfast}`,
    `☀️  Lunch: ${day.lunch}`,
    `🌙 Dinner: ${day.dinner}`,
  ].join('\n')
}

function showToast(msg) {
  const t = document.getElementById('toast')
  if (!t) return
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2500)
}

function RecipeSteps({ name, protein, day, onToggleGrocery, isPicked }) {
  const [open, setOpen] = useState(false)
  const steps = open ? getRecipeSteps(name, protein) : null
  const picked = isPicked(protein, name)
  return (
    <div className={`recipe-steps ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="recipe-toggle"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {open ? '▾ Hide recipe steps' : '▸ Show recipe steps'}
      </button>
      {open && (
        <>
          <ol className="recipe-list">
            {steps.map((s, i) => (
              <li key={i}><span className="recipe-num">{i + 1}</span>{s}</li>
            ))}
          </ol>
          <button
            type="button"
            className={`add-to-grocery-btn ${picked ? 'picked' : ''}`}
            onClick={() => onToggleGrocery({
              title: name,
              protein,
              mealType: null,
              ingredients: getRecipeIngredients(name, protein),
              dayNumber: day.dayNumber,
              dateLabel: day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            })}
            aria-pressed={picked}
          >
            {picked ? '✓ Added to grocery list' : '🛒 Add to grocery list'}
          </button>
        </>
      )}
    </div>
  )
}

function buildPrintHTML(day, qrUrl) {
  const { label, emoji } = PROTEIN_LABELS[day.protein]
  const sections = MEAL_TYPES.map(t => {
    const name = day[t.key]
    const steps = getRecipeSteps(name, day.protein)
    return `
      <section class="meal">
        <h3>${t.emoji} ${t.label} — ${name}</h3>
        <ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol>
      </section>`
  }).join('')
  return `<html><head><title>Day ${day.dayNumber} — ${label}</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;padding:2rem;max-width:720px;margin:auto;color:#0F172A}
      h2{margin-bottom:.25rem;background:linear-gradient(90deg,#6366F1,#EC4899);-webkit-background-clip:text;background-clip:text;color:transparent}
      .meta{color:#475569;margin-bottom:1.25rem}
      .meal{page-break-inside:avoid;margin-bottom:1.5rem;padding:1rem 1.25rem;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0}
      .meal h3{margin-bottom:.65rem;font-size:1.05rem}
      ol{padding-left:1.25rem}
      ol li{margin-bottom:.4rem;line-height:1.45}
      img{margin-top:1rem;display:block}
    </style></head><body>
    <h2>Day ${day.dayNumber} — ${emoji} ${label}</h2>
    <p class="meta">${fmt(day.date)}</p>
    ${sections}
    ${qrUrl ? `<img src="${qrUrl}" width="180" alt="QR code"/>` : ''}
    </body></html>`
}

export default function DayModal({ day, grocerySelection, toggleGrocery, onClose }) {
  const canvasRef = useRef(null)
  const [qrUrl, setQrUrl] = useState('')
  const pickedKeys = new Set((grocerySelection || []).map(i => i.key))
  const isPicked = (protein, title) => pickedKeys.has(makeGroceryKey(protein, title))

  useEffect(() => {
    if (!day || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, buildText(day), {
      width: 200,
      margin: 2,
      color: { dark: '#4F46E5', light: '#FFFFFF' },
    }).then(() => {
      setQrUrl(canvasRef.current.toDataURL())
    })
  }, [day])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!day) return null

  const { label, emoji } = PROTEIN_LABELS[day.protein]
  const text = buildText(day)

  const handlePrint = () => {
    const win = window.open('', '_blank')
    win.document.write(buildPrintHTML(day, qrUrl))
    win.document.close()
    win.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Meal Plan Day ${day.dayNumber}`, text })
        return
      } catch { /* cancelled */ }
    }
    await navigator.clipboard.writeText(text)
    showToast('📋 Copied to clipboard!')
  }

  const handleDownloadQr = () => {
    if (!qrUrl) return
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `meal-plan-day-${day.dayNumber}.png`
    a.click()
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 id="modalTitle">Day {day.dayNumber} {emoji} {label}</h2>
            <p className="modal-date">{fmt(day.date)}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <ul className="modal-meals with-recipes">
            {MEAL_TYPES.map(t => (
              <li key={t.key} className="meal-row">
                <div className="meal-row-head">
                  <span className="meal-time">{t.emoji} {t.label}</span>
                  <span className="meal-name">{day[t.key]}</span>
                </div>
                <RecipeSteps
                  name={day[t.key]}
                  protein={day.protein}
                  day={day}
                  onToggleGrocery={toggleGrocery}
                  isPicked={isPicked}
                />
              </li>
            ))}
          </ul>

          <div className="qr-section">
            <h3>QR Code</h3>
            <p className="qr-desc">Scan to share this day's meals</p>
            <canvas ref={canvasRef} />
            <div className="qr-actions">
              <button className="btn btn-primary"   onClick={handlePrint}>🖨️ Print Day + Recipes</button>
              <button className="btn btn-share"     onClick={handleShare}>📤 Text / Share</button>
              <button className="btn btn-secondary" onClick={handleDownloadQr}>⬇️ Save QR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

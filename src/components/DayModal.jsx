import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { PROTEIN_LABELS } from '../data/mealsData'

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

export default function DayModal({ day, onClose }) {
  const canvasRef  = useRef(null)
  const [qrUrl, setQrUrl] = useState('')

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
    win.document.write(`
      <html><head><title>Day ${day.dayNumber}</title>
      <style>
        body{font-family:sans-serif;padding:2rem;max-width:500px;margin:auto}
        h2{margin-bottom:4px}
        .protein{background:#eee;display:inline-block;padding:4px 10px;border-radius:4px;margin-bottom:1rem}
        .meals li{margin-bottom:.5rem;font-size:1.1rem}
        img{margin-top:1.5rem;display:block}
      </style></head><body>
      <h2>Day ${day.dayNumber} — ${emoji} ${label}</h2>
      <p>${fmt(day.date)}</p>
      <ul class="meals">
        <li>🌅 <strong>Breakfast:</strong> ${day.breakfast}</li>
        <li>☀️ <strong>Lunch:</strong> ${day.lunch}</li>
        <li>🌙 <strong>Dinner:</strong> ${day.dinner}</li>
      </ul>
      ${qrUrl ? `<img src="${qrUrl}" width="200" alt="QR code"/>` : ''}
      </body></html>
    `)
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
          <ul className="modal-meals">
            <li><span className="meal-time">🌅 Breakfast</span> {day.breakfast}</li>
            <li><span className="meal-time">☀️ Lunch</span> {day.lunch}</li>
            <li><span className="meal-time">🌙 Dinner</span> {day.dinner}</li>
          </ul>

          <div className="affiliate-section">
            <p className="affiliate-label">Shop ingredients</p>
            <div className="affiliate-links">
              <a
                className="affiliate-btn affiliate-instacart"
                href={`https://www.instacart.com/store/s?k=${encodeURIComponent(day.dinner)}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                🛒 Instacart
              </a>
              <a
                className="affiliate-btn affiliate-amazon"
                href={`https://www.amazon.com/s?k=${encodeURIComponent(day.dinner + ' recipe ingredients')}&i=amazonfresh`}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                📦 Amazon Fresh
              </a>
              <a
                className="affiliate-btn affiliate-hellofresh"
                href="https://www.hellofresh.com/plans"
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                🥗 HelloFresh
              </a>
            </div>
          </div>

          <div className="qr-section">
            <h3>QR Code</h3>
            <p className="qr-desc">Scan to share this day's meals</p>
            <canvas ref={canvasRef} />
            <div className="qr-actions">
              <button className="btn btn-primary"   onClick={handlePrint}>🖨️ Print Day</button>
              <button className="btn btn-share"     onClick={handleShare}>📤 Text / Share</button>
              <button className="btn btn-secondary" onClick={handleDownloadQr}>⬇️ Save QR</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect } from 'react'

const STRIPE_LINK = 'https://buy.stripe.com/test_00w6oGeJkfhz2Sx2DJfw400'

export default function UpgradeModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="upgradeTitle">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content upgrade-modal">
        <div className="modal-header">
          <div>
            <h2 id="upgradeTitle">✨ Plateful365 Pro</h2>
            <p className="modal-date">$4.99 / month — cancel anytime</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <ul className="pro-features">
            <li><span className="pro-check">✓</span> Print full week meal plans</li>
            <li><span className="pro-check">✓</span> PDF export for any week</li>
            <li><span className="pro-check">✓</span> Unlimited meal swap history</li>
            <li><span className="pro-check">✓</span> Early access to new features</li>
          </ul>
          <a
            className="btn btn-upgrade"
            href={STRIPE_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Upgrade for $4.99 / month →
          </a>
          <p className="upgrade-hint">
            Activates instantly after payment. You'll be redirected back automatically.
          </p>
        </div>
      </div>
    </div>
  )
}

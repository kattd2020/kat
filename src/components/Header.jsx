export default function Header({ onPrintWeek, onOpenSettings, isPro, onUpgrade }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <span className="app-icon">🍽️</span>
          <h1>Plateful365</h1>
          {isPro && <span className="pro-badge">PRO</span>}
        </div>
        <div className="header-right">
          {!isPro && (
            <button className="upgrade-btn" onClick={onUpgrade} title="Upgrade to Pro">
              ✨ Upgrade
            </button>
          )}
          <button className="icon-btn" title="Settings" onClick={onOpenSettings} aria-label="Settings">⚙️</button>
          <button className="icon-btn" title="Print week" onClick={onPrintWeek} aria-label="Print week">🖨️</button>
        </div>
      </div>
    </header>
  )
}

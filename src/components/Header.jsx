export default function Header({ onPrintWeek, onOpenSettings }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <span className="app-icon" aria-hidden="true">🍽️</span>
          <div className="header-brand">
            <h1>Plateful<span className="brand-accent">365</span></h1>
            <p className="brand-tag">A full year of meals, planned</p>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-btn" title="Settings" onClick={onOpenSettings} aria-label="Settings">⚙️</button>
          <button className="icon-btn" title="Print week" onClick={onPrintWeek} aria-label="Print week">🖨️</button>
        </div>
      </div>
    </header>
  )
}

export default function Header({ onPrintWeek, onOpenSettings }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <span className="app-icon">🍽️</span>
          <h1>Plateful365</h1>
        </div>
        <div className="header-right">
          <button className="icon-btn" title="Settings" onClick={onOpenSettings} aria-label="Settings">⚙️</button>
          <button className="icon-btn" title="Print week" onClick={onPrintWeek} aria-label="Print week">🖨️</button>
        </div>
      </div>
    </header>
  )
}

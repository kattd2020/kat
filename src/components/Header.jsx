export default function Header({ onPrintWeek, onOpenSettings, isPro, onUpgrade, user, onLogin, onLogout }) {
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
          {user ? (
            <div className="user-menu">
              <span className="user-avatar" title={user.email}>
                {user.email[0].toUpperCase()}
              </span>
              <button className="icon-btn" title={`Signed in as ${user.email} — click to sign out`} onClick={onLogout} aria-label="Sign out">
                ↩
              </button>
            </div>
          ) : (
            <button className="icon-btn auth-login-btn" onClick={onLogin} title="Sign in / Create account" aria-label="Sign in">
              👤
            </button>
          )}
          <button className="icon-btn" title="Settings" onClick={onOpenSettings} aria-label="Settings">⚙️</button>
          <button className="icon-btn" title="Print week" onClick={onPrintWeek} aria-label="Print week">🖨️</button>
        </div>
      </div>
    </header>
  )
}

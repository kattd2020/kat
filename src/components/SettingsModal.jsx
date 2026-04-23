import { useState } from 'react'

function toInputValue(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function SettingsModal({ startDate, onSave, onClose, user, onLogin, onSignup, onLogout }) {
  const [value, setValue]     = useState(toInputValue(startDate))
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]  = useState('')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy]   = useState(false)

  const handleSave = () => {
    if (value) { onSave(value); onClose() }
  }

  const switchMode = (m) => { setAuthMode(m); setAuthError(''); setConfirm('') }

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    if (authMode === 'signup' && password !== confirm) { setAuthError('Passwords do not match'); return }
    setAuthBusy(true)
    try {
      if (authMode === 'signup') await onSignup(email.trim().toLowerCase(), password)
      else await onLogin(email.trim().toLowerCase(), password)
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthBusy(false)
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content settings-modal">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">

          {/* ── Plan settings ── */}
          <div className="setting-group">
            <label htmlFor="startDateInput">Plan Start Date</label>
            <input
              id="startDateInput"
              type="date"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <p className="setting-hint">
              Day 1 of your 365-day plan. Adjust this to align meals with any start date.
            </p>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>
            💾 Save Settings
          </button>

          {/* ── Account section ── */}
          <div className="settings-divider" />

          {user ? (
            <div className="settings-account-row">
              <div className="settings-account-info">
                <span className="user-avatar">{user.email[0].toUpperCase()}</span>
                <div>
                  <div className="settings-account-label">Signed in as</div>
                  <div className="settings-account-email">{user.email}</div>
                </div>
              </div>
              <button className="btn btn-secondary settings-signout-btn" onClick={onLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <>
              <p className="settings-account-heading">Account</p>
              <p className="setting-hint" style={{ marginBottom: '.85rem' }}>
                Save your meal plan and settings across all your devices.
              </p>

              <div className="auth-tabs">
                <button className={`auth-tab ${authMode === 'login'  ? 'auth-tab--active' : ''}`} type="button" onClick={() => switchMode('login')}>Log in</button>
                <button className={`auth-tab ${authMode === 'signup' ? 'auth-tab--active' : ''}`} type="button" onClick={() => switchMode('signup')}>Sign up</button>
              </div>

              <form className="auth-form" onSubmit={handleAuth} noValidate>
                <div className="auth-field">
                  <label htmlFor="s-email">Email</label>
                  <input id="s-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="auth-field">
                  <label htmlFor="s-password">Password</label>
                  <input id="s-password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder={authMode === 'signup' ? 'At least 8 characters' : ''} value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {authMode === 'signup' && (
                  <div className="auth-field">
                    <label htmlFor="s-confirm">Confirm password</label>
                    <input id="s-confirm" type="password" autoComplete="new-password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                  </div>
                )}
                {authError && <p className="auth-error">{authError}</p>}
                <button className="btn btn-primary auth-submit" type="submit" disabled={authBusy}>
                  {authBusy ? 'Please wait…' : authMode === 'login' ? 'Log in' : 'Create account'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

const CORS = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
})

function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin') || ''
  if (origin === 'http://localhost:5173' || origin === 'https://plateful365.com') return origin
  return 'https://plateful365.com'
}

function json(data, status = 200, origin = 'https://plateful365.com') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS(origin) },
  })
}

function err(msg, status = 400, origin = 'https://plateful365.com') {
  return json({ error: msg }, status, origin)
}

// ── Crypto helpers ────────────────────────────────────────

function generateId() {
  return crypto.randomUUID()
}

function hexEncode(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateSalt() {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return hexEncode(arr.buffer)
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  )
  return hexEncode(bits)
}

function b64url(str) {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function fromb64url(str) {
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

async function createJWT(payload, secret) {
  const enc = new TextEncoder()
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify(payload))
  const data = `${header}.${body}`
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return `${data}.${b64url(String.fromCharCode(...new Uint8Array(sig)))}`
}

async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, body, sig] = parts
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const sigBytes = Uint8Array.from(fromb64url(sig), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${header}.${body}`))
    if (!valid) return null
    const payload = JSON.parse(fromb64url(body))
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

// ── Auth middleware ───────────────────────────────────────

async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  return verifyJWT(token, env.JWT_SECRET)
}

// ── Route handlers ────────────────────────────────────────

async function handleSignup(request, env, origin) {
  let body
  try { body = await request.json() } catch { return err('Invalid JSON', 400, origin) }

  const email = (body.email || '').trim().toLowerCase()
  const password = body.password || ''

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err('Valid email required', 400, origin)
  if (password.length < 8) return err('Password must be at least 8 characters', 400, origin)

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) return err('Email already registered', 409, origin)

  const id = generateId()
  const salt = generateSalt()
  const hash = await hashPassword(password, salt)

  await env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, salt) VALUES (?, ?, ?, ?)'
  ).bind(id, email, hash, salt).run()

  const token = await createJWT({ sub: id, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET)
  return json({ token, user: { id, email, is_pro: false, start_date: null, swaps: {} } }, 201, origin)
}

async function handleLogin(request, env, origin) {
  let body
  try { body = await request.json() } catch { return err('Invalid JSON', 400, origin) }

  const email = (body.email || '').trim().toLowerCase()
  const password = body.password || ''

  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
  if (!user) return err('Invalid email or password', 401, origin)

  const hash = await hashPassword(password, user.salt)
  if (hash !== user.password_hash) return err('Invalid email or password', 401, origin)

  const token = await createJWT({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET)
  return json({
    token,
    user: {
      id: user.id,
      email: user.email,
      is_pro: user.is_pro === 1,
      start_date: user.start_date,
      swaps: JSON.parse(user.swaps || '{}'),
    },
  }, 200, origin)
}

async function handleMe(request, env, origin) {
  const payload = await requireAuth(request, env)
  if (!payload) return err('Unauthorized', 401, origin)

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(payload.sub).first()
  if (!user) return err('User not found', 404, origin)

  return json({
    id: user.id,
    email: user.email,
    is_pro: user.is_pro === 1,
    start_date: user.start_date,
    swaps: JSON.parse(user.swaps || '{}'),
  }, 200, origin)
}

async function handleUpdateMe(request, env, origin) {
  const payload = await requireAuth(request, env)
  if (!payload) return err('Unauthorized', 401, origin)

  let body
  try { body = await request.json() } catch { return err('Invalid JSON', 400, origin) }

  const fields = []
  const values = []

  if ('start_date' in body) { fields.push('start_date = ?'); values.push(body.start_date) }
  if ('swaps' in body) { fields.push('swaps = ?'); values.push(JSON.stringify(body.swaps)) }
  if ('is_pro' in body) { fields.push('is_pro = ?'); values.push(body.is_pro ? 1 : 0) }

  if (fields.length > 0) {
    values.push(payload.sub)
    await env.DB.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run()
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(payload.sub).first()
  return json({
    id: user.id,
    email: user.email,
    is_pro: user.is_pro === 1,
    start_date: user.start_date,
    swaps: JSON.parse(user.swaps || '{}'),
  }, 200, origin)
}

// ── Main fetch handler ────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = getAllowedOrigin(request)

    // www → apex redirect
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }

    // CORS preflight
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, { status: 204, headers: CORS(origin) })
    }

    // Auth API routes
    if (url.pathname === '/api/auth/signup' && request.method === 'POST') return handleSignup(request, env, origin)
    if (url.pathname === '/api/auth/login'  && request.method === 'POST') return handleLogin(request, env, origin)
    if (url.pathname === '/api/auth/me'     && request.method === 'GET')  return handleMe(request, env, origin)
    if (url.pathname === '/api/auth/me'     && request.method === 'PATCH') return handleUpdateMe(request, env, origin)

    // Static assets
    const response = await env.ASSETS.fetch(request)
    const contentType = response.headers.get('content-type') || ''
    const path = url.pathname
    const noCache = contentType.startsWith('text/html') || path === '/' || path === '/index.html' || path === '/sw.js' || path === '/manifest.webmanifest'

    if (noCache) {
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
      headers.set('CDN-Cache-Control', 'no-store')
      headers.set('Cloudflare-CDN-Cache-Control', 'no-store')
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
    }

    return response
  },
}

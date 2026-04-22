// Highlights duration mentions inside a step string — "2-3 minutes",
// "15 min", "1 hour", "60 seconds", "18–22 minutes" etc. — with a small
// amber pill so cook times pop visually as you scan the steps.

const TIME_RE = /(\d+(?:\s*[-–]\s*\d+)?)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)\b/gi

export default function StepText({ text }) {
  if (!text) return null
  const parts = []
  let last = 0
  let m
  TIME_RE.lastIndex = 0
  while ((m = TIME_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <span key={`${m.index}-${last}`} className="step-time">⏱ {m[0]}</span>
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length > 1 ? <>{parts}</> : text
}

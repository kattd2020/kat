const MIN = 1
const MAX = 6

export default function ServingsPicker({ servings, onChange, label = 'Serves' }) {
  const clamp = (n) => Math.max(MIN, Math.min(MAX, n))
  return (
    <div className="serves-stepper" role="group" aria-label={`${label} — adjust between ${MIN} and ${MAX}`}>
      <span className="serves-label">{label}</span>
      <button
        type="button"
        className="serves-btn"
        onClick={() => onChange(clamp(servings - 1))}
        disabled={servings <= MIN}
        aria-label="Decrease servings"
      >
        −
      </button>
      <span className="serves-value" aria-live="polite">{servings}</span>
      <button
        type="button"
        className="serves-btn"
        onClick={() => onChange(clamp(servings + 1))}
        disabled={servings >= MAX}
        aria-label="Increase servings"
      >
        +
      </button>
    </div>
  )
}

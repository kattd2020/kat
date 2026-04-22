const PROTEINS = [
  { key: 'beef',        label: '🥩 Beef' },
  { key: 'pork',        label: '🥓 Pork' },
  { key: 'chicken',     label: '🍗 Chicken' },
  { key: 'groundTurkey',label: '🦃 Ground Turkey' },
  { key: 'seafood',     label: '🐟 Seafood' },
]

export default function FilterBar({ onSelect }) {
  return (
    <div className="filter-bar" role="group" aria-label="Browse recipes by protein">
      {PROTEINS.map(p => (
        <button
          key={p.key}
          className={`filter-btn ${p.key}`}
          onClick={() => onSelect(p.key)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

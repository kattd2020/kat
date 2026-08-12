const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'beef',        label: '🥩 Beef' },
  { key: 'pork',        label: '🥓 Pork' },
  { key: 'chicken',     label: '🍗 Chicken' },
  { key: 'groundTurkey',label: '🦃 Ground Turkey' },
  { key: 'seafood',     label: '🐟 Seafood' },
  { key: 'highProtein', label: '💪 High Protein' },
]

export default function FilterBar({ active, onChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter by protein">
      {FILTERS.map(f => (
        <button
          key={f.key}
          className={`filter-btn ${f.key !== 'all' ? f.key : ''} ${active === f.key ? 'active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

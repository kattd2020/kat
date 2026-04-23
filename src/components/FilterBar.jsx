const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'beef',        label: '🥩 Beef' },
  { key: 'pork',        label: '🥓 Pork' },
  { key: 'chicken',     label: '🍗 Chicken' },
  { key: 'groundTurkey',label: '🦃 Ground Turkey' },
  { key: 'seafood',     label: '🐟 Seafood' },
]

const BEEF_SUBS = [
  { key: 'all',   label: 'All cuts' },
  { key: 'roast', label: '🍖 Prime rib / Rib roast' },
  { key: 'steak', label: '🥩 Steaks' },
  { key: 'ground',label: '🍔 Ground beef' },
]

export default function FilterBar({ active, onChange, beefSub, onBeefSub }) {
  return (
    <div className="filter-bar-wrap">
      <div className="filter-bar" role="group" aria-label="Filter by protein">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-btn ${f.key !== 'all' ? f.key : ''} ${active === f.key ? 'active' : ''}`}
            onClick={() => { onChange(f.key); if (f.key !== 'beef') onBeefSub('all') }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {active === 'beef' && (
        <div className="filter-bar filter-sub-bar" role="group" aria-label="Filter by beef cut">
          {BEEF_SUBS.map(s => (
            <button
              key={s.key}
              className={`filter-btn beef-sub ${beefSub === s.key ? 'active beef' : ''}`}
              onClick={() => onBeefSub(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

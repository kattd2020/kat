const BANNERS = [
  {
    key: 'cost',
    icon: '💰',
    title: 'Cost calculator',
    desc: 'Punch in prices as you shop and watch the running total tally up.',
    className: 'banner-gold',
  },
  {
    key: 'grocery',
    icon: '🛒',
    title: 'Smart grocery lists',
    desc: 'Auto-generated shopping lists by week, sorted by meal. No more forgotten garlic.',
    className: 'banner-sky',
  },
  {
    key: 'events',
    icon: '🎉',
    title: 'Event menus',
    desc: 'Curated recipe packs — cookout, 4th of July, football party, holiday dinner, brunch, more.',
    className: 'banner-mint',
  },
  {
    key: 'desserts',
    icon: '🍰',
    title: 'Cheap easy desserts',
    desc: 'Pantry-friendly sweets — mug brownies, apple crisp, icebox pies, banana muffins, s’mores dip.',
    className: 'banner-rose',
  },
]

export default function BannerGrid({ onSelect, badges = {} }) {
  return (
    <section className="banner-grid" aria-label="Features">
      {BANNERS.map(b => {
        const count = badges[b.key] || 0
        return (
          <button
            key={b.key}
            className={`banner ${b.className}`}
            onClick={() => onSelect(b.key)}
          >
            <span className="banner-icon" aria-hidden="true">{b.icon}</span>
            <h3 className="banner-title">{b.title}</h3>
            <p className="banner-desc">{b.desc}</p>
            {count > 0 && (
              <span
                key={count}
                className="banner-badge"
                aria-label={`${count} on your list`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </section>
  )
}

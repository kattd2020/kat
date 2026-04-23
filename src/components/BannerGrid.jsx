const BANNERS = [
  {
    key: 'cost',
    icon: '💰',
    title: 'Cost calculator',
    desc: 'See your estimated weekly spend by protein and get tips to stretch your budget further.',
    className: 'banner-gold',
  },
  {
    key: 'grocery',
    icon: '🛒',
    title: 'Smart grocery list',
    desc: 'Auto-generated shopping list for the week, grouped by protein. Print it before you shop.',
    className: 'banner-sky',
  },
  {
    key: 'desserts',
    icon: '🍰',
    title: 'Cheap easy desserts',
    desc: 'Sweet finishers under $2 a serving. Most take under 10 minutes.',
    className: 'banner-rose',
  },
]

export default function BannerGrid({ onSelect }) {
  return (
    <section className="banner-grid" aria-label="Features">
      {BANNERS.map(b => (
        <button
          key={b.key}
          className={`banner ${b.className}`}
          onClick={() => onSelect(b.key)}
        >
          <span className="banner-icon" aria-hidden="true">{b.icon}</span>
          <h3 className="banner-title">{b.title}</h3>
          <p className="banner-desc">{b.desc}</p>
        </button>
      ))}
    </section>
  )
}

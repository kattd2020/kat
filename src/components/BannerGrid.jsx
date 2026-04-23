const BANNERS = [
  {
    key: 'planYear',
    icon: '📅',
    title: 'Plan a whole year',
    desc: 'Drag, drop, and shuffle meals across 52 weeks. Repeat favorites or mix it up.',
    className: 'banner-electric',
  },
  {
    key: 'grocery',
    icon: '🛒',
    title: 'Smart grocery lists',
    desc: 'Auto-generated shopping lists by week, sorted by meal. No more forgotten garlic.',
    className: 'banner-sky',
  },
  {
    key: 'seasonal',
    icon: '🌿',
    title: 'Seasonal suggestions',
    desc: "Recipes shift with the seasons so you're eating what's fresh, cheap, and in peak flavor.",
    className: 'banner-mint',
  },
  {
    key: 'swap',
    icon: '⚡',
    title: 'Quick-swap recipes',
    desc: 'Kid said no to salmon? Swap for an alternative in one tap.',
    className: 'banner-cobalt',
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

import { getMeatCookInfo } from '../data/recipes'

export default function MeatCookCallout({ name, protein }) {
  if (!protein) return null
  const info = getMeatCookInfo(name, protein)
  if (!info) return null

  return (
    <div className="meat-cook-callout" role="note">
      <span className="meat-cook-icon" aria-hidden="true">🔥</span>
      <span className="meat-cook-body">
        <span className="meat-cook-label">Cook the {info.noun}</span>
        <span className="meat-cook-spec">
          <strong>{info.method}</strong>
          {info.temp && <span> · <strong>{info.temp}</strong></span>}
          {info.time && <span> · <strong>{info.time}</strong></span>}
        </span>
      </span>
    </div>
  )
}

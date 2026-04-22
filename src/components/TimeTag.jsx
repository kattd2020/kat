import { getCookTime, formatCookTime } from '../data/recipes'

export default function TimeTag({ name, protein, minutes }) {
  const mins = typeof minutes === 'number' ? minutes : getCookTime(name, protein)
  if (!mins) return null
  return (
    <span className="time-tag" title={`About ${formatCookTime(mins)} total`}>
      <span aria-hidden="true">⏱</span> {formatCookTime(mins)}
    </span>
  )
}

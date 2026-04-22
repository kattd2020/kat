import { getCut } from '../data/cuts'

export default function CutTag({ protein, name }) {
  if (!protein || !name) return null
  const cut = getCut(protein, name)
  if (!cut) return null
  return (
    <span className={`cut-tag cut-${cut.key}`} title={`Cut: ${cut.label}`}>
      <span aria-hidden="true">{cut.emoji}</span> {cut.label}
    </span>
  )
}

// Renders the body text of a single recipe step. Kept as a component
// so the three modals (DayModal / ProteinRecipesModal / EventsModal)
// can share one wrapping span — step <li>s are CSS grid containers,
// and grid children need to be single DOM nodes or text collapses into
// separate grid cells.

export default function StepText({ text }) {
  if (!text) return null
  return <span className="step-text">{text}</span>
}

import { useState } from 'react'
import { MEALS, PROTEIN_LABELS } from '../data/mealsData'

const MEAL_TYPES = {
  breakfast: '🌅 Breakfast',
  lunch:     '☀️ Lunch',
  dinner:    '🌙 Dinner',
  snacks:    '💪 Snacks',
}

export default function RecipeBrowser({ protein, onClose }) {
  const [activeTab, setActiveTab] = useState('breakfast')
  const { label, emoji } = PROTEIN_LABELS[protein]
  const pool = MEALS[protein]
  const tabs = Object.keys(MEAL_TYPES).filter(t => pool[t])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="browserTitle">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content recipe-browser">
        <div className="modal-header">
          <div>
            <h2 id="browserTitle">{emoji} {label} Recipes</h2>
            <p className="modal-date">Browse all meals in this category</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="browser-tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`browser-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {MEAL_TYPES[t]}
            </button>
          ))}
        </div>
        <div className="browser-body">
          <ul className="recipe-list">
            {pool[activeTab].map((recipe, i) => (
              <li key={i} className="recipe-item">
                <span className="recipe-icon">{MEAL_TYPES[activeTab].split(' ')[0]}</span>
                {recipe}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    number: "01",
    title: "Plan without the pressure",
    text: "Build a realistic weekly meal plan around the days you actually have.",
  },
  {
    number: "02",
    title: "Keep groceries simple",
    text: "Turn your plan into one clear shopping list so fewer things get forgotten.",
  },
  {
    number: "03",
    title: "Make everyday meals easier",
    text: "Spend less time deciding what to cook and more time enjoying your evening.",
  },
];

const steps = [
  {
    number: "1",
    title: "Choose your meals",
    text: "Pick meals that fit your week, your cravings, and your schedule.",
  },
  {
    number: "2",
    title: "Build your plan",
    text: "Give every meal a place so you already know what dinner looks like.",
  },
  {
    number: "3",
    title: "Shop with confidence",
    text: "Use your organized plan to make grocery day quicker and calmer.",
  },
];

export default function HomePage({ onStartPlanning }) {
  return (
    <main className="p365-home">
      <section className="p365-hero">
        <div className="p365-hero-copy">
          <p className="p365-eyebrow">MEAL PLANNING FOR REAL LIFE</p>

          <h1>
            A calmer way to answer
            <span> “What’s for dinner?”</span>
          </h1>

          <p className="p365-hero-text">
            Plateful 365 helps you organize meals, simplify grocery shopping,
            and take one more decision off your plate.
          </p>

          <div className="p365-actions">
            <button
              className="p365-button p365-primary"
              onClick={onStartPlanning}
            >
              Start planning
            </button>

            <a
              className="p365-button p365-secondary"
              href="#how-it-works"
            >
              See how it works
            </a>
          </div>

          <div className="p365-hero-note">
            <span>✓ Simple enough for busy weeks</span>
            <span>✓ No perfection required</span>
          </div>
        </div>

        <div className="p365-hero-visual">
          <div className="p365-food-placeholder">
            <span>Fresh food photo coming soon</span>
          </div>

          <div className="p365-floating-card p365-week-card">
            <small>This week</small>
            <strong>5 dinners planned</strong>
          </div>

          <div className="p365-floating-card p365-list-card">
            <span>✓</span>
            <div>
              <small>Grocery list</small>
              <strong>Ready to shop</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="p365-message">
        Less deciding. Less scrambling. More meals that feel manageable.
      </section>

      <section className="p365-section" id="features">
        <div className="p365-section-heading">
          <p className="p365-eyebrow">WHY PLATEFUL 365</p>

          <h2>
            Make room for the parts of your day that matter more.
          </h2>

          <p>
            Meal planning should make life feel lighter — not turn into
            another complicated project.
          </p>
        </div>

        <div className="p365-feature-grid">
          {features.map((feature) => (
            <article className="p365-feature-card" key={feature.number}>
              <span>{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="p365-how" id="how-it-works">
        <div className="p365-how-image">
          <div className="p365-food-placeholder">
            <span>Meal inspiration coming soon</span>
          </div>
        </div>

        <div className="p365-how-copy">
          <p className="p365-eyebrow">HOW IT WORKS</p>

          <h2>Three simple steps to a more organized week.</h2>

          <div className="p365-steps">
            {steps.map((step) => (
              <div className="p365-step" key={step.number}>
                <span>{step.number}</span>

                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="p365-button p365-primary"
            onClick={onStartPlanning}
          >
            Plan my meals
          </button>
        </div>
      </section>

      <section className="p365-final-cta">
        <div>
          <p className="p365-eyebrow">ONE LESS THING TO THINK ABOUT</p>

          <h2>Give next week a softer landing.</h2>

          <p>
            Start with a simple meal plan and let Plateful 365 help you
            take it from there.
          </p>
        </div>

        <button
          className="p365-button p365-light"
          onClick={onStartPlanning}
        >
          Start my plan
        </button>
      </section>
    </main>
  );
}

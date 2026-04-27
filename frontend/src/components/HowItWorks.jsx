function HowItWorks({ steps }) {
  return (
    <div className="how-section">
      <h2>How It Works</h2>
      <div className="how-grid">
        {steps.map((step, i) => (
          <div key={i} className="how-card">
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;

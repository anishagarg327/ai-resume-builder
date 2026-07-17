export function SectionCardHeader({ title, subtitle, currentStepIndex, totalSteps }) {
  return (
    <div className="section-card-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <span className="step-count">
        {currentStepIndex + 1}/{totalSteps}
      </span>
    </div>
  )
}

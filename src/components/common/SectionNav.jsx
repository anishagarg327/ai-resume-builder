import { FORM_STEPS } from '../../constants/steps'

export function SectionNav({ activeStep, setActiveStep }) {
  return (
    <div className="section-nav">
      {FORM_STEPS.map((step) => (
        <button
          key={step.id}
          type="button"
          className={`section-btn ${activeStep === step.id ? 'active' : ''}`}
          onClick={() => setActiveStep(step.id)}
        >
          <span>{step.title}</span>
          <small>{step.subtitle}</small>
        </button>
      ))}
    </div>
  )
}

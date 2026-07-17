export function WizardActions({
  goBack,
  goNext,
  fillSampleData,
  resetForm,
  currentStepIndex,
  isAIStep,
}) {
  return (
    <div className="wizard-actions">
      <button className="ghost-btn" type="button" onClick={goBack} disabled={currentStepIndex === 0}>
        ← Back
      </button>
      <div className="wizard-actions-right">
        <button className="ghost-btn" type="button" onClick={fillSampleData}>
          ✨ Quick Fill Sample
        </button>
        <button className="ghost-btn" type="button" onClick={resetForm}>
          Reset Form
        </button>
        {!isAIStep && (
          <button className="primary-btn" type="button" onClick={goNext}>
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}

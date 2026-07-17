export function ChecklistDropdown({ checklistItems }) {
  return (
    <div className="checklist-dropdown">
      <h4>📋 Resume Strength Roadmap</h4>
      <p className="checklist-subtitle">Complete these sections to optimize your ATS visibility.</p>
      <div className="checklist-items">
        {checklistItems.map((item) => (
          <div key={item.key} className={`checklist-item ${item.isFilled ? 'completed' : 'pending'}`}>
            <span className="checklist-icon">{item.isFilled ? '✅' : '⭕'}</span>
            <span className="checklist-label">{item.label}</span>
            <span className="checklist-status">{item.isFilled ? 'Done' : 'Missing'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

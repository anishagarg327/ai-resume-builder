import { toBulletList } from '../../utils/formatters'

export function ExperienceItem({
  exp,
  index,
  updateExperience,
  deleteExperience,
  openDatePicker,
  polishBulletsWithAI,
  isPolishing,
}) {
  return (
    <div className="item-card">
      <div className="item-header-row">
        <span className="item-title">💼 Position #{index + 1}</span>
        <div className="item-actions">
          <button type="button" className="delete-btn" onClick={() => deleteExperience(index)}>
            🗑️ Delete
          </button>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Company / Organization</label>
          <input
            value={exp.company || ''}
            onChange={(e) => updateExperience(index, 'company', e.target.value)}
            placeholder="e.g. BrightLabs Tech"
          />
        </div>
        <div className="form-group">
          <label>Role / Job Title</label>
          <input
            value={exp.role || ''}
            onChange={(e) => updateExperience(index, 'role', e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            value={exp.location || ''}
            onChange={(e) => updateExperience(index, 'location', e.target.value)}
            placeholder="e.g. Bengaluru, India"
          />
        </div>
        <div className="form-group">
          <label>Dates / Duration</label>
          <div className="date-input-wrapper">
            <input
              value={exp.duration || ''}
              readOnly
              placeholder="Click to select dates..."
              onClick={() => openDatePicker('experience', index, exp.duration)}
            />
            <button
              type="button"
              className="calendar-btn"
              onClick={() => openDatePicker('experience', index, exp.duration)}
              title="Open date picker calendar"
            >
              📅
            </button>
          </div>
        </div>
        <div className="form-group full-width">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Role Description & Key Accomplishments</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className="ai-mini-btn"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#d1d5db', borderColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => updateExperience(index, 'description', toBulletList(exp.description))}
              >
                Format Bullets
              </button>
              <button
                type="button"
                className="ai-mini-btn"
                onClick={() => polishBulletsWithAI('experience', index)}
                disabled={isPolishing}
              >
                {isPolishing ? '⏳ Polishing...' : '✨ Gemini Polish'}
              </button>
            </div>
          </div>
          <textarea
            value={exp.description || ''}
            onChange={(e) => updateExperience(index, 'description', e.target.value)}
            rows={5}
            placeholder="Start typing your accomplishments. Use bullet points starting with - to structure them."
          />
        </div>
      </div>
    </div>
  )
}

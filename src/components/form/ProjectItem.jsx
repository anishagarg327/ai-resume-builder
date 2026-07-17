import { toBulletList } from '../../utils/formatters'

export function ProjectItem({
  proj,
  index,
  updateProject,
  deleteProject,
  openDatePicker,
  polishBulletsWithAI,
  isPolishing,
}) {
  return (
    <div className="item-card">
      <div className="item-header-row">
        <span className="item-title">💻 Project #{index + 1}</span>
        <div className="item-actions">
          <button type="button" className="delete-btn" onClick={() => deleteProject(index)}>
            🗑️ Delete
          </button>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Project Name</label>
          <input
            value={proj.name || ''}
            onChange={(e) => updateProject(index, 'name', e.target.value)}
            placeholder="e.g. DevSync Collaborative Editor"
          />
        </div>
        <div className="form-group">
          <label>Tech Stack / Technologies Used</label>
          <input
            value={proj.technologies || ''}
            onChange={(e) => updateProject(index, 'technologies', e.target.value)}
            placeholder="e.g. React, Node.js, WebSockets, Redis"
          />
        </div>
        <div className="form-group">
          <label>Duration / Completion Date</label>
          <div className="date-input-wrapper">
            <input
              value={proj.duration || ''}
              readOnly
              placeholder="Click to select date..."
              onClick={() => openDatePicker('projects', index, proj.duration)}
            />
            <button
              type="button"
              className="calendar-btn"
              onClick={() => openDatePicker('projects', index, proj.duration)}
              title="Open date picker calendar"
            >
              📅
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Project Link / Link URL</label>
          <input
            value={proj.link || ''}
            onChange={(e) => updateProject(index, 'link', e.target.value)}
            placeholder="github.com/username/project"
          />
        </div>
        <div className="form-group full-width">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Project Description & Core Functions</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className="ai-mini-btn"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#d1d5db', borderColor: 'rgba(255,255,255,0.08)' }}
                onClick={() => updateProject(index, 'description', toBulletList(proj.description))}
              >
                Format Bullets
              </button>
              <button
                type="button"
                className="ai-mini-btn"
                onClick={() => polishBulletsWithAI('projects', index)}
                disabled={isPolishing}
              >
                {isPolishing ? '⏳ Polishing...' : '✨ Gemini Polish'}
              </button>
            </div>
          </div>
          <textarea
            value={proj.description || ''}
            onChange={(e) => updateProject(index, 'description', e.target.value)}
            rows={4}
            placeholder="Detail what you built, what challenge it solved, and the key technology features."
          />
        </div>
      </div>
    </div>
  )
}

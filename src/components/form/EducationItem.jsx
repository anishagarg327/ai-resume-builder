export function EducationItem({ edu, index, updateEducation, deleteEducation, openDatePicker }) {
  return (
    <div className="item-card">
      <div className="item-header-row">
        <span className="item-title">🎓 Education #{index + 1}</span>
        <div className="item-actions">
          <button type="button" className="delete-btn" onClick={() => deleteEducation(index)}>
            🗑️ Delete
          </button>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Institution / School</label>
          <input
            value={edu.school || ''}
            onChange={(e) => updateEducation(index, 'school', e.target.value)}
            placeholder="e.g. IIT Delhi"
          />
        </div>
        <div className="form-group">
          <label>Degree / Qualification</label>
          <input
            value={edu.degree || ''}
            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
            placeholder="e.g. B.Tech in Computer Science"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            value={edu.location || ''}
            onChange={(e) => updateEducation(index, 'location', e.target.value)}
            placeholder="e.g. New Delhi, India"
          />
        </div>
        <div className="form-group">
          <label>Dates / Graduation Year</label>
          <div className="date-input-wrapper">
            <input
              value={edu.duration || ''}
              readOnly
              placeholder="Click to select year..."
              onClick={() => openDatePicker('education', index, edu.duration)}
            />
            <button
              type="button"
              className="calendar-btn"
              onClick={() => openDatePicker('education', index, edu.duration)}
              title="Open date picker calendar"
            >
              📅
            </button>
          </div>
        </div>
        <div className="form-group full-width">
          <label>GPA / Honors / Key Coursework Details</label>
          <textarea
            value={edu.details || ''}
            onChange={(e) => updateEducation(index, 'details', e.target.value)}
            rows={3}
            placeholder="e.g. GPA: 8.7/10.0. Focus areas: Advanced Algorithms, Web Engineering."
          />
        </div>
      </div>
    </div>
  )
}

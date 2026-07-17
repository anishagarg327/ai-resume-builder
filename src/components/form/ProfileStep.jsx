import { isValidLinkedInUrl, isValidGitHubUrl, isValidWebsiteUrl } from '../../utils/validators'

export function ProfileStep({ resumeData, handleChange, setResumeData, generateAISummary, aiSummaryLoading }) {
  const { name, title, email, phone, location, linkedin, github, website, summary } = resumeData || {}

  const isValidLinkedIn = isValidLinkedInUrl(linkedin)
  const isValidGitHub = isValidGitHubUrl(github)
  const isValidWebsite = isValidWebsiteUrl(website)

  return (
    <div className="form-grid">
      <div className="form-group">
        <label>👤 Full Name</label>
        <input name="name" value={name || ''} onChange={handleChange} placeholder="e.g. Aisha Patel" />
      </div>
      <div className="form-group">
        <label>💼 Target Job Title</label>
        <input name="title" value={title || ''} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
      </div>
      <div className="form-group">
        <label>✉️ Email Address</label>
        <input name="email" type="email" value={email || ''} onChange={handleChange} placeholder="hello@email.com" />
      </div>
      <div className="form-group">
        <label>📱 Phone Number</label>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={phone || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
            setResumeData((prev) => ({ ...prev, phone: val }))
          }}
          placeholder="9876543210"
        />
      </div>
      <div className="form-group">
        <label>📍 Location</label>
        <input name="location" value={location || ''} onChange={handleChange} placeholder="City, Country" />
      </div>
      <div className="form-group">
        <label>🔗 LinkedIn Link</label>
        <input
          name="linkedin"
          type="url"
          value={linkedin || ''}
          onChange={handleChange}
          placeholder="https://www.linkedin.com/in/username"
          style={{
            borderColor: linkedin && !isValidLinkedIn ? '#ef4444' : '',
          }}
        />
        {linkedin && !isValidLinkedIn && (
          <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
            Please enter a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username). Invalid links won&apos;t show on the resume.
          </small>
        )}
      </div>
      <div className="form-group">
        <label>💻 GitHub Profile</label>
        <input
          name="github"
          type="url"
          value={github || ''}
          onChange={handleChange}
          placeholder="https://github.com/username"
          style={{
            borderColor: github && !isValidGitHub ? '#ef4444' : '',
          }}
        />
        {github && !isValidGitHub && (
          <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
            Please enter a valid GitHub URL (e.g. https://github.com/username). Invalid links won&apos;t show on the resume.
          </small>
        )}
      </div>
      <div className="form-group">
        <label>🌐 Portfolio / Website</label>
        <input
          name="website"
          type="url"
          value={website || ''}
          onChange={handleChange}
          placeholder="https://username.dev"
          style={{
            borderColor: website && !isValidWebsite ? '#ef4444' : '',
          }}
        />
        {website && !isValidWebsite && (
          <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
            Please enter a valid URL (e.g. https://username.dev). Invalid links won&apos;t show on the resume.
          </small>
        )}
      </div>
      <div className="form-group full-width">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>📝 Professional Summary</label>
          <button
            type="button"
            className="ai-mini-btn"
            onClick={generateAISummary}
            disabled={aiSummaryLoading}
          >
            {aiSummaryLoading ? '⏳ Generating...' : '✨ Write with Gemini'}
          </button>
        </div>
        <textarea
          name="summary"
          value={summary || ''}
          onChange={handleChange}
          rows={4}
          placeholder="Summarize your experience, technical strengths, and core career direction."
        />
      </div>
    </div>
  )
}

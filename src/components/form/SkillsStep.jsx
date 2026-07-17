export function SkillsStep({ resumeData, handleChange, suggestSkillsWithAI, aiSkillsLoading }) {
  return (
    <div className="form-group full-width">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label>🛠️ Skills (Comma separated)</label>
        <button
          type="button"
          className="ai-mini-btn"
          onClick={suggestSkillsWithAI}
          disabled={aiSkillsLoading}
        >
          {aiSkillsLoading ? '⏳ Analyzing...' : '✨ Suggest skills from history'}
        </button>
      </div>
      <textarea
        name="skills"
        value={resumeData?.skills || ''}
        onChange={handleChange}
        rows={5}
        placeholder="e.g. React, Node.js, UI/UX, TypeScript, Figma, Jest, Agile Development"
      />
      <small style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '0.4rem', display: 'block' }}>
        Add keywords relevant to the position to pass ATS systems.
      </small>
    </div>
  )
}

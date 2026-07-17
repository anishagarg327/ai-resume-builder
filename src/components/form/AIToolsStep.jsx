export function AIToolsStep({ aiTone, handleToneChange, apiKey, handleApiKeyChange, enhanceWholeResume, loading }) {
  return (
    <div className="ai-card">
      <h3>✨ Gemini AI Assistant Workspace</h3>
      <p>
        Elevate your draft resume into a professional, ATS-optimized portfolio using Google Gemini.
        Our smart checks will refine sentence structure, fix typography, and optimize action-verbs.
      </p>
      <div className="tone-select-group">
        <label htmlFor="gemini-tone">🎯 Selected AI Enhancer Tone</label>
        <select
          id="gemini-tone"
          className="tone-select"
          value={aiTone}
          onChange={handleToneChange}
        >
          <option value="corporate">Corporate & Conservative (finance, consulting, corporate)</option>
          <option value="tech">Tech & Direct (software, engineering, metrics-driven)</option>
          <option value="creative">Creative & Narrative (startups, design, marketing)</option>
        </select>
      </div>
      <div className="api-key-card">
        <label htmlFor="gemini-key">🔑 Gemini API Key(s)</label>
        <input
          id="gemini-key"
          type="password"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="AIzaSy... (paste multiple keys separated by commas for auto-rotation)"
        />
        <small>
          Key(s) are saved locally in your browser — never sent to any server except Google.
          Get a free key at{' '}
          <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>
            Google AI Studio
          </a>.
          {' '}💡 <strong>Tip:</strong> Paste multiple comma-separated keys (e.g. <em>key1,key2,key3</em>) — when one hits quota the next is used automatically.
        </small>
      </div>
      <button className="ai-btn" onClick={enhanceWholeResume} disabled={loading || !apiKey.trim()}>
        {loading ? '⏳ Analyzing & Polishing entire resume...' : '✨ Enhance entire Resume with Gemini'}
      </button>
    </div>
  )
}

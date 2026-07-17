export function FormHeader({ theme, setTheme }) {
  return (
    <div className="form-heading-row">
      <div>
        <h2>✍️ Build your Profile</h2>
        <p>Guided, ATS-optimized builder updates your resume paper in real-time.</p>
      </div>
      <div className="theme-switcher">
        <button className={`chip ${theme === 'modern' ? 'active' : ''}`} onClick={() => setTheme('modern')}>
          Modern
        </button>
        <button className={`chip ${theme === 'classic' ? 'active' : ''}`} onClick={() => setTheme('classic')}>
          ATS Classic
        </button>
        <button className={`chip ${theme === 'minimalist' ? 'active' : ''}`} onClick={() => setTheme('minimalist')}>
          Minimalist
        </button>
      </div>
    </div>
  )
}

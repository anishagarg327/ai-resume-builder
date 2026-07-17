export function ProgressCard({ completion }) {
  return (
    <div className="progress-card">
      <div className="progress-meta">
        <span>Resume Strength Index</span>
        <strong>{completion}%</strong>
      </div>
      <div className="progress-bar">
        <div style={{ width: `${completion}%` }} />
      </div>
      <p>
        {completion < 100
          ? `Strength score: ${completion}%. Add more sections or polish detail nodes to raise completeness.`
          : 'Excellent profile strength! Standardizing themes and clicking download will render your ATS document.'}
      </p>
    </div>
  )
}

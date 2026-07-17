export const renderBullets = (text) => {
  if (!text) return null
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  const hasBullets = lines.some((line) => /^[-•*+]\s+/.test(line))

  if (hasBullets) {
    return (
      <ul className="resume-bullet-list">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[-•*+]\s*/, '')
          return <li key={idx}>{cleanLine}</li>
        })}
      </ul>
    )
  }

  return <p className="resume-summary-text" style={{ whiteSpace: 'pre-line' }}>{text}</p>
}

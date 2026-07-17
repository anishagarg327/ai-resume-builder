export function StatusPill({ statusMessage, statusTone }) {
  if (!statusMessage) return null

  return (
    <div className={`status-pill ${statusTone}`}>
      <span>{statusTone === 'success' ? '✅' : statusTone === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span>{statusMessage}</span>
    </div>
  )
}

export function ResumeSection({ title, children }) {
  if (!children) return null
  return (
    <div className="resume-section">
      <h3>{title}</h3>
      {children}
    </div>
  )
}

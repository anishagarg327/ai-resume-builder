export function ResumePaperHeader({ name, title, contactLineItems = [] }) {
  return (
    <div className="resume-top">
      <h1 className="resume-name">{name || 'Your Name'}</h1>
      {title && <p className="resume-title">{title}</p>}

      {contactLineItems.length > 0 ? (
        <p className="resume-contact">
          {contactLineItems.map((item, idx) => (
            <span key={`contact-${idx}`}>
              {item}
              {idx < contactLineItems.length - 1 && <span style={{ margin: '0 0.5rem', color: '#9ca3af' }}>•</span>}
            </span>
          ))}
        </p>
      ) : (
        <p className="resume-contact" style={{ color: '#9ca3af', fontStyle: 'italic' }}>
          Your contact channels will list here
        </p>
      )}
    </div>
  )
}

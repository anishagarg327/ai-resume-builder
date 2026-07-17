import { ChecklistDropdown } from './ChecklistDropdown'

export function PreviewHeader({
  completion,
  showChecklist,
  setShowChecklist,
  checklistItems,
  onDownloadPDF,
  onOpenInNewTab,
}) {
  return (
    <>
      <div className="preview-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
        <h2 style={{ whiteSpace: 'nowrap', margin: 0 }}>👁️ Live Paper Preview</h2>
        <div className="preview-actions" style={{ position: 'relative' }}>
          <button
            className="preview-pill"
            onClick={() => setShowChecklist(!showChecklist)}
            title="Click to view resume completion roadmap"
            style={{ border: '1px solid rgba(124, 58, 237, 0.2)', cursor: 'pointer' }}
          >
            📊 {completion}% Filled
          </button>
          {showChecklist && <ChecklistDropdown checklistItems={checklistItems} />}
          <button className="pdf-btn" onClick={onDownloadPDF}>
            ⬇️ Download PDF
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.8rem', marginBottom: '0.8rem', paddingRight: '1.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          Trouble downloading?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onOpenInNewTab()
            }}
            style={{ color: '#c084fc', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
          >
            Open in new tab to print/save
          </a>
        </span>
      </div>
    </>
  )
}

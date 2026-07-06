import { useState } from 'react'
import { jsPDF } from 'jspdf'

function ResumePreview({ resumeData, theme, enhanceAction, globalLoading }) {
  const {
    name,
    title,
    email,
    phone,
    location,
    linkedin,
    github,
    website,
    summary,
    experience = [],
    education = [],
    projects = [],
    skills = ''
  } = resumeData

  const [showChecklist, setShowChecklist] = useState(false)

  // Calculate completion percentage
  const checklistItems = [
    { key: 'name', label: 'Contact Name', isFilled: !!(name && name.trim()) },
    { key: 'title', label: 'Professional Title', isFilled: !!(title && title.trim()) },
    { key: 'email', label: 'Email Address', isFilled: !!(email && email.trim()) },
    { key: 'phone', label: 'Phone Number', isFilled: !!(phone && phone.trim()) },
    { key: 'location', label: 'Location Details', isFilled: !!(location && location.trim()) },
    { key: 'summary', label: 'Professional Summary', isFilled: !!(summary && summary.trim()) },
    { key: 'skills', label: 'Core Skills List', isFilled: !!(skills && skills.trim()) },
    { 
      key: 'experience', 
      label: 'Work Experience (1+)', 
      isFilled: (experience || []).some(exp => {
        const { id, ...rest } = exp
        return Object.values(rest).some(val => String(val || '').trim().length > 0)
      }) 
    },
    { 
      key: 'projects', 
      label: 'Personal Projects (1+)', 
      isFilled: (projects || []).some(proj => {
        const { id, ...rest } = proj
        return Object.values(rest).some(val => String(val || '').trim().length > 0)
      }) 
    },
    { 
      key: 'education', 
      label: 'Education Details (1+)', 
      isFilled: (education || []).some(edu => {
        const { id, ...rest } = edu
        return Object.values(rest).some(val => String(val || '').trim().length > 0)
      }) 
    },
  ]

  // Calculate completion percentage using weighted scoring
  let score = 0
  if (name && name.trim()) score += 4
  if (title && title.trim()) score += 4
  if (email && email.trim()) score += 4
  if (phone && phone.trim()) score += 4
  if (location && location.trim()) score += 4
  if (summary && summary.trim()) score += 15
  if (skills && skills.trim()) score += 10
  
  const hasExperience = (experience || []).some(exp => {
    const { id, ...rest } = exp
    return Object.values(rest).some(val => String(val || '').trim().length > 0)
  })
  if (hasExperience) score += 25

  const hasProjects = (projects || []).some(proj => {
    const { id, ...rest } = proj
    return Object.values(rest).some(val => String(val || '').trim().length > 0)
  })
  if (hasProjects) score += 15

  const hasEducation = (education || []).some(edu => {
    const { id, ...rest } = edu
    return Object.values(rest).some(val => String(val || '').trim().length > 0)
  })
  if (hasEducation) score += 15
  
  const completion = score
  
  // Skill tags separation
  const skillTags = skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  // Dynamic validation checks to filter out invalid links from preview and PDF
  const isValidLinkedIn = !linkedin || /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(linkedin)
  const isValidGitHub = !github || /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i.test(github)
  const isValidWebsite = !website || /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(website)

  // Construct contact display items (only showing valid URLs)
  const contactLineItems = [
    email,
    phone,
    location,
    isValidLinkedIn ? linkedin : null,
    isValidGitHub ? github : null,
    isValidWebsite ? website : null
  ].filter(Boolean)
  const contactLine = contactLineItems.join('  •  ')

  const renderBullets = (text) => {
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

  const generatePDFDocument = () => {
    // Create portrait standard A4 page PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const fontFamily = theme === 'classic' ? 'times' : 'helvetica'
    let y = 20 // vertical coordinate tracking

    // Helper: Ensure vertical space is available, add page if not
    const ensureSpace = (heightNeeded) => {
      if (y + heightNeeded > 280) {
        doc.addPage()
        y = 20
      }
    }

    // Helper: Add horizontal divider line
    const addSectionDivider = () => {
      ensureSpace(4)
      const color = theme === 'classic' ? [17, 24, 39] : theme === 'modern' ? [229, 231, 235] : [243, 244, 246]
      doc.setDrawColor(color[0], color[1], color[2])
      doc.setLineWidth(0.3)
      doc.line(15, y, 195, y)
      y += 5
    }

    // Helper: Add standard section title
    const addSectionTitle = (titleText) => {
      ensureSpace(12)
      y += 2
      doc.setFontSize(11)
      doc.setFont(fontFamily, 'bold')
      
      const textColor = theme === 'classic' ? [17, 24, 39] : theme === 'modern' ? [17, 24, 39] : [55, 65, 81]
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      
      doc.text(titleText.toUpperCase(), 15, y)
      y += 1.5
      addSectionDivider()
      
      // Reset color to body gray
      doc.setTextColor(55, 65, 81)
    }

    // Helper: Add bullet lists
    const addBulletList = (bulletText, fontSize = 9) => {
      if (!bulletText || !bulletText.trim()) return

      const bulletLines = String(bulletText)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      bulletLines.forEach((line) => {
        // Strip out existing bullet indicators like -, •, *
        const cleanLine = line.replace(/^[-•*+]\s*/, '')
        
        doc.setFontSize(fontSize)
        doc.setFont(fontFamily, 'normal')
        doc.setTextColor(55, 65, 81)

        // Bullet point dot symbol (using safe ASCII hyphen to prevent encoding corruption)
        const bulletSymbol = '-'
        
        // Wrap bullet description
        const textWidth = 172
        const lines = doc.splitTextToSize(cleanLine, textWidth)
        const lineHeight = fontSize * 0.46

        lines.forEach((subLine, idx) => {
          ensureSpace(lineHeight)
          if (idx === 0) {
            doc.text(bulletSymbol, 18, y)
            doc.text(subLine, 22, y)
          } else {
            doc.text(subLine, 22, y)
          }
          y += lineHeight
        })
        y += 0.8
      })
      y += 1.2
    }

    // 1. HEADER BLOCK (Centered for ALL Themes in PDF)
    doc.setTextColor(17, 24, 39) // Dark Gray/Black for text
    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(theme === 'classic' ? 22 : 20)
    doc.text(name || 'YOUR NAME', 105, y, { align: 'center' })
    y += theme === 'classic' ? 7 : 6

    if (title) {
      doc.setFont(fontFamily, theme === 'classic' ? 'normal' : 'bold')
      doc.setFontSize(11)
      if (theme === 'modern') {
        doc.setTextColor(55, 65, 81) // Dark gray for job title — professional look
      } else {
        doc.setTextColor(55, 65, 81)
      }
      doc.text(theme === 'classic' ? title.toUpperCase() : title, 105, y, { align: 'center' })
      y += 6
    }

    // Construct contact line with safe ASCII pipe separator for PDF encoding
    const pdfContactLine = contactLineItems.join('  |  ')
    if (pdfContactLine) {
      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(75, 85, 99)
      doc.text(pdfContactLine, 105, y, { align: 'center' })
      y += 8
    }

    // 2. PROFESSIONAL SUMMARY
    if (summary) {
      addSectionTitle('Summary')
      
      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(9)
      doc.setTextColor(55, 65, 81)
      
      const lines = doc.splitTextToSize(summary, 180)
      const lineHeight = 4.2
      
      lines.forEach((line) => {
        ensureSpace(lineHeight)
        doc.text(line, 15, y)
        y += lineHeight
      })
      y += 2
    }

    // 3. WORK EXPERIENCE
    if (experience && experience.length > 0) {
      addSectionTitle('Experience')

      experience.forEach((exp) => {
        ensureSpace(12)
        
        // Line 1: Job Title (Bold) & Dates (Right-aligned)
        doc.setFont(fontFamily, 'bold')
        doc.setFontSize(10)
        doc.setTextColor(17, 24, 39)
        doc.text(exp.role || 'Job Title', 15, y)
        
        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(75, 85, 99)
        doc.text(exp.duration || 'Duration', 195, y, { align: 'right' })
        y += 4.5

        // Line 2: Company, Location (Bold-Italicized)
        doc.setFont(fontFamily, 'bolditalic')
        doc.setFontSize(9)
        doc.setTextColor(55, 65, 81)
        const compLocStr = [exp.company, exp.location].filter(Boolean).join(', ')
        doc.text(compLocStr || 'Company Details', 15, y)
        y += 5.5

        // Line 3+: Bullet descriptions
        if (exp.description) {
          addBulletList(exp.description, 9)
        }
        y += 2
      })
    }

    // 4. PROJECTS
    if (projects && projects.length > 0) {
      addSectionTitle('Projects')

      projects.forEach((proj) => {
        ensureSpace(12)

        // Line 1: Project Name (Bold) & Dates (Right-aligned)
        doc.setFont(fontFamily, 'bold')
        doc.setFontSize(10)
        doc.setTextColor(17, 24, 39)
        doc.text(proj.name || 'Project Title', 15, y)

        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(75, 85, 99)
        doc.text(proj.duration || 'Duration', 195, y, { align: 'right' })
        y += 4.5

        // Line 2: Tech stack & optional link (Bold technologies stack)
        doc.setFont(fontFamily, 'bold')
        doc.setFontSize(8.5)
        doc.setTextColor(107, 114, 128)
        const techStr = proj.technologies ? `Technologies: ${proj.technologies}` : ''
        doc.text(techStr, 15, y)

        if (proj.link) {
          doc.setFont(fontFamily, 'italic')
          doc.setTextColor(59, 130, 246) // link blue
          doc.text(proj.link, 195, y, { align: 'right' })
        }
        y += 5.5

        // Descriptions
        if (proj.description) {
          addBulletList(proj.description, 9)
        }
        y += 2
      })
    }

    // 5. EDUCATION
    if (education && education.length > 0) {
      addSectionTitle('Education')

      education.forEach((edu) => {
        ensureSpace(12)

        // Degree & Dates
        doc.setFont(fontFamily, 'bold')
        doc.setFontSize(10)
        doc.setTextColor(17, 24, 39)
        doc.text(edu.degree || 'Degree Detail', 15, y)

        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(75, 85, 99)
        doc.text(edu.duration || 'Graduation Period', 195, y, { align: 'right' })
        y += 4.5

        // School & Location (Bold-Italic)
        doc.setFont(fontFamily, 'bolditalic')
        doc.setFontSize(9)
        doc.setTextColor(55, 65, 81)
        const schoolLocStr = [edu.school, edu.location].filter(Boolean).join(', ')
        doc.text(schoolLocStr || 'Institution', 15, y)
        y += 5

        // Details description
        if (edu.details) {
          doc.setFont(fontFamily, 'normal')
          doc.setFontSize(8.5)
          doc.setTextColor(107, 114, 128)
          const lines = doc.splitTextToSize(edu.details, 180)
          lines.forEach((line) => {
            ensureSpace(4)
            doc.text(line, 15, y)
            y += 4
          })
        }
        y += 3
      })
    }

    // 6. SKILLS
    if (skills) {
      addSectionTitle('Skills')
      ensureSpace(10)

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(9)
      doc.setTextColor(55, 65, 81)

      if (theme === 'classic') {
        // Render comma-separated format (using safe ASCII pipe to prevent encoding corruption)
        const cleanSkills = skills.split(',').map(s => s.trim()).filter(Boolean).join('  |  ')
        const lines = doc.splitTextToSize(cleanSkills, 180)
        const lineHeight = 4.2
        lines.forEach(line => {
          ensureSpace(lineHeight)
          doc.text(line, 15, y)
          y += lineHeight
        })
      } else {
        // Tag-like comma lists
        const lines = doc.splitTextToSize(skills, 180)
        const lineHeight = 4.2
        lines.forEach(line => {
          ensureSpace(lineHeight)
          doc.text(line, 15, y)
          y += lineHeight
        })
      }
    }

    // Add page numbers at the footer of each page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont(fontFamily, 'normal')
      doc.setTextColor(156, 163, 175)
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' })
    }

    return doc
  }

  const downloadPDF = () => {
    try {
      const doc = generatePDFDocument()
      
      // Use jsPDF's built-in save which handles filename correctly across browsers
      // The filename MUST end with .pdf for the browser to treat it as a PDF
      const safeName = (name || 'resume').trim().replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_') || 'resume'
      const fileName = `${safeName}_resume.pdf`
      
      // Method: output as blob and use msSaveBlob (IE/Edge) or anchor download
      const pdfBlob = doc.output('blob')
      
      // IE / legacy Edge
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(pdfBlob, fileName)
        return
      }
      
      // Modern browsers: create Object URL with proper MIME type
      // We re-create the blob to guarantee the MIME type is set
      const typedBlob = new Blob([pdfBlob], { type: 'application/pdf' })
      const objectUrl = URL.createObjectURL(typedBlob)
      
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = fileName   // <-- THIS must end in .pdf
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      // Revoke after a short delay so download completes
      setTimeout(() => URL.revokeObjectURL(objectUrl), 3000)
    } catch (err) {
      console.error('PDF download failed:', err)
      openPdfInNewTab()
    }
  }

  const openPdfInNewTab = () => {
    try {
      const doc = generatePDFDocument()
      // Open as data URI so the browser PDF viewer shows it
      const dataUri = doc.output('datauristring')
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(
          `<html><head><title>Resume Preview</title></head>` +
          `<body style="margin:0"><embed width="100%" height="100%" src="${dataUri}" type="application/pdf"/></body></html>`
        )
        win.document.close()
      } else {
        alert('Popup blocked. Please allow popups for this site and try again.')
      }
    } catch (err) {
      console.error('Failed to open PDF in new tab:', err)
      alert('Could not generate PDF. Please check your data and try again.')
    }
  }

  return (
    <div className="preview-container">
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
          {showChecklist && (
            <div className="checklist-dropdown">
              <h4>📋 Resume Strength Roadmap</h4>
              <p className="checklist-subtitle">Complete these sections to optimize your ATS visibility.</p>
              <div className="checklist-items">
                {checklistItems.map((item) => (
                  <div key={item.key} className={`checklist-item ${item.isFilled ? 'completed' : 'pending'}`}>
                    <span className="checklist-icon">{item.isFilled ? '✅' : '⭕'}</span>
                    <span className="checklist-label">{item.label}</span>
                    <span className="checklist-status">{item.isFilled ? 'Done' : 'Missing'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button className="pdf-btn" onClick={downloadPDF}>
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
              e.preventDefault();
              openPdfInNewTab();
            }}
            style={{ color: '#c084fc', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
          >
            Open in new tab to print/save
          </a>
        </span>
      </div>

      <div className={`resume-paper ${theme}`}>
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

        {summary && (
          <div className="resume-section">
            <h3>Summary</h3>
            <p className="resume-summary-text">{summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="resume-section">
            <h3>Experience</h3>
            <div className="resume-section-body">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="resume-item">
                  <div className="resume-item-header">
                    <span className="resume-item-title">{exp.role || 'Role Name'}</span>
                    <span>{exp.duration}</span>
                  </div>
                  <div className="resume-item-sub">
                    <span>{exp.company}{exp.location && `, ${exp.location}`}</span>
                  </div>
                  {exp.description && (
                    <div className="resume-item-desc">
                      {renderBullets(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="resume-section">
            <h3>Projects</h3>
            <div className="resume-section-body">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="resume-item">
                  <div className="resume-item-header">
                    <span className="resume-item-title">{proj.name || 'Project Name'}</span>
                    <span>{proj.duration}</span>
                  </div>
                  <div className="resume-item-sub">
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'normal' }}>
                      {proj.technologies && `Technologies: ${proj.technologies}`}
                    </span>
                    {proj.link && (
                      <a href={`https://${proj.link}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'underline' }}>
                        {proj.link}
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <div className="resume-item-desc">
                      {renderBullets(proj.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div className="resume-section">
            <h3>Education</h3>
            <div className="resume-section-body">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="resume-item">
                  <div className="resume-item-header">
                    <span className="resume-item-title">{edu.degree || 'Degree name'}</span>
                    <span>{edu.duration}</span>
                  </div>
                  <div className="resume-item-sub">
                    <span>{edu.school}{edu.location && `, ${edu.location}`}</span>
                  </div>
                  {edu.details && (
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {skillTags.length > 0 && (
          <div className="resume-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {theme === 'classic' ? (
                <div style={{ fontSize: '0.85rem', color: '#1f2937', lineHeight: '1.6' }}>
                  {skillTags.join('  •  ')}
                </div>
              ) : (
                skillTags.map((skill, index) => (
                  <span key={`${skill}-${index}`} className="skill-badge">
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {!name && !title && !summary && experience.length === 0 && education.length === 0 && projects.length === 0 && !skills && (
          <div className="placeholder">
            <span>✨</span>
            <p>Fill the guided form sections on the left. Your live resume sheet compiles automatically.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumePreview
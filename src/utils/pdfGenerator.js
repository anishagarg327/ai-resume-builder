import { jsPDF } from 'jspdf'
import { isValidLinkedInUrl, isValidGitHubUrl, isValidWebsiteUrl } from './validators'

export const getContactLineItems = (resumeData) => {
  if (!resumeData) return []
  const { email, phone, location, linkedin, github, website } = resumeData
  const isValidLinkedIn = isValidLinkedInUrl(linkedin)
  const isValidGitHub = isValidGitHubUrl(github)
  const isValidWebsite = isValidWebsiteUrl(website)

  return [
    email,
    phone,
    location,
    isValidLinkedIn ? linkedin : null,
    isValidGitHub ? github : null,
    isValidWebsite ? website : null
  ].filter(Boolean)
}

export const generatePDFDocument = (resumeData, theme) => {
  const {
    name,
    title,
    summary,
    experience = [],
    education = [],
    projects = [],
    skills = ''
  } = resumeData || {}

  const contactLineItems = getContactLineItems(resumeData)

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const fontFamily = theme === 'classic' ? 'times' : 'helvetica'
  let y = 20

  const ensureSpace = (heightNeeded) => {
    if (y + heightNeeded > 280) {
      doc.addPage()
      y = 20
    }
  }

  const addSectionDivider = () => {
    ensureSpace(4)
    const color = theme === 'classic' ? [17, 24, 39] : theme === 'modern' ? [229, 231, 235] : [243, 244, 246]
    doc.setDrawColor(color[0], color[1], color[2])
    doc.setLineWidth(0.3)
    doc.line(15, y, 195, y)
    y += 5
  }

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

    doc.setTextColor(55, 65, 81)
  }

  const addBulletList = (bulletText, fontSize = 9) => {
    if (!bulletText || !bulletText.trim()) return

    const bulletLines = String(bulletText)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    bulletLines.forEach((line) => {
      const cleanLine = line.replace(/^[-•*+]\s*/, '')

      doc.setFontSize(fontSize)
      doc.setFont(fontFamily, 'normal')
      doc.setTextColor(55, 65, 81)

      const bulletSymbol = '-'
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

  // 1. HEADER BLOCK
  doc.setTextColor(17, 24, 39)
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(theme === 'classic' ? 22 : 20)
  doc.text(name || 'YOUR NAME', 105, y, { align: 'center' })
  y += theme === 'classic' ? 7 : 6

  if (title) {
    doc.setFont(fontFamily, theme === 'classic' ? 'normal' : 'bold')
    doc.setFontSize(11)
    if (theme === 'modern') {
      doc.setTextColor(55, 65, 81)
    } else {
      doc.setTextColor(55, 65, 81)
    }
    doc.text(theme === 'classic' ? title.toUpperCase() : title, 105, y, { align: 'center' })
    y += 6
  }

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

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(10)
      doc.setTextColor(17, 24, 39)
      doc.text(exp.role || 'Job Title', 15, y)

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(75, 85, 99)
      doc.text(exp.duration || 'Duration', 195, y, { align: 'right' })
      y += 4.5

      doc.setFont(fontFamily, 'bolditalic')
      doc.setFontSize(9)
      doc.setTextColor(55, 65, 81)
      const compLocStr = [exp.company, exp.location].filter(Boolean).join(', ')
      doc.text(compLocStr || 'Company Details', 15, y)
      y += 5.5

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

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(10)
      doc.setTextColor(17, 24, 39)
      doc.text(proj.name || 'Project Title', 15, y)

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(75, 85, 99)
      doc.text(proj.duration || 'Duration', 195, y, { align: 'right' })
      y += 4.5

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(107, 114, 128)
      const techStr = proj.technologies ? `Technologies: ${proj.technologies}` : ''
      doc.text(techStr, 15, y)

      if (proj.link) {
        doc.setFont(fontFamily, 'italic')
        doc.setTextColor(59, 130, 246)
        doc.text(proj.link, 195, y, { align: 'right' })
      }
      y += 5.5

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

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(10)
      doc.setTextColor(17, 24, 39)
      doc.text(edu.degree || 'Degree Detail', 15, y)

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(75, 85, 99)
      doc.text(edu.duration || 'Graduation Period', 195, y, { align: 'right' })
      y += 4.5

      doc.setFont(fontFamily, 'bolditalic')
      doc.setFontSize(9)
      doc.setTextColor(55, 65, 81)
      const schoolLocStr = [edu.school, edu.location].filter(Boolean).join(', ')
      doc.text(schoolLocStr || 'Institution', 15, y)
      y += 5

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
      const cleanSkills = skills.split(',').map((s) => s.trim()).filter(Boolean).join('  |  ')
      const lines = doc.splitTextToSize(cleanSkills, 180)
      const lineHeight = 4.2
      lines.forEach((line) => {
        ensureSpace(lineHeight)
        doc.text(line, 15, y)
        y += lineHeight
      })
    } else {
      const lines = doc.splitTextToSize(skills, 180)
      const lineHeight = 4.2
      lines.forEach((line) => {
        ensureSpace(lineHeight)
        doc.text(line, 15, y)
        y += lineHeight
      })
    }
  }

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

export const downloadPDF = (resumeData, theme) => {
  try {
    const doc = generatePDFDocument(resumeData, theme)
    const safeName = (resumeData?.name || 'resume').trim().replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_') || 'resume'
    const fileName = `${safeName}_resume.pdf`

    const pdfBlob = doc.output('blob')

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(pdfBlob, fileName)
      return
    }

    const typedBlob = new Blob([pdfBlob], { type: 'application/pdf' })
    const objectUrl = URL.createObjectURL(typedBlob)

    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(objectUrl), 3000)
  } catch (err) {
    console.error('PDF download failed:', err)
    openPdfInNewTab(resumeData, theme)
  }
}

export const openPdfInNewTab = (resumeData, theme) => {
  try {
    const doc = generatePDFDocument(resumeData, theme)
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

import { useState } from 'react'
import { PreviewHeader } from './preview/PreviewHeader'
import { ResumePaper } from './preview/ResumePaper'
import { useCompletion } from '../hooks/useCompletion'
import { downloadPDF, openPdfInNewTab } from '../utils/pdfGenerator'

function ResumePreview({ resumeData, theme, enhanceAction, globalLoading }) {
  // Prevent unused variable warnings while maintaining strict prop compatibility
  void enhanceAction
  void globalLoading

  const [showChecklist, setShowChecklist] = useState(false)
  const { completion, checklistItems } = useCompletion(resumeData)

  const handleDownloadPDF = () => {
    downloadPDF(resumeData, theme)
  }

  const handleOpenInNewTab = () => {
    openPdfInNewTab(resumeData, theme)
  }

  return (
    <div className="preview-container">
      <PreviewHeader
        completion={completion}
        showChecklist={showChecklist}
        setShowChecklist={setShowChecklist}
        checklistItems={checklistItems}
        onDownloadPDF={handleDownloadPDF}
        onOpenInNewTab={handleOpenInNewTab}
      />
      <ResumePaper resumeData={resumeData} theme={theme} />
    </div>
  )
}

export default ResumePreview
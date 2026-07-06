import { useState, useEffect } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import './App.css'

const initialResumeData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: '',
}

function App() {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resume_draft')
    try {
      return saved ? JSON.parse(saved) : initialResumeData
    } catch (e) {
      console.error('Failed to parse saved resume draft:', e)
      return initialResumeData
    }
  })
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('resume_theme') || 'modern'
  })
  const [enhanceAction, setEnhanceAction] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('resume_draft', JSON.stringify(resumeData))
  }, [resumeData])

  useEffect(() => {
    localStorage.setItem('resume_theme', theme)
  }, [theme])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✨ AI Resume Builder</h1>
        <p>Build a polished resume in minutes with guided steps and instant preview.</p>
      </header>

      <div className="main-layout">
        <ResumeForm
          resumeData={resumeData}
          setResumeData={setResumeData}
          theme={theme}
          setTheme={setTheme}
          setEnhanceAction={setEnhanceAction}
          setGlobalLoading={setLoading}
        />
        <ResumePreview 
          resumeData={resumeData} 
          theme={theme} 
          enhanceAction={enhanceAction}
          globalLoading={loading}
        />
      </div>
    </div>
  )
}

export default App
import { useMemo, useState, useEffect } from 'react'

const emptyResumeData = {
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

const sampleResumeData = {
  name: 'Aisha Patel',
  title: 'Senior Frontend Engineer',
  email: 'aisha.patel@email.com',
  phone: '9876543210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/aishapatel',
  github: 'github.com/aishapatel',
  website: 'aishapatel.dev',
  summary: 'Product-minded Frontend Engineer with 5+ years of experience specializing in React, TypeScript, and high-performance web applications. Proven track record of leading complex migrations, developing reusable component libraries, accelerating client delivery times, and mentoring cross-functional engineering teams.',
  experience: [
    {
      id: 'exp-1',
      company: 'BrightLabs Tech',
      role: 'Senior Frontend Developer',
      location: 'Bengaluru, India',
      duration: 'June 2022 - Present',
      description: '- Led architectural migration of legacy dashboards to Next.js/TypeScript, increasing PageSpeed score from 50 to 92.\n- Built a reusable responsive component library, cutting client onboarding development time by 25%.\n-Partnered with design team to enforce WCAG AA accessibility compliance across 4 core workflows.\n-Boosted test coverage by 35% using React Testing Library to establish front-end testing benchmarks.'
    },
    {
      id: 'exp-2',
      company: 'DataFlow Systems',
      role: 'Software Engineer',
      location: 'Pune, India',
      duration: 'Jan 2020 - May 2022',
      description: '- Developed real-time telemetry analytics dashboards using React, Redux, and D3.js, rendering over 10k data nodes efficiently.\n- Authored unit and integration test suites using Jest and React Testing Library, reducing production visual bugs by 30%.\n- Integrated RESTful APIs and optimized payload queries, reducing API response parser overhead by 15%.'
    },
    {
      id: 'exp-3',
      company: 'WebCraft Solutions',
      role: 'Frontend Engineering Intern',
      location: 'Mumbai, India',
      duration: 'May 2019 - Aug 2019',
      description: '- Built dynamic and responsive landing pages utilizing HTML5, CSS3, JavaScript (ES6), and Bootstrap.\n- Resolved cross-browser layout inconsistencies, ensuring consistent mobile responsiveness.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'IIT Delhi',
      degree: 'B.Tech in Computer Science',
      location: 'New Delhi, India',
      duration: '2016 - 2020',
      details: 'GPA: 8.7/10.0. Focus areas: Advanced Algorithms, Web Engineering, Database Systems, Computer Networks.'
    },
    {
      id: 'edu-2',
      school: 'State Academy School',
      degree: 'Higher Secondary Certification (HSC)',
      location: 'Bengaluru, India',
      duration: '2014 - 2016',
      details: 'Scored 94.2% in Mathematics, Physics, Chemistry, and Computer Science.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'DevSync Collaborative Editor',
      technologies: 'React, Node.js, WebSockets, Redis',
      duration: 'Aug 2023 - Nov 2023',
      link: 'github.com/aishapatel/devsync',
      description: '- Engineered a live collaborative code editor supporting simultaneous edits for up to 50 concurrent users.\n- Designed conflict resolution logic utilizing operational transformation algorithms to guarantee real-time data consistency.'
    },
    {
      id: 'proj-2',
      name: 'EcoTracker Dashboard',
      technologies: 'React, Node.js, Express, MongoDB, Chart.js',
      duration: 'Jan 2024 - Mar 2024',
      link: 'github.com/aishapatel/ecotracker',
      description: '- Programmed a web app tracking carbon footprint emissions, utilizing interactive visualization charts with Chart.js.\n- Designed a secure MongoDB backend storing history entries, fetching historical logs in under 50ms.'
    }
  ],
  skills: 'React, TypeScript, JavaScript, Next.js, Redux, D3.js, Jest, REST APIs, WebSockets, HTML5, CSS3, Git, UI/UX Design, Agile',
}

const DEFAULT_GEMINI_API_KEY = 'AIzaSyCn96SojPNgJbJe8wLrCsyXEEZXS7V5Zbs'

// Local Enhancer Fallback Helpers
const localEnhanceSummary = (title, skills) => {
  return `Results-driven and product-focused ${title || 'Professional'} specializing in ${skills || 'industry-standard technologies'}. Proven track record of delivering user-centric features, optimizing development workflows, and collaborating across engineering pipelines to build accessible, high-fidelity systems.`
}

const localEnhanceBulletPoints = (text) => {
  const cleaned = String(text || '').trim()
  if (!cleaned) return ''
  const lines = cleaned.split('\n').map((line) => line.trim()).filter(Boolean)
  
  const polishedLines = lines.map((line) => {
    let clean = line.replace(/^[-•*+]\s*/, '')
    if (!clean) return ''
    clean = clean.charAt(0).toUpperCase() + clean.slice(1)
    
    // Replace passive starting phrases with strong action verbs
    const actionVerbReplacements = [
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+writing/i, replacement: 'Engineered' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+building/i, replacement: 'Constructed' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+developing/i, replacement: 'Architected' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+creating/i, replacement: 'Designed' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+managing/i, replacement: 'Orchestrated' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+improving/i, replacement: 'Optimized' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+leading/i, replacement: 'Spearheaded' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+testing/i, replacement: 'Validated' },
      { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+/i, replacement: 'Facilitated ' },
      { pattern: /^i\s+(wrote|built|created|made)/i, replacement: 'Engineered' },
      { pattern: /^i\s+led/i, replacement: 'Spearheaded' },
      { pattern: /^i\s+managed/i, replacement: 'Orchestrated' }
    ]

    for (const rule of actionVerbReplacements) {
      if (rule.pattern.test(clean)) {
        clean = clean.replace(rule.pattern, rule.replacement)
        break
      }
    }

    // Ensure it starts with an action verb (words ending in 'ed' are usually past-tense verbs, e.g. Partnered, Resolved, Assisted)
    const firstWord = clean.split(/\s+/)[0] || ''
    const startsWithActionVerb = /ed$/i.test(firstWord) || 
      /^(led|built|run|wrote|drove|set|made|cut|won|did|got|had|spearheaded|architected)$/i.test(firstWord)
    
    if (!startsWithActionVerb) {
      // Cycle through high-impact action verbs to avoid repeating "Optimized"
      const verbs = ['Streamlined', 'Enhanced', 'Orchestrated', 'Optimized', 'Spearheaded', 'Facilitated']
      // Simple hash index based on first few characters to keep it deterministic per line
      const hash = clean.charCodeAt(0) + (clean.charCodeAt(1) || 0)
      const fallbackVerb = verbs[hash % verbs.length]
      clean = fallbackVerb + ' and ' + clean.charAt(0).toLowerCase() + clean.slice(1)
    }

    return `- ${clean}`
  })

  return polishedLines.join('\n')
}

function ResumeForm({ resumeData, setResumeData, theme, setTheme, setEnhanceAction, setGlobalLoading }) {
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState('profile')
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState('info')
  const [aiTone, setAiTone] = useState(() => {
    return localStorage.getItem('gemini_ai_tone') || 'corporate'
  })
  const [apiKey, setApiKey] = useState(() => {
    const stored = localStorage.getItem('gemini_api_key')
    // Accept all keys — both AIzaSy... (old format) and AQ.... (new Google AI Studio format)
    if (stored && stored.trim() !== '') {
      return stored
    }
    return import.meta.env.VITE_GEMINI_API_KEY?.trim() || DEFAULT_GEMINI_API_KEY
  })

  const [aiActionLoading, setAiActionLoading] = useState({
    summary: false,
    skills: false,
    experience: {},
    projects: {},
    global: false
  })

  // Date Picker States
  const [activeDatePicker, setActiveDatePicker] = useState(null) // { type: 'experience'|'education'|'projects', index: number }
  const [startMonth, setStartMonth] = useState('Jan')
  const [startYear, setStartYear] = useState('2024')
  const [endMonth, setEndMonth] = useState('Jan')
  const [endYear, setEndYear] = useState('2024')
  const [isPresent, setIsPresent] = useState(false)
  const [isYearOnly, setIsYearOnly] = useState(false)

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const YEARS = useMemo(() => {
    const arr = []
    const currentYear = new Date().getFullYear()
    for (let y = currentYear + 5; y >= currentYear - 40; y--) {
      arr.push(String(y))
    }
    return arr
  }, [])

  const openDatePicker = (type, index, currentValue) => {
    setStartMonth('Jan')
    setStartYear(new Date().getFullYear().toString())
    setEndMonth('Jan')
    setEndYear(new Date().getFullYear().toString())
    setIsPresent(false)
    setIsYearOnly(type === 'education') // default to year-only for education

    if (currentValue && currentValue.trim()) {
      const parts = currentValue.split('-').map(p => p.trim())
      if (parts.length === 2) {
        const start = parts[0]
        const end = parts[1]

        const isYearOnlyFormat = /^\d{4}$/.test(start) && /^\d{4}$/.test(end)
        if (isYearOnlyFormat) {
          setIsYearOnly(true)
          setStartYear(start)
          setEndYear(end)
        } else {
          const startParts = start.split(' ')
          if (startParts.length === 2) {
            setStartMonth(startParts[0])
            setStartYear(startParts[1])
          }

          if (end === 'Present') {
            setIsPresent(true)
          } else {
            const endParts = end.split(' ')
            if (endParts.length === 2) {
              setEndMonth(endParts[0])
              setEndYear(endParts[1])
            }
          }
        }
      } else if (/^\d{4}$/.test(currentValue.trim())) {
        setIsYearOnly(true)
        setStartYear(currentValue.trim())
        setEndYear(currentValue.trim())
      }
    }

    setActiveDatePicker({ type, index })
  }

  const applySelectedDate = () => {
    let dateStr = ''
    if (isYearOnly) {
      if (startYear === endYear) {
        dateStr = startYear
      } else {
        dateStr = `${startYear} - ${endYear}`
      }
    } else {
      const startStr = `${startMonth} ${startYear}`
      const endStr = isPresent ? 'Present' : `${endMonth} ${endYear}`
      dateStr = `${startStr} - ${endStr}`
    }

    const { type, index } = activeDatePicker
    if (type === 'experience') {
      updateExperience(index, 'duration', dateStr)
    } else if (type === 'education') {
      updateEducation(index, 'duration', dateStr)
    } else if (type === 'projects') {
      updateProject(index, 'duration', dateStr)
    }

    setActiveDatePicker(null)
  }

  const clearSelectedDate = () => {
    const { type, index } = activeDatePicker
    if (type === 'experience') {
      updateExperience(index, 'duration', '')
    } else if (type === 'education') {
      updateEducation(index, 'duration', '')
    } else if (type === 'projects') {
      updateProject(index, 'duration', '')
    }
    setActiveDatePicker(null)
  }

  const isInvalidDateRange = useMemo(() => {
    if (!activeDatePicker) return false
    if (isYearOnly) {
      return parseInt(startYear) > parseInt(endYear)
    } else {
      if (isPresent) return false
      const startIndex = MONTHS.indexOf(startMonth)
      const endIndex = MONTHS.indexOf(endMonth)
      return (parseInt(startYear) * 12 + startIndex) > (parseInt(endYear) * 12 + endIndex)
    }
  }, [activeDatePicker, isYearOnly, isPresent, startMonth, startYear, endMonth, endYear, MONTHS])

  const handleToneChange = (e) => {
    const val = e.target.value
    setAiTone(val)
    localStorage.setItem('gemini_ai_tone', val)
  }

  // Calculate fields filled percentage
  // Calculate fields filled percentage using weighted scoring
  const completion = useMemo(() => {
    let score = 0
    
    // 1. Personal Info (Max 20%): 5 fields, 4% each
    const personalFields = ['name', 'title', 'email', 'phone', 'location']
    personalFields.forEach(field => {
      if (String(resumeData[field] || '').trim().length > 0) {
        score += 4
      }
    })
    
    // 2. Professional Summary (Max 15%)
    if (String(resumeData.summary || '').trim().length > 0) {
      score += 15
    }
    
    // 3. Skills (Max 10%)
    if (String(resumeData.skills || '').trim().length > 0) {
      score += 10
    }
    
    // 4. Experience (Max 25%)
    const hasExperience = (resumeData.experience || []).some(exp => {
      const { id, ...rest } = exp
      return Object.values(rest).some(val => String(val || '').trim().length > 0)
    })
    if (hasExperience) {
      score += 25
    }
    
    // 5. Projects (Max 15%)
    const hasProjects = (resumeData.projects || []).some(proj => {
      const { id, ...rest } = proj
      return Object.values(rest).some(val => String(val || '').trim().length > 0)
    })
    if (hasProjects) {
      score += 15
    }
    
    // 6. Education (Max 15%)
    const hasEducation = (resumeData.education || []).some(edu => {
      const { id, ...rest } = edu
      return Object.values(rest).some(val => String(val || '').trim().length > 0)
    })
    if (hasEducation) {
      score += 15
    }
    
    return score
  }, [resumeData])

  const steps = [
    { id: 'profile', title: 'Profile', subtitle: 'Your basics' },
    { id: 'experience', title: 'Experience', subtitle: 'Your impact' },
    { id: 'education', title: 'Education', subtitle: 'Your background' },
    { id: 'projects', title: 'Projects', subtitle: 'Your works' },
    { id: 'skills', title: 'Skills', subtitle: 'Your strengths' },
    { id: 'ai', title: 'AI Tools', subtitle: 'Enhance it' },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === activeStep)
  const currentStep = steps[currentStepIndex]

  const handleApiKeyChange = (e) => {
    const val = e.target.value
    setApiKey(val)
    localStorage.setItem('gemini_api_key', val)
  }

  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value })
  }

  const fillSampleData = () => {
    setResumeData(JSON.parse(JSON.stringify(sampleResumeData)))
    setActiveStep('profile')
    setStatusMessage('A polished, professional sample has been loaded. Check the live preview!')
    setStatusTone('success')
  }

  const resetForm = () => {
    setResumeData(JSON.parse(JSON.stringify(emptyResumeData)))
    setActiveStep('profile')
    setStatusMessage('Form reset. Ready for your data.')
    setStatusTone('info')
  }

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setActiveStep(steps[currentStepIndex + 1].id)
    }
  }

  const goBack = () => {
    if (currentStepIndex > 0) {
      setActiveStep(steps[currentStepIndex - 1].id)
    }
  }

  const toBulletList = (value) => {
    const cleaned = String(value || '').trim()
    if (!cleaned) return ''

    const lines = cleaned
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)

    const formattedLines = lines.map((line) => {
      if (/^[-•*+]\s+/.test(line)) {
        return line.replace(/^[-•*+]\s*/, '- ')
      }
      return `- ${line}`
    })

    return formattedLines.join('\n')
  }

  // Work Experience array managers
  const addExperience = () => {
    const list = [...(resumeData.experience || [])]
    list.push({
      id: 'exp-' + Date.now(),
      company: '',
      role: '',
      location: '',
      duration: '',
      description: ''
    })
    setResumeData({ ...resumeData, experience: list })
  }

  const updateExperience = (index, field, value) => {
    const list = [...(resumeData.experience || [])]
    list[index] = { ...list[index], [field]: value }
    setResumeData({ ...resumeData, experience: list })
  }

  const deleteExperience = (index) => {
    const list = (resumeData.experience || []).filter((_, i) => i !== index)
    setResumeData({ ...resumeData, experience: list })
  }

  // Education array managers
  const addEducation = () => {
    const list = [...(resumeData.education || [])]
    list.push({
      id: 'edu-' + Date.now(),
      school: '',
      degree: '',
      location: '',
      duration: '',
      details: ''
    })
    setResumeData({ ...resumeData, education: list })
  }

  const updateEducation = (index, field, value) => {
    const list = [...(resumeData.education || [])]
    list[index] = { ...list[index], [field]: value }
    setResumeData({ ...resumeData, education: list })
  }

  const deleteEducation = (index) => {
    const list = (resumeData.education || []).filter((_, i) => i !== index)
    setResumeData({ ...resumeData, education: list })
  }

  // Projects array managers
  const addProject = () => {
    const list = [...(resumeData.projects || [])]
    list.push({
      id: 'proj-' + Date.now(),
      name: '',
      technologies: '',
      duration: '',
      link: '',
      description: ''
    })
    setResumeData({ ...resumeData, projects: list })
  }

  const updateProject = (index, field, value) => {
    const list = [...(resumeData.projects || [])]
    list[index] = { ...list[index], [field]: value }
    setResumeData({ ...resumeData, projects: list })
  }

  const deleteProject = (index) => {
    const list = (resumeData.projects || []).filter((_, i) => i !== index)
    setResumeData({ ...resumeData, projects: list })
  }

  const parseImprovedResume = (text) => {
    const cleaned = String(text || '').replace(/```json|```/g, '').trim()
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null
    }

    try {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
    } catch (e) {
      console.error('JSON parsing failed:', e)
      return null
    }
  }

  const callGeminiAPI = async (promptText) => {
    const rawKey = (apiKey || '').trim()
    if (!rawKey) {
      throw new Error('Gemini API key is required. Go to the "AI Tools" tab to enter it.')
    }

    // Support comma-separated multiple API keys for automatic rotation on quota errors
    const keys = rawKey.split(',').map(k => k.trim()).filter(Boolean)
    let lastError = null

    for (const activeApiKey of keys) {
      try {
        // AQ. keys = newer Google OAuth tokens → use Authorization: Bearer header
        // AIzaSy keys = classic API keys → use ?key= query param
        const isOAuthToken = activeApiKey.startsWith('AQ.')
        const url = isOAuthToken
          ? 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
          : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${activeApiKey}`
        const headers = {
          'Content-Type': 'application/json',
          ...(isOAuthToken ? { 'Authorization': `Bearer ${activeApiKey}` } : {})
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
        })

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}))
          const errMsg = errBody?.error?.message || 'AI service returned error status ' + response.status
          const isQuota = response.status === 429 || errMsg.toLowerCase().includes('quota')
          if (isQuota && keys.length > 1) {
            lastError = new Error(errMsg)
            continue
          }
          throw new Error(errMsg)
        }

        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) {
          throw new Error('No content response received from Gemini model.')
        }
        return text
      } catch (err) {
        const isQuota = err.message.toLowerCase().includes('quota') || err.message.includes('429')
        if (isQuota && keys.length > 1) {
          lastError = err
          continue
        }
        throw err
      }
    }

    throw lastError || new Error('All API keys exhausted or quota exceeded.')
  }


  // AI Summary Generator
  const generateAISummary = async () => {
    if (!resumeData.name && !resumeData.title && !resumeData.skills && (resumeData.experience || []).length === 0) {
      setStatusMessage('Please fill some profile details and skills so Gemini can customize your summary.')
      setStatusTone('warning')
      return
    }

    setAiActionLoading((prev) => ({ ...prev, summary: true }))
    setStatusMessage('Generating professional summary with Gemini...')
    setStatusTone('info')

    try {
      const expSummary = (resumeData.experience || [])
        .map((e) => `${e.role} at ${e.company}`)
        .join(', ')

      const tonePrompts = {
        corporate: 'Write in a highly professional, conservative, and polished executive tone suitable for corporate environments (e.g. finance, consulting, enterprise). Use traditional executive power verbs.',
        tech: 'Write in a direct, action-oriented, and tech-focused tone, highlighting technical competencies, engineering metrics, scale, and problem-solving skills.',
        creative: 'Write in a highly engaging, creative, and narrative tone, highlighting innovation, storytelling, passion, and unique career value.'
      }
      const toneInstruction = tonePrompts[aiTone] || tonePrompts.corporate

      const prompt = `You are a professional executive resume writer. Based on the details below, write a compelling, recruiter-friendly professional summary (around 3 to 4 sentences) for an ATS-optimized resume. 
${toneInstruction}
Keep it objective, impact-focused, and tailored to key industry strengths. Write in a confident tone, in the third-person or implied first-person (do not use pronouns like "I", "me", "my", "we").

Name: ${resumeData.name}
Target Title: ${resumeData.title}
Skills: ${resumeData.skills}
Work History Summary: ${expSummary || 'Entry Level / Student'}

Return ONLY the plain text summary. Do not put quote marks, markdown styling, or introductory words (like "Here is your summary").`

      const result = await callGeminiAPI(prompt)
      setResumeData({ ...resumeData, summary: result.trim() })
      setStatusMessage('Professional summary generated and saved successfully!')
      setStatusTone('success')
    } catch (error) {
      console.warn('AI Summary failed, using local fallback:', error.message)
      const fallback = localEnhanceSummary(resumeData.title, resumeData.skills)
      setResumeData({ ...resumeData, summary: fallback })
      setStatusMessage('Gemini key quota exceeded. Applied local smart ATS summary instead!')
      setStatusTone('warning')
    } finally {
      setAiActionLoading((prev) => ({ ...prev, summary: false }))
    }
  }

  // AI Polish Bullets (For work experience or projects)
  const polishBulletsWithAI = async (type, index) => {
    let originalText = ''
    let orgName = ''
    let titleRole = ''

    if (type === 'experience') {
      const item = resumeData.experience[index]
      originalText = item.description
      orgName = item.company
      titleRole = item.role
    } else {
      const item = resumeData.projects[index]
      originalText = item.description
      orgName = item.technologies
      titleRole = item.name
    }

    if (!originalText || !originalText.trim()) {
      setStatusMessage('Please write some details first so the AI has points to polish.')
      setStatusTone('warning')
      return
    }

    setAiActionLoading((prev) => {
      const copy = { ...prev }
      if (type === 'experience') {
        copy.experience = { ...copy.experience, [index]: true }
      } else {
        copy.projects = { ...copy.projects, [index]: true }
      }
      return copy
    })

    setStatusMessage('Polishing lines into action-verb ATS bullets...')
    setStatusTone('info')

    try {
      const bulletTonePrompts = {
        corporate: 'Use traditional executive power verbs (e.g. "Spearheaded", "Orchestrated", "Leveraged", "Formulated") and focus on bottom-line business value, cost reductions, and operational excellence.',
        tech: 'Use strong engineering and technical action verbs (e.g. "Architected", "Engineered", "Optimized", "Automated", "Scaled") and highlight tools, stack integration, metrics, scale, and performance gains.',
        creative: 'Use expressive, vision-oriented action verbs (e.g. "Designed", "Cultivated", "Pioneered", "Transformed", "Conceived") and focus on innovation, visual/experience style, design methodology, and human impact.'
      }
      const toneInstruction = bulletTonePrompts[aiTone] || bulletTonePrompts.corporate

      const prompt = `You are an expert resume reviewer and ATS optimizer. Rewrite the description below into strong, recruiter-ready, results-oriented bullet points.
${toneInstruction}
- Each bullet point must start with a powerful action verb.
- Focus on business value and metrics where possible (quantify results).
- Ensure each bullet point begins with a dash followed by a space ("- ").
- Do not use personal pronouns ("I", "we", "my").
- Do not use passive language (like "Responsible for").

Context: ${titleRole} | ${orgName}
Original description:
${originalText}

Return ONLY the polished bullet points starting with "- " on each line. Do not include markdown wraps, intro text, or explanation.`

      const result = await callGeminiAPI(prompt)
      const polished = toBulletList(result)

      if (type === 'experience') {
        updateExperience(index, 'description', polished)
      } else {
        updateProject(index, 'description', polished)
      }

      setStatusMessage('Bullets optimized and formatted successfully!')
      setStatusTone('success')
    } catch (error) {
      console.warn('AI Polish failed, using local fallback:', error.message)
      const polished = localEnhanceBulletPoints(originalText)
      if (type === 'experience') {
        updateExperience(index, 'description', polished)
      } else {
        updateProject(index, 'description', polished)
      }
      setStatusMessage('Gemini key quota exceeded. Applied local smart ATS bullet enhancement instead!')
      setStatusTone('warning')
    } finally {
      setAiActionLoading((prev) => {
        const copy = { ...prev }
        if (type === 'experience') {
          copy.experience = { ...copy.experience, [index]: false }
        } else {
          copy.projects = { ...copy.projects, [index]: false }
        }
        return copy
      })
    }
  }

  // AI Suggest Skills based on Experience & Projects
  const suggestSkillsWithAI = async () => {
    const expText = (resumeData.experience || []).map((e) => `${e.role} at ${e.company}: ${e.description}`).join('\n')
    const projText = (resumeData.projects || []).map((p) => `${p.name}: ${p.description}`).join('\n')

    if (!expText && !projText) {
      setStatusMessage('Please fill in some work experiences or projects first so AI can suggest matching skills.')
      setStatusTone('warning')
      return
    }

    setAiActionLoading((prev) => ({ ...prev, skills: true }))
    setStatusMessage('Analyzing profile details for relevant technical skills...')
    setStatusTone('info')

    try {
      const prompt = `Based on the following work experience and projects description, identify and recommend 15 to 20 highly relevant technical skills, frameworks, tools, or domain competencies that should be added to the resume's skills list to pass ATS screeners.
Format the output as a single comma-separated list of terms (e.g. "React, Next.js, Jest, Figma, CSS3").

Experience details:
${expText}

Project details:
${projText}

Return ONLY the plain text comma-separated list. No numbering, no bullets, no introduction, and no markdown formatting.`

      const result = await callGeminiAPI(prompt)
      const sanitizedSkills = result
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', ')

      setResumeData({ ...resumeData, skills: sanitizedSkills })
      setStatusMessage('Skills analyzed and suggested list updated!')
      setStatusTone('success')
    } catch (error) {
      console.warn('AI Skill Suggestion failed, using local fallback:', error.message)
      const keywordsList = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Docker', 'AWS', 'SQL', 'MongoDB', 'Git', 'Agile', 'CI/CD', 'REST APIs', 'UI/UX', 'Figma', 'Next.js', 'Redux', 'Jest']
      const matched = []
      const fullText = (expText + ' ' + projText).toLowerCase()
      keywordsList.forEach(kw => {
        if (fullText.includes(kw.toLowerCase())) {
          matched.push(kw)
        }
      })
      if (matched.length === 0) {
        matched.push('Problem Solving', 'Teamwork', 'Agile', 'Git', 'Communication', 'Technical Leadership')
      }
      
      const merged = Array.from(new Set([
        ...resumeData.skills.split(',').map(s => s.trim()).filter(Boolean),
        ...matched
      ])).join(', ')

      setResumeData({ ...resumeData, skills: merged })
      setStatusMessage('Gemini key quota exceeded. Suggested technical skills using local scanner!')
      setStatusTone('warning')
    } finally {
      setAiActionLoading((prev) => ({ ...prev, skills: false }))
    }
  }

  // Global Resume Enhancer
  const enhanceWholeResume = async () => {
    if (!apiKey || !apiKey.trim()) {
      setStatusMessage('Please enter a valid Gemini API key under AI Tools before optimizing the whole resume.')
      setStatusTone('warning')
      return
    }

    setLoading(true)
    setStatusMessage('Polishing and restructuring your entire resume with Gemini...')
    setStatusTone('info')

    try {
      const globalTonePrompts = {
        corporate: 'Format all text in a formal, highly professional executive corporate tone, focusing on business objectives and results.',
        tech: 'Format all text in a direct, high-impact technical tone, prioritizing technical metrics, technologies, and scalability.',
        creative: 'Format all text in an engaging, visionary, and modern storytelling tone, highlighting creativity and unique project values.'
      }
      const toneInstruction = globalTonePrompts[aiTone] || globalTonePrompts.corporate

      const prompt = `You are a premium resume writer. Polish, enhance, and structure the entire resume provided below.
Optimize every single description (summary, experiences, education details, projects, and skills) for extreme professional impact, alignment, and ATS parsing:
- Use the following style guideline: ${toneInstruction}
- Fix spelling, grammar, and typography.
- Standardize all experience and project bullet lists to start with "- " and use high-impact action verbs.
- Re-align sentences to focus on accomplishments rather than tasks.
- Keep the factual data (names, companies, degrees, dates, URLs) exactly the same, but improve the writing.

Input JSON:
${JSON.stringify({
  name: resumeData.name,
  title: resumeData.title,
  email: resumeData.email,
  phone: resumeData.phone,
  location: resumeData.location,
  linkedin: resumeData.linkedin,
  github: resumeData.github,
  website: resumeData.website,
  summary: resumeData.summary,
  experience: resumeData.experience,
  education: resumeData.education,
  projects: resumeData.projects,
  skills: resumeData.skills,
})}

Return ONLY a valid JSON object matching this structure (with keys: name, title, email, phone, location, linkedin, github, website, summary, experience, education, projects, skills). Preserve the structure of nested items and do not wrap in markdown \`\`\`json blocks.`

      const result = await callGeminiAPI(prompt)
      const improved = parseImprovedResume(result)

      if (!improved) {
        throw new Error('AI response could not be parsed as valid JSON.')
      }

      // Format bullets for experience and projects inside the returned object
      const formattedExperience = (improved.experience || []).map(item => ({
        ...item,
        description: toBulletList(item.description)
      }))

      const formattedProjects = (improved.projects || []).map(item => ({
        ...item,
        description: toBulletList(item.description)
      }))

      setResumeData({
        ...resumeData,
        name: improved.name || resumeData.name,
        title: improved.title || resumeData.title,
        email: improved.email || resumeData.email,
        phone: improved.phone || resumeData.phone,
        location: improved.location || resumeData.location,
        linkedin: improved.linkedin || resumeData.linkedin,
        github: improved.github || resumeData.github,
        website: improved.website || resumeData.website,
        summary: improved.summary || resumeData.summary,
        experience: formattedExperience,
        education: improved.education || resumeData.education,
        projects: formattedProjects,
        skills: improved.skills || resumeData.skills,
      })

      setStatusMessage('Resume fully polished, structured, and synced with live preview!')
      setStatusTone('success')
    } catch (error) {
      console.warn('Global AI enhancement failed, using local fallback:', error.message)
      
      const localExperience = (resumeData.experience || []).map(exp => ({
        ...exp,
        description: localEnhanceBulletPoints(exp.description)
      }))

      const localProjects = (resumeData.projects || []).map(proj => ({
        ...proj,
        description: localEnhanceBulletPoints(proj.description)
      }))

      const localSummaryText = resumeData.summary || localEnhanceSummary(resumeData.title, resumeData.skills)

      setResumeData({
        ...resumeData,
        summary: localSummaryText,
        experience: localExperience,
        projects: localProjects
      })

      setStatusMessage('Gemini key quota exceeded. Applied local smart ATS optimization instead!')
      setStatusTone('warning')
    } finally {
      setLoading(false)
    }
  }

  // Notify parent component of loading changes
  useEffect(() => {
    if (setGlobalLoading) {
      setGlobalLoading(loading)
    }
  }, [loading, setGlobalLoading])

  // Register the global enhance function with the parent component
  useEffect(() => {
    if (setEnhanceAction) {
      setEnhanceAction(() => enhanceWholeResume)
    }
  }, [resumeData, apiKey, setEnhanceAction])


  const renderStepContent = () => {
    switch (activeStep) {
      case 'profile':
        return (
          <div className="form-grid">
            <div className="form-group">
              <label>👤 Full Name</label>
              <input name="name" value={resumeData.name || ''} onChange={handleChange} placeholder="e.g. Aisha Patel" />
            </div>
            <div className="form-group">
              <label>💼 Target Job Title</label>
              <input name="title" value={resumeData.title || ''} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div className="form-group">
              <label>✉️ Email Address</label>
              <input name="email" type="email" value={resumeData.email || ''} onChange={handleChange} placeholder="hello@email.com" />
            </div>
            <div className="form-group">
              <label>📱 Phone Number</label>
              <input 
                name="phone" 
                type="tel" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                value={resumeData.phone || ''} 
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setResumeData({ ...resumeData, phone: val })
                }} 
                placeholder="9876543210" 
              />
            </div>
            <div className="form-group">
              <label>📍 Location</label>
              <input name="location" value={resumeData.location || ''} onChange={handleChange} placeholder="City, Country" />
            </div>
            <div className="form-group">
              <label>🔗 LinkedIn Link</label>
              <input 
                name="linkedin" 
                type="url"
                value={resumeData.linkedin || ''} 
                onChange={handleChange} 
                placeholder="https://www.linkedin.com/in/username" 
                style={{
                  borderColor: resumeData.linkedin && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(resumeData.linkedin) ? '#ef4444' : ''
                }}
              />
              {resumeData.linkedin && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(resumeData.linkedin) && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                  Please enter a valid LinkedIn URL (e.g. https://www.linkedin.com/in/username). Invalid links won't show on the resume.
                </small>
              )}
            </div>
            <div className="form-group">
              <label>💻 GitHub Profile</label>
              <input 
                name="github" 
                type="url"
                value={resumeData.github || ''} 
                onChange={handleChange} 
                placeholder="https://github.com/username" 
                style={{
                  borderColor: resumeData.github && !/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i.test(resumeData.github) ? '#ef4444' : ''
                }}
              />
              {resumeData.github && !/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i.test(resumeData.github) && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                  Please enter a valid GitHub URL (e.g. https://github.com/username). Invalid links won't show on the resume.
                </small>
              )}
            </div>
            <div className="form-group">
              <label>🌐 Portfolio / Website</label>
              <input 
                name="website" 
                type="url"
                value={resumeData.website || ''} 
                onChange={handleChange} 
                placeholder="https://username.dev" 
                style={{
                  borderColor: resumeData.website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(resumeData.website) ? '#ef4444' : ''
                }}
              />
              {resumeData.website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i.test(resumeData.website) && (
                <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                  Please enter a valid URL (e.g. https://username.dev). Invalid links won't show on the resume.
                </small>
              )}
            </div>
            <div className="form-group full-width">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>📝 Professional Summary</label>
                <button
                  type="button"
                  className="ai-mini-btn"
                  onClick={generateAISummary}
                  disabled={aiActionLoading.summary}
                >
                  {aiActionLoading.summary ? '⏳ Generating...' : '✨ Write with Gemini'}
                </button>
              </div>
              <textarea
                name="summary"
                value={resumeData.summary || ''}
                onChange={handleChange}
                rows={4}
                placeholder="Summarize your experience, technical strengths, and core career direction."
              />
            </div>
          </div>
        )
      case 'experience':
        return (
          <div className="list-items-container">
            {(resumeData.experience || []).map((exp, index) => (
              <div key={exp.id || index} className="item-card">
                <div className="item-header-row">
                  <span className="item-title">💼 Position #{index + 1}</span>
                  <div className="item-actions">
                    <button type="button" className="delete-btn" onClick={() => deleteExperience(index)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company / Organization</label>
                    <input
                      value={exp.company || ''}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="e.g. BrightLabs Tech"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role / Job Title</label>
                    <input
                      value={exp.role || ''}
                      onChange={(e) => updateExperience(index, 'role', e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      value={exp.location || ''}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      placeholder="e.g. Bengaluru, India"
                    />
                  </div>
                  <div className="form-group">
                    <label>Dates / Duration</label>
                    <div className="date-input-wrapper">
                      <input
                        value={exp.duration || ''}
                        readOnly
                        placeholder="Click to select dates..."
                        onClick={() => openDatePicker('experience', index, exp.duration)}
                      />
                      <button 
                        type="button" 
                        className="calendar-btn"
                        onClick={() => openDatePicker('experience', index, exp.duration)}
                        title="Open date picker calendar"
                      >
                        📅
                      </button>
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Role Description & Key Accomplishments</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="ai-mini-btn"
                          style={{ background: 'rgba(255,255,255,0.03)', color: '#d1d5db', borderColor: 'rgba(255,255,255,0.08)' }}
                          onClick={() => updateExperience(index, 'description', toBulletList(exp.description))}
                        >
                          Format Bullets
                        </button>
                        <button
                          type="button"
                          className="ai-mini-btn"
                          onClick={() => polishBulletsWithAI('experience', index)}
                          disabled={aiActionLoading.experience[index]}
                        >
                          {aiActionLoading.experience[index] ? '⏳ Polishing...' : '✨ Gemini Polish'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={5}
                      placeholder="Start typing your accomplishments. Use bullet points starting with - to structure them."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addExperience}>
              ➕ Add Work Experience
            </button>
          </div>
        )
      case 'education':
        return (
          <div className="list-items-container">
            {(resumeData.education || []).map((edu, index) => (
              <div key={edu.id || index} className="item-card">
                <div className="item-header-row">
                  <span className="item-title">🎓 Education #{index + 1}</span>
                  <div className="item-actions">
                    <button type="button" className="delete-btn" onClick={() => deleteEducation(index)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Institution / School</label>
                    <input
                      value={edu.school || ''}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      placeholder="e.g. IIT Delhi"
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree / Qualification</label>
                    <input
                      value={edu.degree || ''}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="e.g. B.Tech in Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      value={edu.location || ''}
                      onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      placeholder="e.g. New Delhi, India"
                    />
                  </div>
                  <div className="form-group">
                    <label>Dates / Graduation Year</label>
                    <div className="date-input-wrapper">
                      <input
                        value={edu.duration || ''}
                        readOnly
                        placeholder="Click to select year..."
                        onClick={() => openDatePicker('education', index, edu.duration)}
                      />
                      <button 
                        type="button" 
                        className="calendar-btn"
                        onClick={() => openDatePicker('education', index, edu.duration)}
                        title="Open date picker calendar"
                      >
                        📅
                      </button>
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>GPA / Honors / Key Coursework Details</label>
                    <textarea
                      value={edu.details || ''}
                      onChange={(e) => updateEducation(index, 'details', e.target.value)}
                      rows={3}
                      placeholder="e.g. GPA: 8.7/10.0. Focus areas: Advanced Algorithms, Web Engineering."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addEducation}>
              ➕ Add Education Entry
            </button>
          </div>
        )
      case 'projects':
        return (
          <div className="list-items-container">
            {(resumeData.projects || []).map((proj, index) => (
              <div key={proj.id || index} className="item-card">
                <div className="item-header-row">
                  <span className="item-title">💻 Project #{index + 1}</span>
                  <div className="item-actions">
                    <button type="button" className="delete-btn" onClick={() => deleteProject(index)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      value={proj.name || ''}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      placeholder="e.g. DevSync Collaborative Editor"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tech Stack / Technologies Used</label>
                    <input
                      value={proj.technologies || ''}
                      onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                      placeholder="e.g. React, Node.js, WebSockets, Redis"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration / Completion Date</label>
                    <div className="date-input-wrapper">
                      <input
                        value={proj.duration || ''}
                        readOnly
                        placeholder="Click to select date..."
                        onClick={() => openDatePicker('projects', index, proj.duration)}
                      />
                      <button 
                        type="button" 
                        className="calendar-btn"
                        onClick={() => openDatePicker('projects', index, proj.duration)}
                        title="Open date picker calendar"
                      >
                        📅
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Project Link / Link URL</label>
                    <input
                      value={proj.link || ''}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      placeholder="github.com/username/project"
                    />
                  </div>
                  <div className="form-group full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Project Description & Core Functions</label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="ai-mini-btn"
                          style={{ background: 'rgba(255,255,255,0.03)', color: '#d1d5db', borderColor: 'rgba(255,255,255,0.08)' }}
                          onClick={() => updateProject(index, 'description', toBulletList(proj.description))}
                        >
                          Format Bullets
                        </button>
                        <button
                          type="button"
                          className="ai-mini-btn"
                          onClick={() => polishBulletsWithAI('projects', index)}
                          disabled={aiActionLoading.projects[index]}
                        >
                          {aiActionLoading.projects[index] ? '⏳ Polishing...' : '✨ Gemini Polish'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={proj.description || ''}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      rows={4}
                      placeholder="Detail what you built, what challenge it solved, and the key technology features."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addProject}>
              ➕ Add Project
            </button>
          </div>
        )
      case 'skills':
        return (
          <div className="form-group full-width">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label>🛠️ Skills (Comma separated)</label>
              <button
                type="button"
                className="ai-mini-btn"
                onClick={suggestSkillsWithAI}
                disabled={aiActionLoading.skills}
              >
                {aiActionLoading.skills ? '⏳ Analyzing...' : '✨ Suggest skills from history'}
              </button>
            </div>
            <textarea
              name="skills"
              value={resumeData.skills || ''}
              onChange={handleChange}
              rows={5}
              placeholder="e.g. React, Node.js, UI/UX, TypeScript, Figma, Jest, Agile Development"
            />
            <small style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '0.4rem', display: 'block' }}>
              Add keywords relevant to the position to pass ATS systems.
            </small>
          </div>
        )
      case 'ai':
        return (
          <div className="ai-card">
            <h3>✨ Gemini AI Assistant Workspace</h3>
            <p>
              Elevate your draft resume into a professional, ATS-optimized portfolio using Google Gemini. 
              Our smart checks will refine sentence structure, fix typography, and optimize action-verbs.
            </p>
            <div className="tone-select-group">
              <label htmlFor="gemini-tone">🎯 Selected AI Enhancer Tone</label>
              <select
                id="gemini-tone"
                className="tone-select"
                value={aiTone}
                onChange={handleToneChange}
              >
                <option value="corporate">Corporate & Conservative (finance, consulting, corporate)</option>
                <option value="tech">Tech & Direct (software, engineering, metrics-driven)</option>
                <option value="creative">Creative & Narrative (startups, design, marketing)</option>
              </select>
            </div>
            <div className="api-key-card">
              <label htmlFor="gemini-key">🔑 Gemini API Key(s)</label>
              <input
                id="gemini-key"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="AIzaSy... (paste multiple keys separated by commas for auto-rotation)"
              />
              <small>
                Key(s) are saved locally in your browser — never sent to any server except Google.
                Get a free key at{' '}
                <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>
                  Google AI Studio
                </a>.
                {' '}💡 <strong>Tip:</strong> Paste multiple comma-separated keys (e.g. <em>key1,key2,key3</em>) — when one hits quota the next is used automatically.
              </small>
            </div>
            <button className="ai-btn" onClick={enhanceWholeResume} disabled={loading || !apiKey.trim()}>
              {loading ? '⏳ Analyzing & Polishing entire resume...' : '✨ Enhance entire Resume with Gemini'}
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="form-container">
      <div className="form-heading-row">
        <div>
          <h2>✍️ Build your Profile</h2>
          <p>Guided, ATS-optimized builder updates your resume paper in real-time.</p>
        </div>
        <div className="theme-switcher">
          <button className={`chip ${theme === 'modern' ? 'active' : ''}`} onClick={() => setTheme('modern')}>
            Modern
          </button>
          <button className={`chip ${theme === 'classic' ? 'active' : ''}`} onClick={() => setTheme('classic')}>
            ATS Classic
          </button>
          <button className={`chip ${theme === 'minimalist' ? 'active' : ''}`} onClick={() => setTheme('minimalist')}>
            Minimalist
          </button>
        </div>
      </div>

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

      <div className="section-nav">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            className={`section-btn ${activeStep === step.id ? 'active' : ''}`}
            onClick={() => setActiveStep(step.id)}
          >
            <span>{step.title}</span>
            <small>{step.subtitle}</small>
          </button>
        ))}
      </div>

      {statusMessage ? (
        <div className={`status-pill ${statusTone}`}>
          <span>{statusTone === 'success' ? '✅' : statusTone === 'warning' ? '⚠️' : 'ℹ️'}</span>
          <span>{statusMessage}</span>
        </div>
      ) : null}

      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>{currentStep.title}</h3>
            <p>{currentStep.subtitle}</p>
          </div>
          <span className="step-count">
            {currentStepIndex + 1}/{steps.length}
          </span>
        </div>

        {renderStepContent()}
      </div>

      <div className="wizard-actions">
        <button className="ghost-btn" type="button" onClick={goBack} disabled={currentStepIndex === 0}>
          ← Back
        </button>
        <div className="wizard-actions-right">
          <button className="ghost-btn" type="button" onClick={fillSampleData}>
            ✨ Quick Fill Sample
          </button>
          <button className="ghost-btn" type="button" onClick={resetForm}>
            Reset Form
          </button>
          {currentStep.id !== 'ai' && (
            <button className="primary-btn" type="button" onClick={goNext}>
              Continue →
            </button>
          )}
        </div>
      </div>

      {activeDatePicker && (
        <div className="date-picker-modal">
          <div className="date-picker-content">
            <h4>📅 Select Dates / Duration</h4>
            
            <div className="date-picker-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={isYearOnly} 
                  onChange={(e) => setIsYearOnly(e.target.checked)} 
                />
                Year Only (e.g. for Education)
              </label>
            </div>

            <div className="date-picker-row">
              <div className="date-picker-col">
                <label>Start Date</label>
                <div className="date-picker-selects">
                  {!isYearOnly && (
                    <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  )}
                  <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="date-picker-col">
                <label>End Date</label>
                {!isPresent ? (
                  <div className="date-picker-selects">
                    {!isYearOnly && (
                      <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    )}
                    <select value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="present-label">Present</div>
                )}
              </div>
            </div>

            {!isYearOnly && (
              <div className="date-picker-present-container">
                <label className="present-checkbox">
                  <input 
                    type="checkbox" 
                    checked={isPresent} 
                    onChange={(e) => setIsPresent(e.target.checked)} 
                  />
                  I currently work/study here (Present)
                </label>
              </div>
            )}

            {isInvalidDateRange && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
                ⚠️ Start date cannot be after the end date.
              </div>
            )}

            <div className="date-picker-actions">
              <div style={{ marginRight: 'auto' }}>
                <button 
                  type="button" 
                  className="ghost-btn" 
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '0.55rem 1rem' }}
                  onClick={clearSelectedDate}
                >
                  Clear
                </button>
              </div>
              <button 
                type="button" 
                className="ghost-btn" 
                onClick={() => setActiveDatePicker(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="primary-btn" 
                onClick={applySelectedDate}
                disabled={isInvalidDateRange}
                style={{
                  opacity: isInvalidDateRange ? 0.4 : 1,
                  cursor: isInvalidDateRange ? 'not-allowed' : 'pointer'
                }}
              >
                Set Date
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ResumeForm
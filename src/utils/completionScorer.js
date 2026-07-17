export const calculateCompletionScore = (resumeData) => {
  if (!resumeData) return 0
  let score = 0

  // 1. Personal Info (Max 20%): 5 fields, 4% each
  const personalFields = ['name', 'title', 'email', 'phone', 'location']
  personalFields.forEach((field) => {
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
  const hasExperience = (resumeData.experience || []).some((exp) => {
    const { id, ...rest } = exp
    void id
    return Object.values(rest).some((val) => String(val || '').trim().length > 0)
  })
  if (hasExperience) {
    score += 25
  }

  // 5. Projects (Max 15%)
  const hasProjects = (resumeData.projects || []).some((proj) => {
    const { id, ...rest } = proj
    void id
    return Object.values(rest).some((val) => String(val || '').trim().length > 0)
  })
  if (hasProjects) {
    score += 15
  }

  // 6. Education (Max 15%)
  const hasEducation = (resumeData.education || []).some((edu) => {
    const { id, ...rest } = edu
    void id
    return Object.values(rest).some((val) => String(val || '').trim().length > 0)
  })
  if (hasEducation) {
    score += 15
  }

  return score
}

export const getChecklistItems = (resumeData) => {
  if (!resumeData) return []
  const { name, title, email, phone, location, summary, skills, experience = [], projects = [], education = [] } = resumeData

  return [
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
      isFilled: (experience || []).some((exp) => {
        const { id, ...rest } = exp
        void id
        return Object.values(rest).some((val) => String(val || '').trim().length > 0)
      }),
    },
    {
      key: 'projects',
      label: 'Personal Projects (1+)',
      isFilled: (projects || []).some((proj) => {
        const { id, ...rest } = proj
        void id
        return Object.values(rest).some((val) => String(val || '').trim().length > 0)
      }),
    },
    {
      key: 'education',
      label: 'Education Details (1+)',
      isFilled: (education || []).some((edu) => {
        const { id, ...rest } = edu
        void id
        return Object.values(rest).some((val) => String(val || '').trim().length > 0)
      }),
    },
  ]
}

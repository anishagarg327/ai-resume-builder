import { useCallback } from 'react'
import { emptyResumeData } from '../constants/initialData'
import { sampleResumeData } from '../constants/sampleData'

export const useResumeData = ({ setResumeData, setActiveStep, setStatusMessage, setStatusTone }) => {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setResumeData((prev) => ({ ...prev, [name]: value }))
  }, [setResumeData])

  const fillSampleData = useCallback(() => {
    setResumeData(JSON.parse(JSON.stringify(sampleResumeData)))
    setActiveStep('profile')
    setStatusMessage('A polished, professional sample has been loaded. Check the live preview!')
    setStatusTone('success')
  }, [setResumeData, setActiveStep, setStatusMessage, setStatusTone])

  const resetForm = useCallback(() => {
    setResumeData(JSON.parse(JSON.stringify(emptyResumeData)))
    setActiveStep('profile')
    setStatusMessage('Form reset. Ready for your data.')
    setStatusTone('info')
  }, [setResumeData, setActiveStep, setStatusMessage, setStatusTone])

  // Experience handlers
  const addExperience = useCallback(() => {
    setResumeData((prev) => {
      const list = [...(prev.experience || [])]
      list.push({
        id: 'exp-' + Date.now(),
        company: '',
        role: '',
        location: '',
        duration: '',
        description: '',
      })
      return { ...prev, experience: list }
    })
  }, [setResumeData])

  const updateExperience = useCallback((index, field, value) => {
    setResumeData((prev) => {
      const list = [...(prev.experience || [])]
      if (!list[index]) return prev
      list[index] = { ...list[index], [field]: value }
      return { ...prev, experience: list }
    })
  }, [setResumeData])

  const deleteExperience = useCallback((index) => {
    setResumeData((prev) => {
      const list = (prev.experience || []).filter((_, i) => i !== index)
      return { ...prev, experience: list }
    })
  }, [setResumeData])

  // Education handlers
  const addEducation = useCallback(() => {
    setResumeData((prev) => {
      const list = [...(prev.education || [])]
      list.push({
        id: 'edu-' + Date.now(),
        school: '',
        degree: '',
        location: '',
        duration: '',
        details: '',
      })
      return { ...prev, education: list }
    })
  }, [setResumeData])

  const updateEducation = useCallback((index, field, value) => {
    setResumeData((prev) => {
      const list = [...(prev.education || [])]
      if (!list[index]) return prev
      list[index] = { ...list[index], [field]: value }
      return { ...prev, education: list }
    })
  }, [setResumeData])

  const deleteEducation = useCallback((index) => {
    setResumeData((prev) => {
      const list = (prev.education || []).filter((_, i) => i !== index)
      return { ...prev, education: list }
    })
  }, [setResumeData])

  // Project handlers
  const addProject = useCallback(() => {
    setResumeData((prev) => {
      const list = [...(prev.projects || [])]
      list.push({
        id: 'proj-' + Date.now(),
        name: '',
        technologies: '',
        duration: '',
        link: '',
        description: '',
      })
      return { ...prev, projects: list }
    })
  }, [setResumeData])

  const updateProject = useCallback((index, field, value) => {
    setResumeData((prev) => {
      const list = [...(prev.projects || [])]
      if (!list[index]) return prev
      list[index] = { ...list[index], [field]: value }
      return { ...prev, projects: list }
    })
  }, [setResumeData])

  const deleteProject = useCallback((index) => {
    setResumeData((prev) => {
      const list = (prev.projects || []).filter((_, i) => i !== index)
      return { ...prev, projects: list }
    })
  }, [setResumeData])

  return {
    handleChange,
    fillSampleData,
    resetForm,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
  }
}

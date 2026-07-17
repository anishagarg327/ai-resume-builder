import { useState, useEffect } from 'react'
import { DEFAULT_GEMINI_API_KEY } from '../constants/config'
import { FORM_STEPS } from '../constants/steps'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useCompletion } from '../hooks/useCompletion'
import { useDatePicker } from '../hooks/useDatePicker'
import { useAIAssistant } from '../hooks/useAIAssistant'
import { useResumeData } from '../hooks/useResumeData'

import { FormHeader } from './common/FormHeader'
import { ProgressCard } from './common/ProgressCard'
import { SectionNav } from './common/SectionNav'
import { StatusPill } from './common/StatusPill'
import { SectionCardHeader } from './common/SectionCardHeader'
import { WizardActions } from './common/WizardActions'
import { DatePickerModal } from './common/DatePickerModal'

import { ProfileStep } from './form/ProfileStep'
import { ExperienceStep } from './form/ExperienceStep'
import { EducationStep } from './form/EducationStep'
import { ProjectsStep } from './form/ProjectsStep'
import { SkillsStep } from './form/SkillsStep'
import { AIToolsStep } from './form/AIToolsStep'

function ResumeForm({ resumeData, setResumeData, theme, setTheme, setEnhanceAction, setGlobalLoading }) {
  const [activeStep, setActiveStep] = useState('profile')
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState('info')

  const [aiTone, setAiTone] = useLocalStorage('gemini_ai_tone', 'corporate')
  const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', () => {
    const stored = window.localStorage.getItem('gemini_api_key')
    if (stored && stored.trim() !== '') {
      return stored
    }
    return import.meta.env.VITE_GEMINI_API_KEY?.trim() || DEFAULT_GEMINI_API_KEY
  })

  const { completion } = useCompletion(resumeData)

  const {
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
  } = useResumeData({
    resumeData,
    setResumeData,
    setActiveStep,
    setStatusMessage,
    setStatusTone,
  })

  const datePicker = useDatePicker({
    updateExperience,
    updateEducation,
    updateProject,
  })

  const {
    loading,
    aiActionLoading,
    generateAISummary,
    polishBulletsWithAI,
    suggestSkillsWithAI,
    enhanceWholeResume,
  } = useAIAssistant({
    resumeData,
    setResumeData,
    updateExperience,
    updateProject,
    aiTone,
    apiKey,
    setStatusMessage,
    setStatusTone,
    setGlobalLoading,
  })

  // Register the global enhance function with the parent component
  useEffect(() => {
    if (setEnhanceAction) {
      setEnhanceAction(() => enhanceWholeResume)
    }
  }, [enhanceWholeResume, setEnhanceAction])

  const currentStepIndex = FORM_STEPS.findIndex((step) => step.id === activeStep)
  const currentStep = FORM_STEPS[currentStepIndex] || FORM_STEPS[0]

  const handleToneChange = (e) => {
    setAiTone(e.target.value)
  }

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value)
  }

  const goNext = () => {
    if (currentStepIndex < FORM_STEPS.length - 1) {
      setActiveStep(FORM_STEPS[currentStepIndex + 1].id)
    }
  }

  const goBack = () => {
    if (currentStepIndex > 0) {
      setActiveStep(FORM_STEPS[currentStepIndex - 1].id)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 'profile':
        return (
          <ProfileStep
            resumeData={resumeData}
            handleChange={handleChange}
            setResumeData={setResumeData}
            generateAISummary={generateAISummary}
            aiSummaryLoading={aiActionLoading.summary}
          />
        )
      case 'experience':
        return (
          <ExperienceStep
            experience={resumeData.experience}
            addExperience={addExperience}
            updateExperience={updateExperience}
            deleteExperience={deleteExperience}
            openDatePicker={datePicker.openDatePicker}
            polishBulletsWithAI={polishBulletsWithAI}
            aiActionLoading={aiActionLoading.experience}
          />
        )
      case 'education':
        return (
          <EducationStep
            education={resumeData.education}
            addEducation={addEducation}
            updateEducation={updateEducation}
            deleteEducation={deleteEducation}
            openDatePicker={datePicker.openDatePicker}
          />
        )
      case 'projects':
        return (
          <ProjectsStep
            projects={resumeData.projects}
            addProject={addProject}
            updateProject={updateProject}
            deleteProject={deleteProject}
            openDatePicker={datePicker.openDatePicker}
            polishBulletsWithAI={polishBulletsWithAI}
            aiActionLoading={aiActionLoading.projects}
          />
        )
      case 'skills':
        return (
          <SkillsStep
            resumeData={resumeData}
            handleChange={handleChange}
            suggestSkillsWithAI={suggestSkillsWithAI}
            aiSkillsLoading={aiActionLoading.skills}
          />
        )
      case 'ai':
        return (
          <AIToolsStep
            aiTone={aiTone}
            handleToneChange={handleToneChange}
            apiKey={apiKey}
            handleApiKeyChange={handleApiKeyChange}
            enhanceWholeResume={enhanceWholeResume}
            loading={loading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="form-container">
      <FormHeader theme={theme} setTheme={setTheme} />

      <ProgressCard completion={completion} />

      <SectionNav activeStep={activeStep} setActiveStep={setActiveStep} />

      <StatusPill statusMessage={statusMessage} statusTone={statusTone} />

      <div className="section-card">
        <SectionCardHeader
          title={currentStep.title}
          subtitle={currentStep.subtitle}
          currentStepIndex={currentStepIndex}
          totalSteps={FORM_STEPS.length}
        />

        {renderStepContent()}
      </div>

      <WizardActions
        goBack={goBack}
        goNext={goNext}
        fillSampleData={fillSampleData}
        resetForm={resetForm}
        currentStepIndex={currentStepIndex}
        isAIStep={currentStep.id === 'ai'}
      />

      <DatePickerModal
        activeDatePicker={datePicker.activeDatePicker}
        setActiveDatePicker={datePicker.setActiveDatePicker}
        startMonth={datePicker.startMonth}
        setStartMonth={datePicker.setStartMonth}
        startYear={datePicker.startYear}
        setStartYear={datePicker.setStartYear}
        endMonth={datePicker.endMonth}
        setEndMonth={datePicker.setEndMonth}
        endYear={datePicker.endYear}
        setEndYear={datePicker.setEndYear}
        isPresent={datePicker.isPresent}
        setIsPresent={datePicker.setIsPresent}
        isYearOnly={datePicker.isYearOnly}
        setIsYearOnly={datePicker.setIsYearOnly}
        applySelectedDate={datePicker.applySelectedDate}
        clearSelectedDate={datePicker.clearSelectedDate}
        isInvalidDateRange={datePicker.isInvalidDateRange}
      />
    </div>
  )
}

export default ResumeForm
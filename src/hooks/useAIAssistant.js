import { useState, useCallback } from 'react'
import { callGeminiAPI } from '../services/geminiService'
import { SUMMARY_TONE_PROMPTS, BULLET_TONE_PROMPTS, GLOBAL_TONE_PROMPTS } from '../constants/config'
import { localEnhanceSummary, localEnhanceBulletPoints } from '../utils/localEnhancers'
import { toBulletList, parseImprovedResume } from '../utils/formatters'

export const useAIAssistant = ({
  resumeData,
  setResumeData,
  updateExperience,
  updateProject,
  aiTone,
  apiKey,
  setStatusMessage,
  setStatusTone,
  setGlobalLoading,
}) => {
  const [loading, setLoading] = useState(false)
  const [aiActionLoading, setAiActionLoading] = useState({
    summary: false,
    skills: false,
    experience: {},
    projects: {},
    global: false,
  })

  const generateAISummary = useCallback(async () => {
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

      const toneInstruction = SUMMARY_TONE_PROMPTS[aiTone] || SUMMARY_TONE_PROMPTS.corporate

      const prompt = `You are a professional executive resume writer. Based on the details below, write a compelling, recruiter-friendly professional summary (around 3 to 4 sentences) for an ATS-optimized resume. 
${toneInstruction}
Keep it objective, impact-focused, and tailored to key industry strengths. Write in a confident tone, in the third-person or implied first-person (do not use pronouns like "I", "me", "my", "we").

Name: ${resumeData.name}
Target Title: ${resumeData.title}
Skills: ${resumeData.skills}
Work History Summary: ${expSummary || 'Entry Level / Student'}

Return ONLY the plain text summary. Do not put quote marks, markdown styling, or introductory words (like "Here is your summary").`

      const result = await callGeminiAPI(prompt, apiKey)
      setResumeData((prev) => ({ ...prev, summary: result.trim() }))
      setStatusMessage('Professional summary generated and saved successfully!')
      setStatusTone('success')
    } catch (error) {
      console.warn('AI Summary failed, using local fallback:', error.message)
      const fallback = localEnhanceSummary(resumeData.title, resumeData.skills)
      setResumeData((prev) => ({ ...prev, summary: fallback }))
      setStatusMessage('Gemini key quota exceeded. Applied local smart ATS summary instead!')
      setStatusTone('warning')
    } finally {
      setAiActionLoading((prev) => ({ ...prev, summary: false }))
    }
  }, [resumeData.name, resumeData.title, resumeData.skills, resumeData.experience, aiTone, apiKey, setStatusMessage, setStatusTone, setResumeData])

  const polishBulletsWithAI = useCallback(async (type, index) => {
    const item = type === 'experience'
      ? (resumeData.experience || [])[index]
      : (resumeData.projects || [])[index]
    if (!item) return

    const originalText = item.description || ''
    const orgName = type === 'experience' ? item.company : item.technologies
    const titleRole = type === 'experience' ? item.role : item.name

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
      const toneInstruction = BULLET_TONE_PROMPTS[aiTone] || BULLET_TONE_PROMPTS.corporate

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

      const result = await callGeminiAPI(prompt, apiKey)
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
  }, [resumeData.experience, resumeData.projects, aiTone, apiKey, setStatusMessage, setStatusTone, updateExperience, updateProject])

  const suggestSkillsWithAI = useCallback(async () => {
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

      const result = await callGeminiAPI(prompt, apiKey)
      const sanitizedSkills = result
        .split(/[,\n]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .join(', ')

      setResumeData((prev) => ({ ...prev, skills: sanitizedSkills }))
      setStatusMessage('Skills analyzed and suggested list updated!')
      setStatusTone('success')
    } catch (error) {
      console.warn('AI Skill Suggestion failed, using local fallback:', error.message)
      const keywordsList = ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Docker', 'AWS', 'SQL', 'MongoDB', 'Git', 'Agile', 'CI/CD', 'REST APIs', 'UI/UX', 'Figma', 'Next.js', 'Redux', 'Jest']
      const matched = []
      const fullText = (expText + ' ' + projText).toLowerCase()
      keywordsList.forEach((kw) => {
        if (fullText.includes(kw.toLowerCase())) {
          matched.push(kw)
        }
      })
      if (matched.length === 0) {
        matched.push('Problem Solving', 'Teamwork', 'Agile', 'Git', 'Communication', 'Technical Leadership')
      }

      const merged = Array.from(new Set([
        ...resumeData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        ...matched,
      ])).join(', ')

      setResumeData((prev) => ({ ...prev, skills: merged }))
      setStatusMessage('Gemini key quota exceeded. Suggested technical skills using local scanner!')
      setStatusTone('warning')
    } finally {
      setAiActionLoading((prev) => ({ ...prev, skills: false }))
    }
  }, [resumeData.experience, resumeData.projects, resumeData.skills, apiKey, setStatusMessage, setStatusTone, setResumeData])

  const enhanceWholeResume = useCallback(async () => {
    if (!apiKey || !apiKey.trim()) {
      setStatusMessage('Please enter a valid Gemini API key under AI Tools before optimizing the whole resume.')
      setStatusTone('warning')
      return
    }

    setLoading(true)
    if (setGlobalLoading) setGlobalLoading(true)
    setStatusMessage('Polishing and restructuring your entire resume with Gemini...')
    setStatusTone('info')

    try {
      const toneInstruction = GLOBAL_TONE_PROMPTS[aiTone] || GLOBAL_TONE_PROMPTS.corporate

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

      const result = await callGeminiAPI(prompt, apiKey)
      const improved = parseImprovedResume(result)

      if (!improved) {
        throw new Error('AI response could not be parsed as valid JSON.')
      }

      const formattedExperience = (improved.experience || []).map((item) => ({
        ...item,
        description: toBulletList(item.description),
      }))

      const formattedProjects = (improved.projects || []).map((item) => ({
        ...item,
        description: toBulletList(item.description),
      }))

      setResumeData((prev) => ({
        ...prev,
        name: improved.name || prev.name,
        title: improved.title || prev.title,
        email: improved.email || prev.email,
        phone: improved.phone || prev.phone,
        location: improved.location || prev.location,
        linkedin: improved.linkedin || prev.linkedin,
        github: improved.github || prev.github,
        website: improved.website || prev.website,
        summary: improved.summary || prev.summary,
        experience: formattedExperience,
        education: improved.education || prev.education,
        projects: formattedProjects,
        skills: improved.skills || prev.skills,
      }))

      setStatusMessage('Resume fully polished, structured, and synced with live preview!')
      setStatusTone('success')
    } catch (error) {
      console.warn('Global AI enhancement failed, using local fallback:', error.message)

      const localExperience = (resumeData.experience || []).map((exp) => ({
        ...exp,
        description: localEnhanceBulletPoints(exp.description),
      }))

      const localProjects = (resumeData.projects || []).map((proj) => ({
        ...proj,
        description: localEnhanceBulletPoints(proj.description),
      }))

      const localSummaryText = resumeData.summary || localEnhanceSummary(resumeData.title, resumeData.skills)

      setResumeData((prev) => ({
        ...prev,
        summary: localSummaryText,
        experience: localExperience,
        projects: localProjects,
      }))

      setStatusMessage('Gemini key quota exceeded. Applied local smart ATS optimization instead!')
      setStatusTone('warning')
    } finally {
      setLoading(false)
      if (setGlobalLoading) setGlobalLoading(false)
    }
  }, [apiKey, setStatusMessage, setStatusTone, aiTone, resumeData, setResumeData, setGlobalLoading])

  return {
    loading,
    aiActionLoading,
    generateAISummary,
    polishBulletsWithAI,
    suggestSkillsWithAI,
    enhanceWholeResume,
  }
}

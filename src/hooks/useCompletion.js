import { useMemo } from 'react'
import { calculateCompletionScore, getChecklistItems } from '../utils/completionScorer'

export const useCompletion = (resumeData) => {
  const completion = useMemo(() => calculateCompletionScore(resumeData), [resumeData])
  const checklistItems = useMemo(() => getChecklistItems(resumeData), [resumeData])

  return { completion, checklistItems }
}

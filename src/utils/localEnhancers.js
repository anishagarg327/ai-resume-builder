import { ACTION_VERB_REPLACEMENTS, FALLBACK_VERBS } from '../constants/actionVerbs'

export const localEnhanceSummary = (title, skills) => {
  return `Results-driven and product-focused ${title || 'Professional'} specializing in ${skills || 'industry-standard technologies'}. Proven track record of delivering user-centric features, optimizing development workflows, and collaborating across engineering pipelines to build accessible, high-fidelity systems.`
}

export const localEnhanceBulletPoints = (text) => {
  const cleaned = String(text || '').trim()
  if (!cleaned) return ''
  const lines = cleaned.split('\n').map((line) => line.trim()).filter(Boolean)

  const polishedLines = lines.map((line) => {
    let clean = line.replace(/^[-•*+]\s*/, '')
    if (!clean) return ''
    clean = clean.charAt(0).toUpperCase() + clean.slice(1)

    for (const rule of ACTION_VERB_REPLACEMENTS) {
      if (rule.pattern.test(clean)) {
        clean = clean.replace(rule.pattern, rule.replacement)
        break
      }
    }

    const firstWord = clean.split(/\s+/)[0] || ''
    const startsWithActionVerb = /ed$/i.test(firstWord) ||
      /^(led|built|run|wrote|drove|set|made|cut|won|did|got|had|spearheaded|architected)$/i.test(firstWord)

    if (!startsWithActionVerb) {
      const hash = clean.charCodeAt(0) + (clean.charCodeAt(1) || 0)
      const fallbackVerb = FALLBACK_VERBS[hash % FALLBACK_VERBS.length]
      clean = fallbackVerb + ' and ' + clean.charAt(0).toLowerCase() + clean.slice(1)
    }

    return `- ${clean}`
  })

  return polishedLines.join('\n')
}

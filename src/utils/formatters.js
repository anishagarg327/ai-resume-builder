export const toBulletList = (value) => {
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

export const parseImprovedResume = (text) => {
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

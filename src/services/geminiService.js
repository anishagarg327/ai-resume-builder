export const callGeminiAPI = async (promptText, apiKey) => {
  const rawKey = (apiKey || '').trim()
  if (!rawKey) {
    throw new Error('Gemini API key is required. Go to the "AI Tools" tab to enter it.')
  }

  // Support comma-separated multiple API keys for automatic rotation on quota errors
  const keys = rawKey.split(',').map((k) => k.trim()).filter(Boolean)
  let lastError = null

  for (const activeApiKey of keys) {
    try {
      // Support both universal x-goog-api-key / query params and Bearer token formats
      const isOAuthToken = activeApiKey.startsWith('AQ.')
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${activeApiKey}`
      const headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': activeApiKey,
        ...(isOAuthToken ? { Authorization: `Bearer ${activeApiKey}` } : {}),
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

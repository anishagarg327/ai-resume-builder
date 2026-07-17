export const isValidLinkedInUrl = (url) => {
  if (!url) return true
  return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(url)
}

export const isValidGitHubUrl = (url) => {
  if (!url) return true
  return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i.test(url)
}

export const isValidWebsiteUrl = (url) => {
  if (!url) return true
  return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/i.test(url)
}

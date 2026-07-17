export const DEFAULT_GEMINI_API_KEY = import.meta.env.VITE_API_KEY;

export const SUMMARY_TONE_PROMPTS = {
  corporate: 'Write in a highly professional, conservative, and polished executive tone suitable for corporate environments (e.g. finance, consulting, enterprise). Use traditional executive power verbs.',
  tech: 'Write in a direct, action-oriented, and tech-focused tone, highlighting technical competencies, engineering metrics, scale, and problem-solving skills.',
  creative: 'Write in a highly engaging, creative, and narrative tone, highlighting innovation, storytelling, passion, and unique career value.'
}

export const BULLET_TONE_PROMPTS = {
  corporate: 'Use traditional executive power verbs (e.g. "Spearheaded", "Orchestrated", "Leveraged", "Formulated") and focus on bottom-line business value, cost reductions, and operational excellence.',
  tech: 'Use strong engineering and technical action verbs (e.g. "Architected", "Engineered", "Optimized", "Automated", "Scaled") and highlight tools, stack integration, metrics, scale, and performance gains.',
  creative: 'Use expressive, vision-oriented action verbs (e.g. "Designed", "Cultivated", "Pioneered", "Transformed", "Conceived") and focus on innovation, visual/experience style, design methodology, and human impact.'
}

export const GLOBAL_TONE_PROMPTS = {
  corporate: 'Format all text in a formal, highly professional executive corporate tone, focusing on business objectives and results.',
  tech: 'Format all text in a direct, high-impact technical tone, prioritizing technical metrics, technologies, and scalability.',
  creative: 'Format all text in an engaging, visionary, and modern storytelling tone, highlighting creativity and unique project values.'
}

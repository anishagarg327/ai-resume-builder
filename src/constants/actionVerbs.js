export const ACTION_VERB_REPLACEMENTS = [
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+writing/i, replacement: 'Engineered' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+building/i, replacement: 'Constructed' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+developing/i, replacement: 'Architected' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+creating/i, replacement: 'Designed' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+managing/i, replacement: 'Orchestrated' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+improving/i, replacement: 'Optimized' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+leading/i, replacement: 'Spearheaded' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+testing/i, replacement: 'Validated' },
  { pattern: /^(responsible for|worked on|involved in|helped with|did)\s+/i, replacement: 'Facilitated ' },
  { pattern: /^i\s+(wrote|built|created|made)/i, replacement: 'Engineered' },
  { pattern: /^i\s+led/i, replacement: 'Spearheaded' },
  { pattern: /^i\s+managed/i, replacement: 'Orchestrated' }
]

export const FALLBACK_VERBS = ['Streamlined', 'Enhanced', 'Orchestrated', 'Optimized', 'Spearheaded', 'Facilitated']

export type PaperType = 'cream' | 'lined' | 'dotted' | 'bone'
export type ViewType = 'editor' | 'read'

export interface DiaryUIEntry {
  id: string
  date: string      // 'YYYY-MM-DD' derived from created_at
  title: string
  body: string      // raw innerHTML from contentEditable (= API content)
  bodyText: string  // plain text for search/preview/word count
  updatedAt: number // ms timestamp from updated_at
}

export interface DiaryUIPrefs {
  paper: PaperType
}

export const DEFAULT_PREFS: DiaryUIPrefs = {
  paper: 'cream',
}

export interface PaperConfig {
  bg: string
  edge: string
  pattern?: string
  patternSize?: string
}

export const PAPER_BG: Record<PaperType, PaperConfig> = {
  cream: { bg: 'var(--d-paper-cream)', edge: 'var(--d-paper-cream-edge)' },
  lined: {
    bg: 'var(--d-paper-lined)',
    edge: 'var(--d-paper-edge)',
    pattern: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(42,36,28,0.10) 31px, rgba(42,36,28,0.10) 32px)',
  },
  dotted: {
    bg: 'var(--d-paper-dotted)',
    edge: 'var(--d-paper-edge)',
    pattern: 'radial-gradient(circle, rgba(42,36,28,0.12) 1px, transparent 1.2px)',
    patternSize: '18px 18px',
  },
  bone: { bg: 'var(--d-paper-bone)', edge: 'var(--d-paper-bone-edge)' },
}

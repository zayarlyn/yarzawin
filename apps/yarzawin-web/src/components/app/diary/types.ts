export type PaperType = 'cream' | 'lined' | 'dotted' | 'bone'
export type ViewType = 'list' | 'editor' | 'read'

export interface DiaryUIEntry {
  id: string
  date: string      // 'YYYY-MM-DD' derived from created_at
  title: string
  body: string      // raw innerHTML from contentEditable (= API content)
  bodyText: string  // plain text for search/preview/word count
  updatedAt: number // ms timestamp from updated_at
}

export interface DiaryUIPrefs {
  onboarded: boolean
  name: string
  paper: PaperType
}

export const DEFAULT_PREFS: DiaryUIPrefs = {
  onboarded: false,
  name: '',
  paper: 'cream',
}

export interface PaperConfig {
  bg: string
  edge: string
  pattern?: string
  patternSize?: string
}

export const PAPER_BG: Record<PaperType, PaperConfig> = {
  cream: { bg: '#f5efe1', edge: '#d9cfb6' },
  lined: {
    bg: '#f6f0e2',
    edge: '#d6cdb4',
    pattern: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(42,36,28,0.10) 31px, rgba(42,36,28,0.10) 32px)',
  },
  dotted: {
    bg: '#f4eedc',
    edge: '#d6cdb4',
    pattern: 'radial-gradient(circle, rgba(42,36,28,0.12) 1px, transparent 1.2px)',
    patternSize: '18px 18px',
  },
  bone: { bg: '#ede4d0', edge: '#cfc4a8' },
}

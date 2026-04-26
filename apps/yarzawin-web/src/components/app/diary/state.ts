import type { DiaryEntry } from '@yarzawin-web/lib/diary/queries'
import type { DiaryUIEntry, DiaryUIPrefs } from './types'
import { DEFAULT_PREFS } from './types'

const PREFS_KEY = 'my-diary-ui-v1'

export function loadPrefs(): DiaryUIPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs: DiaryUIPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export function toUIEntry(e: DiaryEntry): DiaryUIEntry {
  return {
    id: e.id,
    date: e.created_at.slice(0, 10),
    title: e.title,
    body: e.content,
    bodyText: stripHtml(e.content),
    updatedAt: new Date(e.updated_at).getTime(),
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

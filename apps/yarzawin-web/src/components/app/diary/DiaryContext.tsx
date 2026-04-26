import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import {
  diaryListQueryOptions,
  createDiaryMutation,
  updateDiaryMutation,
  deleteDiaryMutation,
} from '@yarzawin-web/lib/diary/queries'
import { loadPrefs, savePrefs, toUIEntry } from './state'
import type { DiaryUIPrefs, DiaryUIEntry, PaperType, ViewType } from './types'

interface DiaryContextValue {
  entries: DiaryUIEntry[]
  prefs: DiaryUIPrefs
  view: ViewType
  activeId: string | null
  activeEntry: DiaryUIEntry | null
  prevEntry: DiaryUIEntry | null
  nextEntry: DiaryUIEntry | null
  isLoading: boolean
  setView: (view: ViewType, id?: string) => void
  setPrefs: (patch: Partial<DiaryUIPrefs>) => void
  completeOnboarding: (name: string, paper: PaperType) => void
  newEntry: () => void
  saveEntry: (entry: DiaryUIEntry) => void
  deleteEntry: (id: string) => void
  resetAll: () => void
}

const DiaryContext = createContext<DiaryContextValue | null>(null)

export function useDiaryContext() {
  const ctx = useContext(DiaryContext)
  if (!ctx) throw new Error('useDiaryContext must be used inside DiaryProvider')
  return ctx
}

export function DiaryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { data: apiEntries = [] } = useQuery(diaryListQueryOptions())

  const [prefs, setPrefsState] = useState<DiaryUIPrefs>(loadPrefs)
  const [view, setViewState] = useState<ViewType>('list')
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    savePrefs(prefs)
  }, [prefs])

  const entries: DiaryUIEntry[] = [...apiEntries]
    .map(toUIEntry)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.updatedAt - a.updatedAt)

  const activeIdx = entries.findIndex((e) => e.id === activeId)
  const activeEntry = activeIdx >= 0 ? entries[activeIdx] : null
  const prevEntry = activeIdx >= 0 ? (entries[activeIdx + 1] ?? null) : null
  const nextEntry = activeIdx > 0 ? entries[activeIdx - 1] : null

  const setView = useCallback((v: ViewType, id?: string) => {
    setViewState(v)
    if (id !== undefined) setActiveId(id)
  }, [])

  const setPrefs = useCallback((patch: Partial<DiaryUIPrefs>) => {
    setPrefsState((p) => ({ ...p, ...patch }))
  }, [])

  const completeOnboarding = useCallback((name: string, paper: PaperType) => {
    setPrefsState({ onboarded: true, name, paper })
    setViewState('list')
  }, [])

  const createMutation = useMutation({
    ...createDiaryMutation(),
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: ['diary', 'list'] })
      setActiveId(entry.id)
      setViewState('editor')
    },
  })

  const updateMutation = useMutation({
    ...updateDiaryMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', 'list'] })
    },
  })

  const deleteMutation = useMutation({
    ...deleteDiaryMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', 'list'] })
      setViewState('list')
      setActiveId(null)
    },
  })

  const newEntry = useCallback(() => {
    createMutation.mutate({ title: '', content: '' })
  }, [createMutation])

  const saveEntry = useCallback((entry: DiaryUIEntry) => {
    updateMutation.mutate({ id: entry.id, title: entry.title, content: entry.body })
  }, [updateMutation])

  const deleteEntry = useCallback((id: string) => {
    deleteMutation.mutate(id)
  }, [deleteMutation])

  const resetAll = useCallback(() => {
    if (window.confirm('reset diary? this will delete all entries.')) {
      const ids = entries.map((e) => e.id)
      Promise.all(ids.map((id) => deleteMutation.mutateAsync(id))).then(() => {
        setPrefsState({ onboarded: false, name: '', paper: 'cream' })
        setViewState('list')
        setActiveId(null)
      })
    }
  }, [entries, deleteMutation])

  return (
    <DiaryContext.Provider
      value={{
        entries,
        prefs,
        view,
        activeId,
        activeEntry,
        prevEntry,
        nextEntry,
        isLoading: createMutation.isPending || updateMutation.isPending,
        setView,
        setPrefs,
        completeOnboarding,
        newEntry,
        saveEntry,
        deleteEntry,
        resetAll,
      }}
    >
      {children}
    </DiaryContext.Provider>
  )
}

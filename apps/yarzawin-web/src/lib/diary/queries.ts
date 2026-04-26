import { queryOptions } from '@tanstack/react-query'
import api from '../api'

export interface DiaryEntry {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export const diaryListQueryOptions = () =>
  queryOptions({
    queryKey: ['diary', 'list'],
    queryFn: () => api.get<DiaryEntry[]>('/diaries').then((r) => r.data),
  })

export const createDiaryMutation = () => ({
  mutationFn: (data: { title: string; content?: string }) =>
    api.post<DiaryEntry>('/diaries', data).then((r) => r.data),
})

export const updateDiaryMutation = () => ({
  mutationFn: (data: { id: string; title: string; content?: string }) =>
    api.put<DiaryEntry>(`/diaries/${data.id}`, data).then((r) => r.data),
})

export const deleteDiaryMutation = () => ({
  mutationFn: (id: string) =>
    api.delete('/diaries', { data: { id } }).then((r) => r.data),
})

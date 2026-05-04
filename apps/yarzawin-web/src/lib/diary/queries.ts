import { queryOptions } from '@tanstack/react-query'
import api from '../api'

export interface DiaryItem {
  id: string
  title: string
  content: string
  userId: string
  created_at: string
  updated_at: string
}

export const diaryListQueryOptions = () =>
  queryOptions({
    queryKey: ['diary', 'list'],
    queryFn: () => api.get<DiaryItem[]>('/diaries').then((r) => r.data),
  })

export const diaryItemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['diary', id],
    queryFn: () => api.get<DiaryItem>(`/diaries/${id}`).then((r) => r.data),
  })

export const createDiaryMutation = () => ({
  mutationFn: (data: { title: string; content?: string }) => api.post<DiaryItem>('/diaries', data).then((r) => r.data),
})

export const updateDiaryMutation = () => ({
  mutationFn: (data: { id: string; title: string; content?: string }) =>
    api.put<DiaryItem>(`/diaries/${data.id}`, data).then((r) => r.data),
})

export const deleteDiaryMutation = () => ({
  mutationFn: (id: string) => api.delete('/diaries').then((r) => r.data),
})

import { mutationOptions, queryOptions } from '@tanstack/react-query'
import api from '../api'

export interface DiaryItem {
  id: string
  title: string
  content: string
  feature: 'diary' | 'blog' | 'note'
  userId: string
  created_at: string
  updated_at: string
}

export const diaryListQueryOptions = () =>
  queryOptions({
    queryKey: ['diary', 'list'],
    queryFn: () => api.get<DiaryItem[]>('/posts').then((r) => r.data),
  })

export const diaryItemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['diary', id],
    queryFn: () => api.get<DiaryItem>(`/posts/${id}`).then((r) => r.data),
  })

export const createDiaryMutation = () =>
  mutationOptions({
    mutationFn: (data: { feature: DiaryItem['feature']; title: string; content?: string }) =>
      api.post<DiaryItem>('/posts', data).then((r) => r.data),
  })

export const updateDiaryMutation = () =>
  mutationOptions({
    mutationFn: (data: { id: string; feature: DiaryItem['feature']; title: string; content?: string }) =>
      api.put<DiaryItem>(`/posts/${data.id}`, data).then((r) => r.data),
  })

export const deleteDiaryMutation = () =>
  mutationOptions({
    mutationFn: (id: string) => api.delete(`/posts/${id}`).then((r) => r.data),
  })

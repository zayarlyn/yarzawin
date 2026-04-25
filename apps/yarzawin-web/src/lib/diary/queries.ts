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

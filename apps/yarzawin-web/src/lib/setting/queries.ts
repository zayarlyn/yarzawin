import { queryOptions } from '@tanstack/react-query'
import api from '../api'
import type { DiaryUIPrefs } from '../../components/app/diary/types'
import { DEFAULT_PREFS } from '../../components/app/diary/types'

export interface SettingRecord {
  id: string
  feature: string
  type: string
  name: string
  value: string
  created_at: string
  updated_at: string
}

export const diaryPrefsQueryOptions = () =>
  queryOptions({
    queryKey: ['settings', 'diary'] as const,
    queryFn: () => api.get<SettingRecord[]>('/settings/diary').then((r) => r.data),
    select: (records): DiaryUIPrefs => {
      const paper = records.find((r) => r.type === 'theme' && r.name === 'paper')?.value
      return { paper: (paper as DiaryUIPrefs['paper']) ?? DEFAULT_PREFS.paper }
    },
  })

export const savePrefsMutation = () => ({
  mutationFn: (prefs: DiaryUIPrefs) =>
    api
      .post('/settings/diary', {
        feature: 'diary',
        valueByTypeAndName: { theme: { paper: prefs.paper } },
      })
      .then((r) => r.data),
})

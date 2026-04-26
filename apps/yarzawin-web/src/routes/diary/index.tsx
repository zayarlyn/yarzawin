import { createFileRoute } from '@tanstack/react-router'
import { diaryListQueryOptions } from '../../lib/diary/queries'
import DiaryApp from '../../components/app/diary'

export const Route = createFileRoute('/diary/')({
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(diaryListQueryOptions()),
  component: DiaryApp,
})

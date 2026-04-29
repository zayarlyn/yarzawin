import { createFileRoute } from '@tanstack/react-router'
import { DiaryPage } from '@yarzawin-web/components/app/diary/DiaryPage'
import { diaryListQueryOptions } from '@yarzawin-web/lib/diary/queries'

export const Route = createFileRoute('/diary/$id/')({
  loader: ({ context: { queryClient } }) => queryClient.prefetchQuery(diaryListQueryOptions()),
  component: DiaryPage,
})

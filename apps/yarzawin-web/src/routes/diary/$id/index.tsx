import { createFileRoute } from '@tanstack/react-router'
import { DiaryPage } from '@yarzawin-web/components/app/diary/DiaryPage'
import { diaryItemQueryOptions } from '@yarzawin-web/lib/diary/queries'

export const Route = createFileRoute('/diary/$id/')({
  loader: ({ context: { queryClient }, params }) => queryClient.prefetchQuery(diaryItemQueryOptions(params.id)),
  component: DiaryPage,
})

import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { diaryListQueryOptions } from '../../lib/diary/queries'

export const Route = createFileRoute('/diary/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(diaryListQueryOptions()),
  component: DiaryPage,
})

function DiaryPage() {
  const { data } = useSuspenseQuery(diaryListQueryOptions())
  return (
    <ul>
      {data.map((entry) => (
        <li key={entry.id}>{entry.title}</li>
      ))}
    </ul>
  )
}

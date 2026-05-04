import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DEFAULT_PREFS, PAPER_BG } from '../../components/app/diary/types'
import { diaryListQueryOptions } from '../../lib/diary/queries'
import { diaryPrefsQueryOptions } from '../../lib/setting/queries'

export const Route = createFileRoute('/diary')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.prefetchQuery(diaryListQueryOptions()), queryClient.prefetchQuery(diaryPrefsQueryOptions())]),
  component: DiaryShell,
})

function DiaryShell() {
  const { data: prefs = DEFAULT_PREFS } = useQuery(diaryPrefsQueryOptions())

  const p = PAPER_BG[prefs.paper]

  return (
    <div
      className="flex flex-col w-full h-dvh overflow-hidden"
      style={
        {
          '--d-paper': p.bg,
          // '--d-paper-edge': p.edge,
          '--d-rule': p.edge,
          // '--d-pattern': p.pattern ?? 'none',
          // '--d-pattern-size': p.patternSize ?? 'auto',
          // background: p.bg,
          backgroundColor: '#f4ede0',
          color: 'var(--d-ink)',
          fontFamily: 'var(--d-serif)',
          WebkitFontSmoothing: 'antialiased',
        } as React.CSSProperties
      }
    >
      {/* paper grain overlay */}
      {/* <div
        className="fixed inset-0 pointer-events-none z-1000 opacity-70"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.14 0 0 0 0 0.10 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      /> */}

      <main className="flex flex-1 overflow-hidden min-h-0 relative flex-col">
        <Outlet />
      </main>
    </div>
  )
}

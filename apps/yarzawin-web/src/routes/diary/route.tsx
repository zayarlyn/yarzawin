import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDiaryMutation, diaryListQueryOptions } from '../../lib/diary/queries'
import { diaryPrefsQueryOptions, savePrefsMutation, type SettingRecord } from '../../lib/setting/queries'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { DEFAULT_PREFS, PAPER_BG } from '../../components/app/diary/types'
import type { DiaryUIPrefs } from '../../components/app/diary/types'

export const Route = createFileRoute('/diary')({
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.prefetchQuery(diaryListQueryOptions()), queryClient.prefetchQuery(diaryPrefsQueryOptions())]),
  component: DiaryShell,
})

export const Header = ({ setPrefs }: { setPrefs: (patch: Partial<DiaryUIPrefs>) => void }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams({ strict: false }) as { id?: string }
  const deleteMutation = useMutation(deleteDiaryMutation())
  const { data: apiEntries = [] } = useQuery(diaryListQueryOptions())

  const resetAll = () => {
    if (!window.confirm('reset diary? this will delete all entries.')) return
    Promise.all(apiEntries.map((e) => deleteMutation.mutateAsync(e.id))).then(() => {
      queryClient.invalidateQueries({ queryKey: ['diary', 'list'] })
      setPrefs({ paper: 'cream' })
      navigate({ to: '/diary' })
    })
  }

  const today = format(new Date(), 'EEEE, MMMM d').toLowerCase()

  return (
    <header
      className="h-14 flex items-center px-5 gap-3.5 shrink-0 z-5"
      style={{ borderBottom: '1px solid var(--d-rule)', background: 'var(--d-paper)' }}
    >
      <button
        onClick={() => navigate({ to: '/diary' })}
        className="-mt-2 text-[26px] font-semibold tracking-[0.3px] cursor-pointer select-none shrink-0 whitespace-nowrap bg-transparent border-none p-0"
        style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}
      >
        my <span className="today-underline leading-[1.05]">diary</span>
        <span style={{ color: 'var(--d-accent)' }}>.</span>
      </button>

      <span
        className="text-[12px] uppercase tracking-[0.4px] whitespace-nowrap shrink-0"
        style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
      >
        {today}
      </span>

      <div className="flex-1" />

      {params.id && (
        <button
          onClick={() => navigate({ to: '/diary' })}
          className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[12px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px whitespace-nowrap flex-shrink-0"
          style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)', border: 'none', background: 'transparent' }}
        >
          <Icon name="BookOpen" size={13} /> all entries
        </button>
      )}

      <button
        onClick={resetAll}
        title="Reset diary"
        className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all hover:bg-black/5 border-none flex-shrink-0"
        style={{ background: 'transparent', color: 'var(--d-ink-soft)' }}
      >
        <Icon name="Trash2" size={13} />
      </button>
    </header>
  )
}

function DiaryShell() {
  const queryClient = useQueryClient()

  const { data: prefs = DEFAULT_PREFS } = useQuery(diaryPrefsQueryOptions())

  const prefsMutation = useMutation({
    ...savePrefsMutation(),
    onMutate: async (next: DiaryUIPrefs) => {
      await queryClient.cancelQueries({ queryKey: ['settings', 'diary'] })
      const previous = queryClient.getQueryData<SettingRecord[]>(['settings', 'diary'])
      const optimistic: SettingRecord[] = (previous ?? []).map((r) =>
        r.type === 'theme' && r.name === 'paper' ? { ...r, value: next.paper } : r,
      )
      if (!optimistic.some((r) => r.type === 'theme' && r.name === 'paper')) {
        optimistic.push({
          id: '__optimistic__',
          feature: 'diary',
          type: 'theme',
          name: 'paper',
          value: next.paper,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      queryClient.setQueryData(['settings', 'diary'], optimistic)
      return { previous }
    },
    onError: (_err, _next, context) => {
      queryClient.setQueryData(['settings', 'diary'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'diary'] })
    },
  })

  const setPrefs = (patch: Partial<DiaryUIPrefs>) => prefsMutation.mutate({ ...prefs, ...patch })

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

      {/* <Header setPrefs={setPrefs} /> */}

      <main className="flex flex-1 overflow-hidden min-h-0 relative flex-col">
        <Outlet />
      </main>
    </div>
  )
}

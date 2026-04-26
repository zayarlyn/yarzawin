import { DiaryProvider, useDiaryContext } from './DiaryContext'
import { Onboarding } from './Onboarding'
import { EntryList } from './EntryList'
import { Editor } from './Editor'
import { ReadMode } from './ReadMode'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { PAPER_BG } from './types'

export default function DiaryApp() {
  return (
    <DiaryProvider>
      <DiaryRoot />
    </DiaryProvider>
  )
}

function DiaryRoot() {
  const { prefs, view, setView, resetAll } = useDiaryContext()
  const p = PAPER_BG[prefs.paper]

  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toLowerCase()

  return (
    <div
      className="diary-root flex flex-col w-full h-dvh overflow-hidden"
      style={{
        '--d-paper': p.bg,
        '--d-paper-edge': p.edge,
        '--d-rule': p.edge,
        '--d-pattern': p.pattern ?? 'none',
        '--d-pattern-size': p.patternSize ?? 'auto',
        background: p.bg,
        color: 'var(--d-ink)',
        fontFamily: 'var(--d-serif)',
        WebkitFontSmoothing: 'antialiased',
      } as React.CSSProperties}
    >
      {/* paper grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1000] opacity-70"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.14 0 0 0 0 0.10 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      {!prefs.onboarded ? (
        <Onboarding />
      ) : (
        <>
          {/* top bar */}
          <header
            className="h-14 flex items-center px-[22px] gap-3.5 flex-shrink-0 z-[5]"
            style={{ borderBottom: '1px solid var(--d-rule)', background: 'var(--d-paper)' }}
          >
            <button
              onClick={() => setView('list')}
              className="text-[26px] font-semibold tracking-[0.3px] cursor-pointer select-none flex-shrink-0 whitespace-nowrap bg-transparent border-none p-0"
              style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}
            >
              my-diary<span style={{ color: 'var(--d-accent)' }}>.</span>
            </button>

            <span
              className="text-[12px] uppercase tracking-[0.4px] whitespace-nowrap flex-shrink-0"
              style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
            >
              {today}
            </span>

            <div className="flex-1" />

            {view !== 'list' && (
              <button
                onClick={() => setView('list')}
                className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[12px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)', border: 'none', background: 'transparent' }}
              >
                <Icon name="book" size={13} /> all entries
              </button>
            )}

            <button
              onClick={resetAll}
              title="Reset diary"
              className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all hover:bg-black/5 border-none flex-shrink-0"
              style={{ background: 'transparent', color: 'var(--d-ink-soft)' }}
            >
              <Icon name="trash" size={13} />
            </button>
          </header>

          {/* main screen */}
          <main className="flex flex-1 overflow-hidden min-h-0 relative flex-col">
            {view === 'list' && <EntryList />}
            {view === 'editor' && <Editor />}
            {view === 'read' && <ReadMode />}
          </main>
        </>
      )}
    </div>
  )
}

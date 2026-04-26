import { useDiaryContext } from './DiaryContext'
import { Icon } from '@yarzawin-web/components/shared/Icon'

export function ReadMode() {
  const { activeEntry, prevEntry, nextEntry, setView } = useDiaryContext()

  if (!activeEntry) return null

  const d = new Date(activeEntry.date + 'T00:00:00')
  const dateStr = d
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0 w-full">
      {/* header */}
      <div
        className="flex items-center gap-2.5 px-[22px] py-3.5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--d-rule)', background: 'var(--d-paper)' }}
      >
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[12px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px border-transparent"
          style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
        >
          <Icon name="arrowL" size={13} /> all entries
        </button>
        <div className="flex-1" />
        <button
          onClick={() => activeEntry && setView('editor', activeEntry.id)}
          className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[12px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px border-transparent"
          style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
        >
          <Icon name="edit" size={13} /> edit
        </button>
      </div>

      {/* body */}
      <div
        className="flex-1 overflow-y-auto flex justify-center px-6 py-[60px] pb-20"
        style={{ backgroundColor: 'var(--d-paper)', backgroundImage: 'var(--d-pattern)', backgroundSize: 'var(--d-pattern-size)' }}
      >
        <div className="w-full max-w-[640px]">
          <div
            className="text-[11px] tracking-[2px] uppercase mb-2.5"
            style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
          >
            {dateStr}
          </div>

          {activeEntry.title && (
            <h1
              className="text-[64px] font-semibold leading-none mb-6"
              style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}
            >
              {activeEntry.title}
            </h1>
          )}

          <div
            className="read-body-content text-[20px] leading-[1.75]"
            style={{ fontFamily: 'var(--d-serif)', color: 'var(--d-ink)' }}
            dangerouslySetInnerHTML={{ __html: activeEntry.body || '<p><em style="color:var(--d-ink-faint)">(empty entry)</em></p>' }}
          />

          {/* prev/next nav */}
          <div
            className="flex justify-between mt-[60px] pt-6 gap-3"
            style={{ borderTop: '1px solid var(--d-rule)' }}
          >
            <NavCard
              label="← previous"
              title={prevEntry ? (prevEntry.title || 'untitled') : 'nothing earlier'}
              disabled={!prevEntry}
              onClick={() => prevEntry && setView('read', prevEntry.id)}
            />
            <NavCard
              label="next →"
              title={nextEntry ? (nextEntry.title || 'untitled') : 'nothing later'}
              disabled={!nextEntry}
              align="right"
              onClick={() => nextEntry && setView('read', nextEntry.id)}
            />
          </div>
        </div>
      </div>

      <style>{`
        .read-body-content p { margin: 0 0 1em; }
        .read-body-content img { max-width: 100%; border-radius: 3px; margin: 1em 0; border: 1px solid var(--d-paper-edge); box-shadow: var(--d-shadow-md); }
        .read-body-content figure { margin: 1.2em 0; }
        .read-body-content figure.tilt-l { transform: rotate(-1deg); }
        .read-body-content figure.tilt-r { transform: rotate(1deg); }
        .read-body-content figcaption { font-family: var(--d-hand); font-size: 18px; color: var(--d-ink-soft); text-align: center; margin-top: 6px; }
        .read-body-content blockquote { border-left: 3px solid var(--d-accent); padding: 4px 0 4px 18px; margin: 0.6em 0; font-style: italic; color: var(--d-ink-soft); }
        .read-body-content .sketch-block { display: block; margin: 1.2em auto; background: #fdfaf2; border: 1px solid var(--d-paper-edge); border-radius: 3px; max-width: 100%; }
      `}</style>
    </div>
  )
}

function NavCard({ label, title, disabled, align = 'left', onClick }: {
  label: string
  title: string
  disabled: boolean
  align?: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className="flex-1 rounded-md px-4 py-3 max-w-[240px] transition-all"
      style={{
        border: '1px solid var(--d-rule)',
        background: 'rgba(255,255,255,0.4)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        textAlign: align,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <div className="text-[10px] uppercase tracking-[1.5px] mb-0.5" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
        {label}
      </div>
      <div className="text-[22px] leading-[1.1]" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
        {title}
      </div>
    </div>
  )
}

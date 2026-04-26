import { useState } from 'react'
import { useDiaryContext } from './DiaryContext'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import type { DiaryUIEntry } from './types'

export function EntryList() {
  const { entries, prefs, newEntry, setView } = useDiaryContext()
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? entries.filter((e) => {
        const q = query.toLowerCase()
        return e.title.toLowerCase().includes(q) || e.bodyText.toLowerCase().includes(q)
      })
    : entries

  // Group by month
  const grouped: Record<string, DiaryUIEntry[]> = {}
  for (const e of filtered) {
    const d = new Date(e.date + 'T00:00:00')
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(e)
  }
  const monthKeys = Object.keys(grouped).sort(
    (a, b) => new Date(grouped[b][0].date).getTime() - new Date(grouped[a][0].date).getTime()
  )

  const today = new Date()
  const h = today.getHours()
  const greeting = h < 5 ? 'still up' : h < 12 ? 'good morning' : h < 18 ? 'good afternoon' : 'good evening'

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div
        className="flex items-end justify-between gap-6 px-14 pt-8 pb-[22px] flex-shrink-0"
        style={{ borderBottom: '1px solid var(--d-rule)' }}
      >
        <div>
          <div className="text-[12px] uppercase tracking-[1px] mt-1.5" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
            {greeting}{prefs.name ? `, ${prefs.name}` : ''}
          </div>
          <h1 className="text-[56px] font-semibold leading-none -mb-1.5" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
            my <span className="today-underline">diary</span>
          </h1>
        </div>
        <div className="flex gap-2.5 items-center pb-1">
          {/* search */}
          <label
            className="flex items-center gap-2 rounded-full px-3.5 py-[7px] w-[220px]"
            style={{ border: '1px solid var(--d-rule)', background: 'rgba(255,255,255,0.5)' }}
          >
            <Icon name="search" size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search entries…"
              className="flex-1 bg-transparent outline-none text-[13px] min-w-0"
              style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
            />
          </label>
          <button
            onClick={newEntry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all active:translate-y-px hover:opacity-90"
            style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-accent)', color: '#fff', border: '1px solid var(--d-accent)' }}
          >
            <Icon name="plus" size={14} /> new entry
          </button>
        </div>
      </div>

      {/* body */}
      <div
        className="flex-1 overflow-y-auto px-14 py-7 pb-[60px]"
        style={{ backgroundColor: 'var(--d-paper)', backgroundImage: 'var(--d-pattern)', backgroundSize: 'var(--d-pattern-size)' }}
      >
        {entries.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--d-ink-soft)' }}>
            <h2 className="text-[42px] mb-2" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
              a fresh page awaits.
            </h2>
            <p className="text-[16px] mb-5" style={{ fontFamily: 'var(--d-serif)' }}>
              Your diary is empty — let's change that.
            </p>
            <button
              onClick={newEntry}
              className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full text-[13px] font-medium cursor-pointer active:translate-y-px hover:opacity-90"
              style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-accent)', color: '#fff' }}
            >
              <Icon name="plus" /> write your first entry
            </button>
          </div>
        ) : monthKeys.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--d-ink-soft)' }}>
            <h2 className="text-[42px] mb-2" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>nothing here.</h2>
            <p className="text-[16px]" style={{ fontFamily: 'var(--d-serif)' }}>No entries match "{query}".</p>
          </div>
        ) : (
          monthKeys.map((mo, idx) => (
            <div key={mo}>
              <div
                className="text-[11px] tracking-[2px] uppercase flex items-center gap-3 mt-6 mb-4 first:mt-0"
                style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
              >
                {mo} · {grouped[mo].length}
                <span className="flex-1 h-px" style={{ background: 'var(--d-rule)' }} />
              </div>
              <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {grouped[mo].map((e) => (
                  <EntryCard
                    key={e.id}
                    entry={e}
                    onOpen={() => setView('editor', e.id)}
                    onRead={() => setView('read', e.id)}
                  />
                ))}
                {idx === 0 && (
                  <div
                    onClick={newEntry}
                    className="rounded flex flex-col items-center justify-center text-center gap-2.5 min-h-[220px] cursor-pointer transition-all hover:-translate-y-[3px]"
                    style={{
                      background: 'transparent',
                      border: '1.5px dashed var(--d-ink-faint)',
                      color: 'var(--d-ink-soft)',
                      fontFamily: 'var(--d-hand)',
                      fontSize: 26,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--d-accent)'
                      e.currentTarget.style.color = 'var(--d-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--d-ink-faint)'
                      e.currentTarget.style.color = 'var(--d-ink-soft)'
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-[26px] font-light"
                      style={{ border: '1.5px solid currentColor', fontFamily: 'var(--d-ui)' }}
                    >
                      +
                    </div>
                    <div>start a new<br />entry</div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .today-underline { position: relative; display: inline-block; }
        .today-underline::after {
          content: '';
          position: absolute;
          left: -4px; right: -4px; bottom: -8px;
          height: 8px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8'%3E%3Cpath d='M2 5 Q 25 1 50 4 T 98 4' fill='none' stroke='%23b8651e' stroke-width='1.6' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center / 100% 100%;
        }
      `}</style>
    </div>
  )
}

function EntryCard({ entry, onRead }: { entry: DiaryUIEntry; onOpen: () => void; onRead: () => void }) {
  const d = new Date(entry.date + 'T00:00:00')
  const dow = d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()
  const day = d.getDate()
  const mo = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()

  const firstPhoto = (() => {
    const m = entry.body.match(/<img[^>]+src="([^"]+)"/)
    return m ? m[1] : null
  })()
  const hasSketch = entry.body.includes('sketch-block')
  const wordCount = entry.bodyText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div
      onClick={onRead}
      className="rounded flex flex-col min-h-[220px] cursor-pointer overflow-hidden transition-all duration-[180ms]"
      style={{
        background: '#fff',
        border: '1px solid var(--d-paper-edge)',
        boxShadow: 'var(--d-shadow-md)',
        padding: '20px 22px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) rotate(-0.3deg)'
        e.currentTarget.style.boxShadow = 'var(--d-shadow-lg)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = 'var(--d-shadow-md)'
      }}
    >
      <div className="text-[11px] uppercase tracking-[1.5px] mb-1.5" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
        {dow} · {mo} {day}
      </div>
      <div className="text-[42px] font-semibold leading-none mb-1" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
        {day}
      </div>
      {entry.title && (
        <h3 className="text-[17px] font-semibold leading-[1.3] mt-1.5 mb-2" style={{ fontFamily: 'var(--d-serif)', color: 'var(--d-ink)' }}>
          {entry.title}
        </h3>
      )}
      <div
        className="text-[14px] leading-[1.45] flex-1 overflow-hidden"
        style={{
          fontFamily: 'var(--d-serif)',
          color: 'var(--d-ink-soft)',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {entry.bodyText || <em style={{ opacity: 0.5 }}>(empty)</em>}
      </div>
      {firstPhoto && (
        <div
          className="w-full h-[90px] rounded-sm mt-2.5"
          style={{
            backgroundImage: `url(${firstPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid var(--d-paper-edge)',
          }}
        />
      )}
      <div className="flex gap-1.5 flex-wrap mt-2.5">
        {firstPhoto && <Badge><Icon name="image" size={10} /> photo</Badge>}
        {hasSketch && <Badge><Icon name="sketch" size={10} /> sketch</Badge>}
        {wordCount > 0 && <Badge>{wordCount} {wordCount === 1 ? 'word' : 'words'}</Badge>}
      </div>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.5px] px-2 py-0.5 rounded-full"
      style={{
        fontFamily: 'var(--d-ui)',
        color: 'var(--d-ink-soft)',
        border: '1px solid var(--d-rule)',
        background: 'rgba(255,255,255,0.5)',
      }}
    >
      {children}
    </span>
  )
}

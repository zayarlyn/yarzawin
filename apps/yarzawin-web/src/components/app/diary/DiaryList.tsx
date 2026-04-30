import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { createDiaryMutation, DiaryEntry, diaryListQueryOptions } from '@yarzawin-web/lib/diary/queries'
import { compareDesc, format, getHours, parseISO } from 'date-fns'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { DiaryListItem } from './DiaryListItem'
import type { DiaryUIEntry } from './types'

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function transformToUIDiary(e: DiaryEntry): DiaryUIEntry {
  return {
    id: e.id,
    date: format(parseISO(e.created_at), 'yyyy-MM-dd'),
    title: e.title,
    body: e.content,
    bodyText: stripHtml(e.content),
    updatedAt: parseISO(e.updated_at).getTime(),
  }
}

const CreateDiaryListItem = ({ createDiary }: { createDiary: () => void }) => {
  return (
    <div
      onClick={createDiary}
      className="rounded flex flex-col items-center justify-center text-center gap-2.5 min-h-56 cursor-pointer transition-all hover:-translate-y-0.5"
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
        <span className="-translate-y-0.5">+</span>
      </div>
      <div>
        start a new
        <br />
        entry
      </div>
    </div>
  )
}

const EmptyDIaryListItem = ({ createDiary }: { createDiary: () => void }) => {
  return (
    <div className="text-center py-20" style={{ color: 'var(--d-ink-soft)' }}>
      <h2 className="text-[42px] mb-2" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
        a fresh page awaits.
      </h2>
      <p className="text-[16px] mb-5" style={{ fontFamily: 'var(--d-serif)' }}>
        Your diary is empty — let's change that.
      </p>
      <button
        onClick={createDiary}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium cursor-pointer active:translate-y-px hover:opacity-90"
        style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-accent)', color: '#fff' }}
      >
        <Icon name="Plus" /> write your first entry
      </button>
    </div>
  )
}

export function DiaryList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: diaries = [] } = useQuery(diaryListQueryOptions())
  const sortedDiaries = [...diaries]
    .map(transformToUIDiary)
    .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)) || b.updatedAt - a.updatedAt)

  const createMutation = useMutation({
    ...createDiaryMutation(),
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: ['diary', 'list'] })
      navigate({ to: '/diary/$id', params: { id: entry.id } })
    },
  })

  const createDiary = () => createMutation.mutate({ title: '', content: '' })
  const [search, setSearch] = useState('')

  const filteredDiariesByMonth = useMemo(() => {
    const filtered = search.trim()
      ? sortedDiaries.filter((e) => [e.title, e.bodyText].map((e) => e.toLowerCase()).includes(search.toLowerCase()))
      : sortedDiaries

    const diariesByMonth = _.groupBy(filtered, (diary) => format(parseISO(diary.date), 'MMMM yyyy'))
    return diariesByMonth
  }, [sortedDiaries, search])

  const monthKeys = Object.keys(filteredDiariesByMonth).sort((a, b) =>
    compareDesc(parseISO(filteredDiariesByMonth[a][0].date), parseISO(filteredDiariesByMonth[b][0].date)),
  )

  const h = getHours(new Date())
  const greeting = h < 5 ? 'still up' : h < 12 ? 'good morning' : h < 18 ? 'good afternoon' : 'good evening'

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* header */}
      <div className="flex items-center justify-between gap-6 px-14 py-2 shrink-0" style={{ borderBottom: '1px solid var(--d-rule)' }}>
        <div>
          {/* <div className="text-[12px] uppercase tracking-[1px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
            {greeting}, Zayar
          </div> */}
          <h1 className="-translate-y-2 text-5xl font-semibold leading-none" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
            my <span className="today-underline">diary</span>
          </h1>
        </div>
        <div className="flex gap-2.5 items-center">
          {/* search */}
          {/* <label
            className="flex items-center gap-2 rounded-full px-3.5 py-2 w-56"
            style={{ border: '1px solid var(--d-rule)', background: 'rgba(255,255,255,0.5)' }}
          >
            <Icon name="search" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search entries…"
              className="flex-1 bg-transparent outline-none text-[13px] min-w-0"
              style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
            />
          </label> */}
          <button
            onClick={createDiary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all active:translate-y-px hover:opacity-90"
            style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-accent)', color: '#fff', border: '1px solid var(--d-accent)' }}
          >
            <Icon name="Plus" size={14} /> new entry
          </button>
        </div>
      </div>

      {/* body */}
      <div
        className="flex-1 overflow-y-auto pb-15"
        // style={{ backgroundColor: 'var(--d-paper)', backgroundImage: 'var(--d-pattern)', backgroundSize: 'var(--d-pattern-size)' }}
      >
        {sortedDiaries.length === 0 ? (
          <EmptyDIaryListItem createDiary={createDiary} />
        ) : monthKeys.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--d-ink-soft)' }}>
            <h2 className="text-[42px] mb-2" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
              nothing here.
            </h2>
            <p className="text-[16px]" style={{ fontFamily: 'var(--d-serif)' }}>
              No entries match "{search}".
            </p>
          </div>
        ) : (
          monthKeys.map((mo, idx) => (
            <div key={mo} className="pt-2">
              <div
                className="sticky top-0 z-10 py-3 px-14 text-[11px] tracking-[2px] uppercase flex items-center gap-3 mb-2 first:mt-0"
                style={{ backgroundColor: 'var(--d-paper)', fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
              >
                {mo} · {filteredDiariesByMonth[mo].length}
                <span className="flex-1 h-px" style={{ background: 'var(--d-rule)' }} />
              </div>
              <div className="grid gap-5 px-14" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {idx === 0 && <CreateDiaryListItem createDiary={createDiary} />}
                {filteredDiariesByMonth[mo].map((e) => (
                  <DiaryListItem key={e.id} diary={e} />
                ))}
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

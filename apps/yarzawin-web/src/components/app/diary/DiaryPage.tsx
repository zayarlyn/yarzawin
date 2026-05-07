import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ConfirmDialog } from '@yarzawin-web/components/shared/ConfirmDialog'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { deleteDiaryMutation, diaryItemQueryOptions, diaryListQueryOptions } from '@yarzawin-web/lib/diary/queries'
import { compareDesc, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { transformToUIDiary } from './DiaryList'
import { animate } from './DiaryListItem'
import { Editor } from './Editor'
import { Button } from '@yarzawin-web/components/ui/button'

function NavCard(props: { label: string; title: string; disabled: boolean; align?: 'left' | 'right'; onClick: () => void }) {
  const { label, title, disabled, align = 'left', onClick } = props

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className="flex-1 rounded-md px-4 py-3 max-w-60 transition-all select-none"
      style={{
        border: '1px solid var(--d-rule)',
        background: 'rgba(255,255,255,0.4)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        textAlign: align,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={animate({ transform: 'translateY(-3px) rotate(-0.3deg)' })}
      onMouseLeave={animate({ transform: '' })}
    >
      <div className="text-[10px] uppercase tracking-[1.5px] mb-0.5" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
        {label}
      </div>
      <div className="text-lg leading-[1.1] line-clamp-1" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
        {title}
      </div>
    </div>
  )
}

export function DiaryPage() {
  const [status, setStatus] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { id } = useParams({ strict: false }) as { id: string }

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: deleteDiary, status: deleteStatus } = useMutation({
    ...deleteDiaryMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', 'list'] }).then(() => {
        navigate({ to: '/diary' })
      })
    },
  })
  const { data: diaryData } = useQuery(diaryItemQueryOptions(id))
  const { data: apiEntries = [] } = useQuery({ ...diaryListQueryOptions() })
  const entries = apiEntries.map(transformToUIDiary)

  const activeIdx = entries.findIndex((e) => e.id === id)
  const activeDiary = diaryData ? transformToUIDiary(diaryData) : null
  const prevDiary = activeIdx >= 0 ? (entries[activeIdx + 1] ?? null) : null
  const nextDiary = activeIdx > 0 ? entries[activeIdx - 1] : null

  useEffect(() => {
    if (prevDiary) queryClient.prefetchQuery(diaryItemQueryOptions(prevDiary.id))
    if (nextDiary) queryClient.prefetchQuery(diaryItemQueryOptions(nextDiary.id))
  }, [prevDiary?.id, nextDiary?.id])

  if (!activeDiary) return <div className="p-4">Diary not found</div>

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => deleteDiary(id)}
        diaryTitle={activeDiary.title || 'untitled'}
        mutating={deleteStatus === 'pending'}
      />
      {/* header */}
      <div
        className="flex items-center gap-2.5 px-4 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--d-rule)', background: 'var(--d-paper)' }}
      >
        <Button
          onClick={() => navigate({ to: '/diary' })}
          // className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px border-transparent"
          variant="ghost"
          style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
        >
          <Icon name="ArrowLeft" size={13} /> all entries
        </Button>
        <div className="flex-1" />
        <div
          className="ml-auto flex items-center gap-1.5 text-[11px] tracking-[0.5px]"
          style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse translate-y-px" />
          {status}
        </div>
        <Button variant="outline" size="icon" className="bg-transparent shadow-none" onClick={() => setConfirmOpen(true)}>
          <Icon name="Trash2" />
        </Button>
        {/* <button
          onClick={() => setIsEditing((v) => !v)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px border-transparent"
          style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
        >
          <Icon name={isEditing ? 'check' : 'edit'} size={13} /> {isEditing ? 'Done' : 'Edit'}
        </button> */}
      </div>

      <div
        className="flex-1 min-h-0 overflow-auto"
        style={{
          backgroundColor: 'var(--d-paper)',
          backgroundImage: 'var(--d-pattern), linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 80px)',
          backgroundSize: 'var(--d-pattern-size), auto',
        }}
      >
        <Editor setStatus={setStatus} activeDiary={activeDiary} />
      </div>

      <div
        className="z-50 px-4 mx-auto w-full max-w-160 flex justify-between py-3 gap-3"
        style={{ borderTop: '1px solid var(--d-rule)', background: 'var(--d-paper)' }}
      >
        <NavCard
          label="← previous"
          title={prevDiary ? prevDiary.title || 'untitled' : 'nothing earlier'}
          disabled={!prevDiary}
          onClick={() => prevDiary && navigate({ to: '/diary/$id', params: { id: prevDiary.id } })}
        />
        <NavCard
          label="next →"
          title={nextDiary ? nextDiary.title || 'untitled' : 'nothing later'}
          disabled={!nextDiary}
          align="right"
          onClick={() => nextDiary && navigate({ to: '/diary/$id', params: { id: nextDiary.id } })}
        />
      </div>
    </div>
  )
}

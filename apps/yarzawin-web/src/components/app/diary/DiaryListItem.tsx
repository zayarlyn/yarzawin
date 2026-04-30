import { useNavigate } from '@tanstack/react-router'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { Badge } from '@yarzawin-web/components/ui/badge'
import { cn } from '@yarzawin-web/lib/utils'
import { format, parseISO } from 'date-fns'
import { MouseEvent, PropsWithChildren } from 'react'
import { DiaryUIEntry } from './types'

export const DiaryListItemBadge = ({ children, className }: { className?: string } & PropsWithChildren) => {
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 text-[10px] tracking-[0.5px] rounded-full', className)}
      style={{
        fontFamily: 'var(--d-ui)',
        color: 'var(--d-ink-soft)',
        borderColor: 'var(--d-rule)',
        background: 'rgba(255,255,255,0.5)',
      }}
    >
      {children}
    </Badge>
  )
}

export const animate = (styles: any) => (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
  Object.entries(styles).forEach(([k, v]) => {
    e.currentTarget.style[k as any] = v as any
  })
}

export const DiaryListItem = ({ diary }: { diary: DiaryUIEntry }) => {
  const navigate = useNavigate()
  const d = parseISO(diary.date)

  const firstPhoto = diary.body.match(/<img[^>]+src="([^"]+)"/)?.[1]
  const wordCount = diary.bodyText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div
      className="p-5 rounded flex flex-col min-h-56 cursor-pointer overflow-hidden transition-all duration-200 bg-white"
      style={{ border: '1px solid var(--d-paper-edge)', boxShadow: 'var(--d-shadow-md)' }}
      onMouseEnter={animate({ transform: 'translateY(-3px) rotate(-0.3deg)', boxShadow: 'var(--d-shadow-lg)' })}
      onMouseLeave={animate({ transform: '', boxShadow: 'var(--d-shadow-md)' })}
      onClick={() => navigate({ to: '/diary/$id', params: { id: diary.id } })}
    >
      <div className="text-xs uppercase tracking-[1.5px] mb-1.5" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
        {format(d, 'EEE  d - MMMM yyyy').toLowerCase()}
      </div>
      <div className="text-4xl font-semibold leading-none mb-1" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
        {format(d, 'd')}
      </div>
      {diary.title && (
        <h3 className="text-xl font-semibold leading-[1.3] mt-1.5 mb-2" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
          {diary.title}
        </h3>
      )}
      <div
        className="text-sm leading-[1.45] flex-1 overflow-hidden"
        style={{
          fontFamily: 'var(--d-serif)',
          color: 'var(--d-ink-soft)',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {diary.bodyText || <em style={{ opacity: 0.5 }}>(empty)</em>}
      </div>
      {firstPhoto && (
        <div
          className="w-full h-22.5 rounded-sm mt-2.5 bg-cover bg-center"
          style={{ backgroundImage: `url(${firstPhoto})`, border: '1px solid var(--d-paper-edge)' }}
        />
      )}
      <div className="flex gap-1.5 flex-wrap mt-2.5">
        {firstPhoto && (
          <DiaryListItemBadge>
            <Icon name="Image" size={10} /> photo
          </DiaryListItemBadge>
        )}
{wordCount > 0 && (
          <DiaryListItemBadge>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </DiaryListItemBadge>
        )}
      </div>
    </div>
  )
}

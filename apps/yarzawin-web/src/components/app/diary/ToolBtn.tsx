import { Button } from '@yarzawin-web/components/ui/button'
import { cn } from '@yarzawin-web/lib/utils'

type props = {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  title?: string
  label?: string
  className?: string
  style?: React.CSSProperties
}

export function ToolBtn({ children, active, onClick, title, label, className, style: extraStyle }: props) {
  return (
    <Button
      onClick={onClick}
      title={title}
      aria-label={label || title}
      variant="ghost"
      size="icon"
      className={cn('w-8 h-8 gap-1 text-[14px]', className)}
      style={{
        background: active ? 'var(--d-ink)' : 'transparent',
        color: active ? 'var(--d-paper)' : 'var(--d-ink)',
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'rgba(42,36,28,0.08)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </Button>
  )
}

import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { cn } from '@yarzawin-web/lib/utils'
import { useState } from 'react'

export function DiaryImageNodeView(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props
  const { src, alt, caption, tilt } = node.attrs
  const [localCaption, setLocalCaption] = useState<string>(caption ?? '')

  return (
    <NodeViewWrapper>
      <figure className={cn('inline-block my-4 selection:text-(--d-ink-soft)', tilt === 'l' ? '-rotate-2' : 'rotate-2')}>
        <div className="bg-white p-2.5 shadow-md">
          <img className="block max-w-full" src={src} alt={alt} />
          <input
            name="input"
            className={cn(
              'pointer-events-none font-(--d-hand)] text-[13px] text-(--d-ink-soft)] text-center mt-1.5 bg-transparent border-none outline-none w-full p-0 block',
              selected && 'pointer-events-auto',
            )}
            onChange={(e) => setLocalCaption(e.target.value)}
            onBlur={() => updateAttributes({ caption: localCaption })}
            placeholder="add a caption…"
            value={localCaption}
          />
        </div>
      </figure>
    </NodeViewWrapper>
  )
}

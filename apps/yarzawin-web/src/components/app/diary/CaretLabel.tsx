import { type Editor } from '@tiptap/react'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { useEffect, useRef } from 'react'

function getScrollParent(el: Element): Element | Window {
  let parent = el.parentElement
  while (parent) {
    const { overflow, overflowY } = getComputedStyle(parent)
    if (/auto|scroll/.test(overflow + overflowY)) return parent
    parent = parent.parentElement
  }
  return window
}

export function CaretLabel({ editor }: { editor: Editor }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      el.style.display = 'flex'
    }
    const hide = () => {
      el.style.display = 'none'
    }

    const update = () => {
      if (!editor.isEditable || !editor.isFocused) {
        return hide()
      }
      const { anchor } = editor.state.selection
      const pos = editor.view.coordsAtPos(anchor)
      el.style.top = `${pos.top - 26}px`
      el.style.left = `${pos.left}px`
      show()
    }

    const onFocus = () => {
      if (editor.isEditable) update()
    }

    const scrollParent = getScrollParent(editor.view.dom)
    const onScroll = () => requestAnimationFrame(update)

    editor.on('selectionUpdate', update)
    editor.on('blur', hide)
    editor.on('focus', onFocus)
    scrollParent.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('blur', hide)
      editor.off('focus', onFocus)
      scrollParent.removeEventListener('scroll', onScroll)
    }
  }, [editor])

  return (
    <div
      ref={ref}
      style={{
        display: 'none',
        transform: 'translate(-.5px,50%)',
        background: 'var(--d-accent)',
        fontFamily: 'var(--d-ui)',
      }}
      className="shadow-md px-1.5 py-0.5 text-xs items-center gap-1 text-white fixed"
    >
      <Icon name="Pencil" size={12} />
      editing
    </div>
  )
}

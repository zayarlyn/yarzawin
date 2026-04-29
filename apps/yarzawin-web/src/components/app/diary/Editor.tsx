import { useMutation, useQueryClient } from '@tanstack/react-query'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit, { StarterKitOptions } from '@tiptap/starter-kit'
import { updateDiaryMutation } from '@yarzawin-web/lib/diary/queries'
import { format, parseISO } from 'date-fns'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'
import type { DiaryUIEntry } from './types'
import { Badge } from '@yarzawin-web/components/ui/badge'
import { DiaryListItemBadge } from './DiaryListItem'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { Button } from '@yarzawin-web/components/ui/button'
import EditorToolbar from './EditorToolbar'

const starterKitProps: Partial<StarterKitOptions> = {
  bold: false,
  italic: false,
  strike: false,
  code: false,
  codeBlock: false,
  blockquote: false,
  heading: false,
  bulletList: false,
  orderedList: false,
  listItem: false,
  horizontalRule: false,
  hardBreak: false,
}

export function Editor({ setStatus, activeEntry }: { setStatus: (status: string) => void; activeEntry: DiaryUIEntry }) {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    ...updateDiaryMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['diary', 'list'] }),
  })
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const contentEditor = useEditor({
    extensions: [StarterKit.configure(starterKitProps), Placeholder.configure({ placeholder: "start writing — what's on your mind?" })],
    content: activeEntry.body || '',
    editable: isEditing,
  })

  const titleEditor = useEditor({
    extensions: [StarterKit.configure(starterKitProps), Placeholder.configure({ placeholder: 'give today a name…' })],
    content: activeEntry.title || '',
    editable: isEditing,
  })

  const queueSave = useMemo(
    () =>
      debounce(() => {
        if (!contentEditor || !titleEditor) return
        updateMutation.mutate({ id: activeEntry.id, title: titleEditor.getText(), content: contentEditor.getHTML() })
        setSavedAt(Date.now())
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeEntry.id, contentEditor],
  )

  useEffect(() => () => queueSave.cancel(), [queueSave])

  useEffect(() => {
    if (!contentEditor || !titleEditor) return
    contentEditor.on('update', queueSave)
    titleEditor.on('update', queueSave)
    return () => {
      contentEditor.off('update', queueSave)
      titleEditor.off('update', queueSave)
    }
  }, [contentEditor, titleEditor, queueSave])

  useEffect(() => {
    const ago = Math.floor((Date.now() - (savedAt || 0)) / 1000)
    let status = 'saved'
    if (updateMutation.isPending) status = 'saving…'
    else if (!savedAt) status = 'unsaved'
    else if (ago < 3) status = 'saved · just now'
    else if (ago < 60) status = `saved · ${ago}s ago`

    setStatus(status)
  }, [savedAt, updateMutation.isPending, setStatus])

  useEffect(() => {
    if (!contentEditor || !titleEditor) return
    contentEditor.commands.setContent(activeEntry.body || '')
    titleEditor.commands.setContent(activeEntry.title || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEntry.id, contentEditor, titleEditor])

  if (!contentEditor || !titleEditor) return null

  return (
    <div className="px-8 max-w-160 mx-auto flex flex-col pt-9 relative pb-80">
      <div
        className="text-[11px] uppercase tracking-[2px] mb-2 flex items-center gap-2.5"
        style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
      >
        {format(parseISO(activeEntry.date), 'EEEE, MMMM d, yyyy').toUpperCase()}
      </div>

      <EditorContent editor={titleEditor} className="editor-title" />

      <EditorContent editor={contentEditor} className="text-[19px] leading-[1.7] outline-none editor-body" />

      <EditorToolbar titleEditor={titleEditor} contentEditor={contentEditor} />

      <style>{`
        .editor-title .ProseMirror { font-family: var(--d-hand); font-size: 56px; font-weight: 600; line-height: 1.05; margin-bottom: 18px; outline: none; caret-color: var(--d-accent); color: var(--d-ink); }
        .editor-title .ProseMirror p { margin: 0; }
        .editor-title .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        .editor-body .ProseMirror { font-family: var(--d-serif); color: var(--d-ink); caret-color: var(--d-accent); min-height: 240px; outline: none; }
        .editor-body .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        .editor-body .ProseMirror p { margin: 0 0 0.9em; }
        .editor-body .ProseMirror p:last-child { margin-bottom: 0; }
      `}</style>
    </div>
  )
}

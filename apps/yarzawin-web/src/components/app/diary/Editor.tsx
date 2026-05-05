import { useMutation, useQueryClient } from '@tanstack/react-query'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { updateDiaryMutation } from '@yarzawin-web/lib/diary/queries'
import { format, parseISO } from 'date-fns'
import debounce from 'lodash/debounce'
import { useEffect, useState } from 'react'
import { DiaryListItemBadge } from './DiaryListItem'
import EditorToolbar from './EditorToolbar'
import FloatingToolbar from './FloatingToolbar'
import type { DiaryUIDiary } from './types'

const contentExtensions = [
  Document,
  Paragraph,
  Bold,
  Italic,
  Text,
  Link.configure({ openOnClick: false, enableClickSelection: true }),
  Placeholder.configure({ placeholder: "start writing — what's on your mind?" }),
  History,
]

export function Editor({ setStatus, activeDiary }: { setStatus: (status: string) => void; activeDiary: DiaryUIDiary }) {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    ...updateDiaryMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['diary', activeDiary.id] }),
  })
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const contentEditor = useEditor({
    extensions: contentExtensions,
    content: activeDiary.body || '',
    autofocus: 'end',
    // editable: false,
  })

  const titleEditor = useEditor({
    extensions: [Document, Paragraph, Text, Placeholder.configure({ placeholder: 'give today a name…' }), History],
    content: activeDiary.title || '',
    // editable: false,
  })

  useEffect(() => {
    if (!contentEditor || !titleEditor) return

    const queueSave = debounce(() => {
      updateMutation.mutate({ id: activeDiary.id, title: titleEditor.getText(), content: contentEditor.getHTML() })
      setSavedAt(Date.now())
    }, 1000)

    contentEditor.on('update', queueSave)
    titleEditor.on('update', queueSave)
    return () => {
      queueSave.flush()
      contentEditor.off('update', queueSave)
      titleEditor.off('update', queueSave)
      queueSave.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditor, titleEditor, activeDiary.id])

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
    contentEditor.commands.setContent(activeDiary.body || '', { emitUpdate: false })
    titleEditor.commands.setContent(activeDiary.title || '', { emitUpdate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDiary.id, contentEditor, titleEditor])

  if (!contentEditor || !titleEditor) return null

  const wordCount = activeDiary.bodyText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="px-4 max-w-160 mx-auto flex flex-col pt-9 relative pb-80">
      <div
        className="text-[11px] uppercase tracking-[2px] mb-2 flex items-center gap-2.5"
        style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}
      >
        {format(parseISO(activeDiary.date), 'EEEE, MMMM d, yyyy').toUpperCase()}
        <DiaryListItemBadge>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </DiaryListItemBadge>
      </div>

      <EditorContent editor={titleEditor} className="editor-title" />

      <EditorContent editor={contentEditor} className="text-[19px] leading-[1.7] outline-none editor-body" />
      <FloatingToolbar editor={contentEditor} />

      <EditorToolbar titleEditor={titleEditor} contentEditor={contentEditor} />

      <style>{`
        .editor-title .ProseMirror { font-family: var(--d-hand); font-size: 56px; font-weight: 600; line-height: 1.05; margin-bottom: 18px; outline: none; caret-color: var(--d-accent); color: var(--d-ink); }
        .editor-title .ProseMirror p { margin: 0; }
        .editor-title .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        .editor-body .ProseMirror { font-family: var(--d-serif); color: var(--d-ink); caret-color: var(--d-accent); min-height: 240px; outline: none; }
        .editor-body .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        .editor-body .ProseMirror p { margin: 0 0 0.9em; }
        .editor-body .ProseMirror p:last-child { margin-bottom: 0; }
        .editor-body a { text-decoration: underline; }
        .editor-body::selection { background: var(--d-accent); color: #fff; }
      `}</style>
    </div>
  )
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'
import HardBreak from '@tiptap/extension-hard-break'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Dropcursor } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import { updateDiaryMutation } from '@yarzawin-web/lib/diary/queries'
import { format, parseISO } from 'date-fns'
import debounce from 'lodash/debounce'
import { useEffect, useRef, useState } from 'react'
import { CaretLabel } from './CaretLabel'
import { DiaryListItemBadge } from './DiaryListItem'
import EditorToolbar from './EditorToolbar'
import FloatingToolbar from './FloatingToolbar'
import type { DiaryUIDiary } from './types'
import api from '@yarzawin-web/lib/api'

const uploadFile = async (file: File) => {
  const {
    data: { url: uploadUrl, key },
  } = await api.post('objects/gen-temp-upload-url', {
    filename: file.name,
    mimeType: file.type,
  })

  await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })

  const pubUrl = import.meta.env.S3_PUB_BUCKET_URL

  return pubUrl + key
}
console.log(import.meta.env.S3_PUB_BUCKET_URL)

export function Editor({ setStatus, activeDiary }: { setStatus: (status: string) => void; activeDiary: DiaryUIDiary }) {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    ...updateDiaryMutation(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['diary', activeDiary.id] }),
  })
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const activeDiaryRef = useRef(activeDiary)
  activeDiaryRef.current = activeDiary

  const contentExtensions = [
    Document,
    Paragraph,
    Bold,
    Italic,
    Text,
    Link.configure({ openOnClick: false, enableClickSelection: true }),
    Placeholder.configure({ placeholder: "start writing — what's on your mind?" }),
    History,
    HardBreak,
    Dropcursor,
    ImagePlaceholder,
    Image.configure({
      resize: {
        enabled: true,
        directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        alwaysPreserveAspectRatio: true,
        minHeight: 100,
      },
    }),
    FileHandler.configure({
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      onDrop(editor, files, pos) {
        files.forEach((file) => {
          uploadFile(file).then((url) => {
            editor
              .chain()
              .insertContentAt(pos, { type: 'image', attrs: { src: url } })
              .focus()
              .run()
          })
        })
      },
    }),
  ]

  const contentEditor = useEditor({
    extensions: contentExtensions,
    content: activeDiary.body || '',
    autofocus: 'start',
    editorProps: {
      handlePaste(_view, event) {
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => imageTypes.includes(f.type))
        if (!files.length) return false
        files.forEach((file) => {
          const id = Math.random().toString(36).slice(2)
          contentEditor?.chain().insertContent({ type: 'imagePlaceholder', attrs: { id } }).focus().run()
          uploadFile(file).then((uploadedUrl) => {
            if (!contentEditor) return
            const { state, view } = contentEditor
            const tr = state.tr
            state.doc.descendants((node, pos) => {
              if (node.type.name === 'imagePlaceholder' && node.attrs.id === id) {
                tr.replaceWith(pos, pos + node.nodeSize, state.schema.nodes.image.create({ src: uploadedUrl }))
              }
            })
            view.dispatch(tr)
          })
        })
        return true
      },
    },
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
      <CaretLabel editor={contentEditor} />

      <EditorToolbar
        titleEditor={titleEditor}
        contentEditor={contentEditor}
        onInsertImage={(src: string) => contentEditor.chain().focus().setImage({ src }).run()}
      />

      <style>{`
        .editor-title .ProseMirror { font-family: var(--d-hand); font-size: 56px; font-weight: 600; line-height: 1.05; margin-bottom: 18px; outline: none; caret-color: var(--d-accent); color: var(--d-ink); }
        .editor-title .ProseMirror p { margin: 0; }
        .editor-title .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        .editor-body .ProseMirror { font-family: var(--d-serif); color: var(--d-ink); caret-color: var(--d-accent); min-height: 240px; outline: none; }
        .editor-body .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        .editor-body .ProseMirror p { margin: 0 0 .8em; }
        .editor-body .ProseMirror p:last-child { margin-bottom: 0; }
        .editor-body a { text-decoration: underline; }
        .editor-body::selection { background: var(--d-accent); color: #fff; }
        [data-resize-wrapper] { display: inline-block; position: relative; }
        [data-resize-container] img { display: block; max-width: 100%; }
        [data-resize-container][data-resize-state="true"] { outline: 2px solid var(--d-accent); outline-offset: 2px; }
        [data-resize-handle] { width: 12px; height: 12px; border-radius: 50%; background: var(--d-accent); position: absolute; z-index: 10; }
        [data-resize-handle="top-left"] { top: 0; left: 0; transform: translate(-50%, -50%); cursor: nwse-resize; }
        [data-resize-handle="top-right"] { top: 0; right: 0; transform: translate(50%, -50%); cursor: nesw-resize; }
        [data-resize-handle="bottom-left"] { bottom: 0; left: 0; transform: translate(-50%, 50%); cursor: nesw-resize; }
        [data-resize-handle="bottom-right"] { bottom: 0; right: 0; transform: translate(50%, 50%); cursor: nwse-resize; }
      `}</style>
    </div>
  )
}

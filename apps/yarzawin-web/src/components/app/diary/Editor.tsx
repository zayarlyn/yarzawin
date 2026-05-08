import { useMutation, useQueryClient } from '@tanstack/react-query'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { DiaryImage } from './DiaryImageExtension'
import FileHandler from '@tiptap/extension-file-handler'
import HardBreak from '@tiptap/extension-hard-break'
import { Dropcursor } from '@tiptap/extensions'
import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react'
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
import './editor.css'

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const uploadFile = async (file: File) => {
  const { data } = await api.post('objects/gen-temp-upload-url', { filename: file.name, mimeType: file.type })
  await fetch(data.url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })

  return import.meta.env.VITE_S3_PUB_BUCKET_URL + data.key
}

const handleUploadAndInsert = async (files: File[], editor: TiptapEditor, insertAt?: number) => {
  files.forEach((file) => {
    const blobUrl = URL.createObjectURL(file)

    if (insertAt) {
      editor.chain().setTextSelection(insertAt).insertDiaryImage({ src: blobUrl }).focus().run()
    } else {
      editor.commands.insertDiaryImage({ src: blobUrl })
    }

    uploadFile(file).then((uploadedUrl) => {
      const transaction = editor.state.tr // all changes need to go through same transaction
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'diaryImage' && node.attrs.src === blobUrl) {
          transaction.setNodeMarkup(pos, undefined, { ...node.attrs, src: uploadedUrl })
        }
      })
      editor.view.dispatch(transaction)

      URL.revokeObjectURL(blobUrl)
    })
  })
}

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
    DiaryImage,
    FileHandler.configure({
      allowedMimeTypes,
      onDrop(editor, files, pos) {
        handleUploadAndInsert(files, editor, pos)
      },
    }),
  ]

  const contentEditor = useEditor({
    extensions: contentExtensions,
    content: activeDiary.body || '',
    autofocus: 'start',
    editorProps: {
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => allowedMimeTypes.includes(f.type))
        handleUploadAndInsert(files, contentEditor)
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
      updateMutation.mutate({ id: activeDiary.id, feature: activeDiary.feature, title: titleEditor.getText(), content: contentEditor.getHTML() })
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
        onInsertImage={(src: string) => contentEditor.chain().focus().insertDiaryImage({ src }).run()}
      />

      <style>{`
        
      `}</style>
    </div>
  )
}

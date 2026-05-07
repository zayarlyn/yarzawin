import { type Editor } from '@tiptap/react'
import { DiaryListItemBadge } from './DiaryListItem'
import { Button } from '@yarzawin-web/components/ui/button'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { useRef, useState } from 'react'

type props = {
  titleEditor: Editor
  contentEditor: Editor
  onInsertImage: (src: string) => void
}

const EditorToolbar = ({ titleEditor, contentEditor, onInsertImage }: props) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      onInsertImage(reader.result as string)
      setIsUploading(false)
    }
    reader.onerror = () => setIsUploading(false)
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-[max(4px,50%-372px)] w-fit">
      <DiaryListItemBadge className="bg-white! shadow-sm p-0">
        <div className="p-1 flex flex-col gap-2">
          <Button
            variant={contentEditor.isEditable ? 'default' : 'outline'}
            size="icon"
            className="rounded-full shadow-none cursor-pointer"
            onClick={() => {
              setIsEditing((p) => !p)
              titleEditor.setEditable(!isEditing)
              contentEditor.setEditable(!isEditing)
              contentEditor.chain().focus('end').run()
            }}
          >
            <Icon name={isEditing ? 'Check' : 'Pencil'} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-none cursor-pointer"
            disabled={isUploading || !contentEditor.isEditable}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="Image" />
          </Button>

          <Button
            variant={isFullscreen ? 'default' : 'outline'}
            size="icon"
            className="rounded-full shadow-none cursor-pointer"
            onClick={() => {
              setIsFullscreen((v) => !v)
              if (isFullscreen) return document.exitFullscreen()
              document.documentElement.requestFullscreen()
            }}
          >
            <Icon name="Eye" />
          </Button>
        </div>
      </DiaryListItemBadge>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}

export default EditorToolbar

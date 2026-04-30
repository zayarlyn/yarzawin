import { type Editor } from '@tiptap/react'
import { DiaryListItemBadge } from './DiaryListItem'
import { Button } from '@yarzawin-web/components/ui/button'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { useState } from 'react'

const EditorToolbar = ({ titleEditor, contentEditor }: { titleEditor: Editor; contentEditor: Editor }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-[max(4px,50%-372px)] w-fit">
      <DiaryListItemBadge className="bg-white! shadow-sm p-0">
        <div className="p-1 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-none cursor-pointer"
            onClick={() => {
              titleEditor.setEditable(true)
              contentEditor.setEditable(true)
              contentEditor.chain().focus('end').run()
            }}
          >
            <Icon name="Pencil" />
          </Button>
          <Button
            variant={isFullscreen ? 'default' : 'outline'}
            size="icon"
            className="rounded-full shadow-none cursor-pointer"
            onClick={() => {
              setIsFullscreen((v) => !v)
              if (isFullscreen) {
                return document.exitFullscreen()
              }
              document.documentElement.requestFullscreen()
            }}
          >
            <Icon name="Eye" />
          </Button>
        </div>
      </DiaryListItemBadge>
    </div>
  )
}

export default EditorToolbar

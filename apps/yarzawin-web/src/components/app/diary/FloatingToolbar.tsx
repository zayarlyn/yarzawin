import { Editor, Mark } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import { Button } from '@yarzawin-web/components/ui/button'
import { Bold, Italic, Link, Unlink } from 'lucide-react'
import { useState } from 'react'
import { DiaryListItemBadge } from './DiaryListItem'

function getAllMarksFromSelection(editor: Editor) {
  const { from, to } = editor.state.selection
  const marks = new Set()

  // Iterate through the selection to find all marks
  editor.state.doc.nodesBetween(from, to, (node) => {
    node.marks.forEach((mark) => {
      marks.add(mark)
    })
  })

  return Array.from(marks)
}

const defaultItems = [
  { icon: Bold, name: 'bold' },
  { icon: Italic, name: 'italic' },
  { icon: Unlink, name: 'link' },
]

const FloatingToolbar = ({ editor }: { editor: Editor }) => {
  const [marks, setMarks] = useState<Mark[]>([])
  const [items, setItems] = useState(defaultItems)

  const onSelectionUpdate = () => {
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ')

    const newItems = URL.canParse(selectedText)
      ? [...items.filter((item) => item.name !== 'link'), { icon: editor.isActive('link') ? Unlink : Link, name: 'link' }]
      : items.filter((item) => item.name !== 'link')

    const newMarks = getAllMarksFromSelection(editor).map((mark: any) => mark.type.name)

    setItems(newItems)
    setMarks(newMarks)
  }

  return (
    <BubbleMenu editor={editor} updateDelay={100} options={{ onUpdate: onSelectionUpdate, onHide: onSelectionUpdate }}>
      <DiaryListItemBadge className="bg-white! shadow-md p-0 rounded-xl">
        <div className="p-1 flex gap-2">
          {items.map((item) => (
            <Button
              key={item.icon.displayName}
              variant={marks.includes(item.name as any) ? 'default' : 'outline'}
              size="icon"
              className="rounded-lg shadow-none cursor-pointer"
              onClick={() => {
                if (item.name === 'link') {
                  if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run()
                  } else {
                    const { from, to } = editor.state.selection
                    const selectedText = editor.state.doc.textBetween(from, to, ' ')
                    editor.chain().focus().setLink({ href: selectedText }).run()
                  }
                } else {
                  editor.chain().focus().toggleMark(item.name).run()
                }
              }}
            >
              <Icon name={item.icon.displayName as any} />
            </Button>
          ))}
        </div>
      </DiaryListItemBadge>
    </BubbleMenu>
  )
}

export default FloatingToolbar

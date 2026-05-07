import { Node, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Image as ImageIcon } from 'lucide-react'
import { Spinner } from '../../ui/Spinner'

const ImagePlaceholderView = () => (
  <NodeViewWrapper>
    <div
      contentEditable={false}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '6px',
        background: 'var(--d-accent-tint)',
        border: '1px solid var(--d-accent-soft)',
        color: 'var(--d-ink-soft)',
        fontSize: '13px',
        fontFamily: 'var(--d-ui)',
        userSelect: 'none',
      }}
    >
      <ImageIcon size={16} style={{ color: 'var(--d-accent)' }} />
      <span>Uploading image…</span>
      <Spinner size="sm" />
    </div>
  </NodeViewWrapper>
)

export const ImagePlaceholder = Node.create({
  name: 'imagePlaceholder',
  group: 'block',
  atom: true,
  addAttributes() {
    return { id: { default: null } }
  },
  parseHTML() {
    return [{ tag: 'div[data-image-placeholder]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-image-placeholder': '' })]
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderView)
  },
})

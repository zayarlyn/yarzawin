import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    diaryImage: {
      insertDiaryImage: (options: { src: string; caption?: string }) => ReturnType
    }
  }
}

export const DiaryImage = Node.create({
  name: 'diaryImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
      tilt: { default: 'l' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: (element) => {
          const el = element as HTMLElement
          const img = el.querySelector('img')
          if (!img) return false
          const figcaption = el.querySelector('figcaption')
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || '',
            caption: figcaption?.textContent || '',
            tilt: el.classList.contains('tilt-r') ? 'r' : 'l',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, caption, tilt } = HTMLAttributes
    const figAttrs = mergeAttributes({ class: `tilt-${tilt}` })
    if (caption) {
      return ['figure', figAttrs, ['img', { src, alt: alt || '' }], ['figcaption', {}, caption]]
    }
    return ['figure', figAttrs, ['img', { src, alt: alt || '' }]]
  },

  addCommands() {
    return {
      insertDiaryImage:
        ({ src, caption = '' }: { src: string; caption?: string }) =>
        ({ commands }) => {
          const tilt = Math.random() < 0.5 ? 'l' : 'r'
          return commands.insertContent({
            type: this.name,
            attrs: { src, alt: '', caption, tilt },
          })
        },
    }
  },
})

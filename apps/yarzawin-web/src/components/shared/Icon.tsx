export type IconName =
  | 'bold' | 'italic' | 'underline'
  | 'h2' | 'quote' | 'list'
  | 'image' | 'sketch'
  | 'arrow' | 'arrowL'
  | 'plus' | 'x'
  | 'search' | 'trash'
  | 'eye' | 'edit'
  | 'check' | 'book'
  | 'sun' | 'pencil' | 'eraser' | 'undo'

interface IconProps {
  name: IconName
  size?: number
}

const paths: Record<IconName, React.ReactNode> = {
  bold: <><path d="M5 3h6a3.5 3.5 0 0 1 0 7H5z"/><path d="M5 10h7a3.5 3.5 0 0 1 0 7H5z"/></>,
  italic: <><line x1="12" y1="3" x2="8" y2="17"/><line x1="6" y1="3" x2="14" y2="3"/><line x1="6" y1="17" x2="14" y2="17"/></>,
  underline: <><path d="M5 3v7a5 5 0 0 0 10 0V3"/><line x1="3" y1="18" x2="17" y2="18"/></>,
  h2: <><path d="M3 4v12M11 4v12M3 10h8"/></>,
  quote: <><path d="M5 6a3 3 0 0 0-3 3v5h5V9H4"/><path d="M14 6a3 3 0 0 0-3 3v5h5V9h-3"/></>,
  list: <><line x1="7" y1="5" x2="17" y2="5"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="7" y1="15" x2="17" y2="15"/><circle cx="3.5" cy="5" r="1"/><circle cx="3.5" cy="10" r="1"/><circle cx="3.5" cy="15" r="1"/></>,
  image: <><rect x="2" y="3" width="16" height="14" rx="1.5"/><circle cx="7" cy="8" r="1.5"/><path d="M2 14l5-5 4 4 3-3 4 4"/></>,
  sketch: <><path d="M3 17l4-1 9-9-3-3-9 9z"/><path d="M12 6l3 3"/></>,
  arrow: <><line x1="3" y1="10" x2="17" y2="10"/><polyline points="12 5 17 10 12 15"/></>,
  arrowL: <><line x1="17" y1="10" x2="3" y2="10"/><polyline points="8 5 3 10 8 15"/></>,
  plus: <><line x1="10" y1="3" x2="10" y2="17"/><line x1="3" y1="10" x2="17" y2="10"/></>,
  x: <><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></>,
  search: <><circle cx="9" cy="9" r="6"/><line x1="13.5" y1="13.5" x2="17" y2="17"/></>,
  trash: <><polyline points="3 5 17 5"/><path d="M5 5v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5"/><path d="M8 5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/></>,
  eye: <><path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"/><circle cx="10" cy="10" r="2.5"/></>,
  edit: <><path d="M3 17l4-1 9-9-3-3-9 9z"/></>,
  check: <><polyline points="3 10 8 15 17 5"/></>,
  book: <><path d="M3 4h6a3 3 0 0 1 3 3v10a2 2 0 0 0-2-2H3z"/><path d="M17 4h-6a3 3 0 0 0-3 3v10a2 2 0 0 1 2-2h7z"/></>,
  sun: <><circle cx="10" cy="10" r="3.5"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="10" y1="16" x2="10" y2="18"/><line x1="2" y1="10" x2="4" y2="10"/><line x1="16" y1="10" x2="18" y2="10"/><line x1="4.5" y1="4.5" x2="6" y2="6"/><line x1="14" y1="14" x2="15.5" y2="15.5"/><line x1="4.5" y1="15.5" x2="6" y2="14"/><line x1="14" y1="6" x2="15.5" y2="4.5"/></>,
  pencil: <><path d="M3 17l4-1 9-9-3-3-9 9z"/></>,
  eraser: <><path d="M11 3l6 6-7 7H4v-5z"/><line x1="7" y1="9" x2="13" y2="15"/></>,
  undo: <><polyline points="6 4 3 7 6 10"/><path d="M3 7h8a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H7"/></>,
}

export function Icon({ name, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {paths[name]}
    </svg>
  )
}

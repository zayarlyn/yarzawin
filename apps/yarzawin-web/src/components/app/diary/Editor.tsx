import { useState, useRef, useEffect, useCallback } from 'react'
import { useDiaryContext } from './DiaryContext'
import { Icon } from '@yarzawin-web/components/shared/Icon'

export function Editor() {
  const { activeEntry, saveEntry, setView, isLoading } = useDiaryContext()
  const [title, setTitle] = useState(activeEntry?.title ?? '')
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false })
  const [dragOver, setDragOver] = useState(false)
  const [sketchOpen, setSketchOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Set body innerHTML only when entry id changes
  useEffect(() => {
    if (bodyRef.current && activeEntry) {
      bodyRef.current.innerHTML = activeEntry.body || ''
    }
  }, [activeEntry?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync title from entry when switching entries
  useEffect(() => {
    setTitle(activeEntry?.title ?? '')
    if (titleRef.current && activeEntry) {
      titleRef.current.textContent = activeEntry.title
    }
  }, [activeEntry?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current) }, [])

  const persist = useCallback(() => {
    if (!activeEntry) return
    const html = bodyRef.current?.innerHTML || ''
    const text = bodyRef.current?.innerText || ''
    saveEntry({ ...activeEntry, title, body: html, bodyText: text, updatedAt: Date.now() })
    setSavedAt(Date.now())
  }, [activeEntry, title, saveEntry])

  const queueSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(persist, 400)
  }, [persist])

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    })
  }, [])

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection()
      if (sel && bodyRef.current?.contains(sel.anchorNode)) updateActiveFormats()
    }
    document.addEventListener('selectionchange', handler)
    return () => document.removeEventListener('selectionchange', handler)
  }, [updateActiveFormats])

  const exec = (cmd: string, val?: string) => {
    bodyRef.current?.focus()
    document.execCommand(cmd, false, val)
    updateActiveFormats()
    queueSave()
  }

  const insertImage = (src: string, caption = '') => {
    bodyRef.current?.focus()
    const sel = window.getSelection()
    if (sel && !bodyRef.current?.contains(sel.anchorNode)) {
      const range = document.createRange()
      range.selectNodeContents(bodyRef.current!)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    const tilt = Math.random() < 0.5 ? 'tilt-l' : 'tilt-r'
    const html = `<figure class="${tilt}" contenteditable="false"><img src="${src}" alt=""/>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure><p><br/></p>`
    document.execCommand('insertHTML', false, html)
    queueSave()
  }

  const insertSketch = (dataUrl: string) => {
    bodyRef.current?.focus()
    const sel = window.getSelection()
    if (sel && !bodyRef.current?.contains(sel.anchorNode)) {
      const range = document.createRange()
      range.selectNodeContents(bodyRef.current!)
      range.collapse(false)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    document.execCommand('insertHTML', false, `<img src="${dataUrl}" class="sketch-block" alt="sketch"/><p><br/></p>`)
    queueSave()
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).filter((f) => f.type.startsWith('image/')).forEach((f) => {
      const reader = new FileReader()
      reader.onload = () => insertImage(reader.result as string)
      reader.readAsDataURL(f)
    })
  }

  if (!activeEntry) return null

  const d = new Date(activeEntry.date + 'T00:00:00')
  const dateStr = d
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()

  const status = (() => {
    if (isLoading) return 'saving…'
    if (!savedAt) return 'unsaved'
    const ago = Math.floor((Date.now() - savedAt) / 1000)
    if (ago < 3) return 'saved · just now'
    if (ago < 60) return `saved · ${ago}s ago`
    return 'saved'
  })()

  return (
    <div
      className="flex flex-col flex-1 min-h-0 w-full relative"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false) }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
    >
      {/* toolbar */}
      <div
        className="flex items-center gap-1 px-[22px] py-2 flex-shrink-0 z-[4]"
        style={{ borderBottom: '1px solid var(--d-rule)', background: 'var(--d-paper)' }}
      >
        <ToolBtn onClick={() => setView('list')} label="entries">
          <Icon name="arrowL" size={13} /> <span className="text-[12px]" style={{ fontFamily: 'var(--d-ui)' }}>entries</span>
        </ToolBtn>
        <Divider />
        <div className="flex gap-0.5">
          <ToolBtn active={activeFormats.bold} onClick={() => exec('bold')} title="Bold" className="font-bold">B</ToolBtn>
          <ToolBtn active={activeFormats.italic} onClick={() => exec('italic')} title="Italic" className="italic" style={{ fontFamily: 'var(--d-serif)' }}>I</ToolBtn>
          <ToolBtn active={activeFormats.underline} onClick={() => exec('underline')} title="Underline" className="underline underline-offset-1">U</ToolBtn>
        </div>
        <Divider />
        <div className="flex gap-0.5">
          <ToolBtn onClick={() => exec('formatBlock', 'h2')} title="Heading"><Icon name="h2" size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('formatBlock', 'blockquote')} title="Quote"><Icon name="quote" size={14} /></ToolBtn>
          <ToolBtn onClick={() => exec('insertUnorderedList')} title="List"><Icon name="list" size={14} /></ToolBtn>
        </div>
        <Divider />
        <div className="flex gap-0.5">
          <ToolBtn onClick={() => fileInputRef.current?.click()} title="Add photo"><Icon name="image" size={15} /></ToolBtn>
          <ToolBtn onClick={() => setSketchOpen(true)} title="Add sketch"><Icon name="sketch" size={15} /></ToolBtn>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[11px] tracking-[0.5px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
          {status}
        </div>
        <Divider />
        <ToolBtn onClick={() => setView('read', activeEntry.id)} label="read">
          <Icon name="eye" size={13} /> <span className="text-[12px]" style={{ fontFamily: 'var(--d-ui)' }}>read</span>
        </ToolBtn>
      </div>

      {/* page */}
      <div
        className="flex-1 overflow-y-auto flex justify-center px-6 py-9 pb-20"
        style={{
          backgroundColor: 'var(--d-paper)',
          backgroundImage: 'var(--d-pattern), linear-gradient(to bottom, rgba(0,0,0,0.02), transparent 80px)',
          backgroundSize: 'var(--d-pattern-size), auto',
        }}
      >
        <div className="w-full max-w-[640px]">
          <div className="text-[11px] uppercase tracking-[2px] mb-2 flex items-center gap-2.5" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
            {dateStr}
            <span className="inline-flex items-center gap-1 text-[16px] normal-case tracking-normal" style={{ fontFamily: 'var(--d-hand)' }}>
              <Icon name="sun" size={14} />
            </span>
          </div>

          <div
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="give today a name…"
            className="text-[56px] font-semibold leading-[1.05] mb-[18px] outline-none border-none editor-title"
            style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)', caretColor: 'var(--d-accent)' }}
            onInput={(e) => { setTitle(e.currentTarget.textContent || ''); queueSave() }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); bodyRef.current?.focus() } }}
          />

          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="start writing — what's on your mind?"
            className="text-[19px] leading-[1.7] outline-none min-h-[240px] editor-body"
            style={{ fontFamily: 'var(--d-serif)', color: 'var(--d-ink)', caretColor: 'var(--d-accent)' }}
            onInput={queueSave}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
          />
        </div>
      </div>

      {/* drop overlay */}
      {dragOver && (
        <div
          className="absolute inset-0 flex items-center justify-center text-[32px] pointer-events-none z-10 rounded-lg"
          style={{
            background: 'rgba(184,101,30,0.10)',
            border: '2px dashed var(--d-accent)',
            fontFamily: 'var(--d-hand)',
            color: 'var(--d-accent)',
          }}
        >
          drop a photo to add it
        </div>
      )}

      {sketchOpen && (
        <SketchModal
          onClose={() => setSketchOpen(false)}
          onInsert={(dataUrl) => { insertSketch(dataUrl); setSketchOpen(false) }}
        />
      )}

      <style>{`
        .editor-title:empty::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; }
        .editor-body:empty::before { content: attr(data-placeholder); color: var(--d-ink-faint); font-style: italic; pointer-events: none; }
        .editor-body p { margin: 0 0 0.9em; }
        .editor-body p:last-child { margin-bottom: 0; }
        .editor-body h2 { font-family: var(--d-serif); font-size: 24px; font-weight: 600; margin: 1em 0 0.4em; }
        .editor-body blockquote { border-left: 3px solid var(--d-accent); padding: 4px 0 4px 18px; margin: 0.6em 0; font-style: italic; color: var(--d-ink-soft); }
        .editor-body ul { margin: 0.6em 0; padding-left: 24px; }
        .editor-body li { margin: 0.2em 0; }
        .editor-body img { max-width: 100%; border-radius: 3px; margin: 1em 0; border: 1px solid var(--d-paper-edge); box-shadow: var(--d-shadow-md); }
        .editor-body figure { margin: 1.2em 0; display: block; }
        .editor-body figure.tilt-l { transform: rotate(-1deg); }
        .editor-body figure.tilt-r { transform: rotate(1deg); }
        .editor-body figcaption { font-family: var(--d-hand); font-size: 17px; color: var(--d-ink-soft); text-align: center; margin-top: 6px; }
        .editor-body .sketch-block { display: block; margin: 1.2em auto; background: #fdfaf2; border: 1px solid var(--d-paper-edge); border-radius: 3px; box-shadow: var(--d-shadow-sm); max-width: 100%; }
      `}</style>
    </div>
  )
}

function Divider() {
  return <span className="w-px h-[22px] mx-2 flex-shrink-0" style={{ background: 'var(--d-rule)' }} />
}

function ToolBtn({ children, active, onClick, title, label, className = '', style: extraStyle }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  title?: string
  label?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={label || title}
      className={`flex items-center justify-center gap-1 w-8 h-8 rounded-md border-none cursor-pointer transition-colors text-[14px] ${className}`}
      style={{
        background: active ? 'var(--d-ink)' : 'transparent',
        color: active ? 'var(--d-paper)' : 'var(--d-ink)',
        ...extraStyle,
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(42,36,28,0.08)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

// ─── Sketch Modal ───────────────────────────────────────────────────────────

const COLORS = ['#2a241c', '#b8651e', '#6a8a4a', '#3a6a8a', '#a04a6a', '#d9b13a']
const SIZES = [1.2, 2.5, 4.5, 7]

function SketchModal({ onClose, onInsert }: { onClose: () => void; onInsert: (url: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState('#2a241c')
  const [size, setSize] = useState(2.5)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const strokes = useRef<string[]>([])

  useEffect(() => {
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fdfaf2'
    ctx.fillRect(0, 0, c.width, c.height)
    strokes.current.push(c.toDataURL())
  }, [])

  const saveSnapshot = () => {
    const c = canvasRef.current
    if (!c) return
    strokes.current.push(c.toDataURL())
    if (strokes.current.length > 30) strokes.current.shift()
  }

  const undo = () => {
    if (strokes.current.length <= 1) return
    strokes.current.pop()
    const data = strokes.current[strokes.current.length - 1]
    const img = new Image()
    img.onload = () => {
      const c = canvasRef.current!
      c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
      c.getContext('2d')!.drawImage(img, 0, 0)
    }
    img.src = data
  }

  const clear = () => {
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fdfaf2'
    ctx.fillRect(0, 0, c.width, c.height)
    saveSnapshot()
  }

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (c.width / rect.width),
      y: (e.clientY - rect.top) * (c.height / rect.height),
    }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    drawing.current = true
    last.current = getPos(e)
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    ctx.beginPath()
    ctx.fillStyle = tool === 'eraser' ? '#fdfaf2' : color
    ctx.arc(last.current.x, last.current.y, size / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return
    e.preventDefault()
    const pos = getPos(e)
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    ctx.strokeStyle = tool === 'eraser' ? '#fdfaf2' : color
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    last.current = pos
  }

  const onPointerUp = () => {
    if (drawing.current) { drawing.current = false; saveSnapshot() }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: 'rgba(42,36,28,0.55)', backdropFilter: 'blur(8px)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="flex flex-col gap-3.5 rounded-[10px] p-5 w-full max-w-[720px]"
        style={{ background: 'var(--d-paper)', boxShadow: 'var(--d-shadow-lg)' }}
      >
        {/* head */}
        <div className="flex items-center gap-2.5">
          <h3 className="text-[28px] font-semibold m-0" style={{ fontFamily: 'var(--d-hand)' }}>sketch</h3>
          <span className="ml-auto text-[12px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>draw something</span>
          <button onClick={onClose} className="flex items-center justify-center w-7 h-7 rounded-md cursor-pointer hover:bg-black/5 border-none bg-transparent" style={{ color: 'var(--d-ink)' }}>
            <Icon name="x" size={13} />
          </button>
        </div>

        {/* tools */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ border: '1px solid var(--d-rule)', background: 'rgba(255,255,255,0.5)' }}>
            {(['pen', 'eraser'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTool(t)}
                className="flex items-center justify-center w-[26px] h-[26px] rounded-md border-none cursor-pointer transition-colors"
                style={{ background: tool === t ? 'var(--d-ink)' : 'transparent', color: tool === t ? 'var(--d-paper)' : 'var(--d-ink)' }}
              >
                <Icon name={t === 'pen' ? 'pencil' : 'eraser'} size={14} />
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => { setColor(c); setTool('pen') }}
                className="w-[22px] h-[22px] rounded-full cursor-pointer transition-transform hover:scale-110"
                style={{
                  background: c,
                  border: '1.5px solid var(--d-rule)',
                  boxShadow: color === c && tool === 'pen' ? `0 0 0 2px var(--d-paper), 0 0 0 3.5px var(--d-ink)` : 'none',
                }}
              />
            ))}
          </div>
          <div className="flex gap-1 items-center">
            {SIZES.map((s) => (
              <div
                key={s}
                onClick={() => setSize(s)}
                className="rounded-full cursor-pointer flex-shrink-0"
                style={{
                  width: s * 2 + 8,
                  height: s * 2 + 8,
                  background: 'var(--d-ink)',
                  border: `1.5px solid ${size === s ? 'var(--d-accent)' : 'transparent'}`,
                }}
              />
            ))}
          </div>
          <button onClick={undo} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] cursor-pointer hover:bg-black/5 border-transparent border" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}>
            <Icon name="undo" size={13} /> undo
          </button>
          <button onClick={clear} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] cursor-pointer hover:bg-black/5 border-transparent border" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}>
            <Icon name="trash" size={13} /> clear
          </button>
        </div>

        {/* canvas */}
        <div className="rounded overflow-hidden" style={{ border: '1px solid var(--d-paper-edge)', background: '#fdfaf2', boxShadow: 'inset 0 1px 2px rgba(42,36,28,0.06)' }}>
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            className="block w-full h-auto cursor-crosshair touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>

        {/* actions */}
        <div className="flex justify-between gap-2.5">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] cursor-pointer hover:bg-black/5 border" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)', borderColor: 'var(--d-ink)' }}>
            cancel
          </button>
          <button
            onClick={() => onInsert(canvasRef.current!.toDataURL('image/png'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium cursor-pointer hover:opacity-90 active:translate-y-px"
            style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-accent)', color: '#fff', border: '1px solid var(--d-accent)' }}
          >
            <Icon name="check" size={14} /> add to entry
          </button>
        </div>
      </div>
    </div>
  )
}

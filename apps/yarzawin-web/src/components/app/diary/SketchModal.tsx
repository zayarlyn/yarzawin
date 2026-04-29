import { useState, useRef, useEffect } from 'react'
import { Icon } from '@yarzawin-web/components/shared/Icon'

const COLORS = ['#2a241c', '#b8651e', '#6a8a4a', '#3a6a8a', '#a04a6a', '#d9b13a']
const SIZES = [1.2, 2.5, 4.5, 7]

export function SketchModal({ onClose, onInsert }: { onClose: () => void; onInsert: (url: string) => void }) {
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
    if (drawing.current) {
      drawing.current = false
      saveSnapshot()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: 'rgba(42,36,28,0.55)', backdropFilter: 'blur(8px)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="flex flex-col gap-3.5 rounded-[10px] p-5 w-full max-w-[720px]"
        style={{ background: 'var(--d-paper)', boxShadow: 'var(--d-shadow-lg)' }}
      >
        {/* head */}
        <div className="flex items-center gap-2.5">
          <h3 className="text-[28px] font-semibold m-0" style={{ fontFamily: 'var(--d-hand)' }}>
            sketch
          </h3>
          <span className="ml-auto text-[12px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
            draw something
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md cursor-pointer hover:bg-black/5 border-none bg-transparent"
            style={{ color: 'var(--d-ink)' }}
          >
            <Icon name="x" size={13} />
          </button>
        </div>

        {/* tools */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ border: '1px solid var(--d-rule)', background: 'rgba(255,255,255,0.5)' }}
          >
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
                onClick={() => {
                  setColor(c)
                  setTool('pen')
                }}
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
          <button
            onClick={undo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] cursor-pointer hover:bg-black/5 border-transparent border"
            style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
          >
            <Icon name="undo" size={13} /> undo
          </button>
          <button
            onClick={clear}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] cursor-pointer hover:bg-black/5 border-transparent border"
            style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}
          >
            <Icon name="trash" size={13} /> clear
          </button>
        </div>

        {/* canvas */}
        <div
          className="rounded overflow-hidden"
          style={{ border: '1px solid var(--d-paper-edge)', background: '#fdfaf2', boxShadow: 'inset 0 1px 2px rgba(42,36,28,0.06)' }}
        >
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
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] cursor-pointer hover:bg-black/5 border"
            style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)', borderColor: 'var(--d-ink)' }}
          >
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

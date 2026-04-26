import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useDiaryContext } from './DiaryContext'
import { Icon } from '@yarzawin-web/components/shared/Icon'
import type { PaperType } from './types'

const PAPER_CHOICES: { id: PaperType; name: string; bg: string; edge: string; accent: string; pattern?: string; patternSize?: string }[] = [
  { id: 'cream', name: 'Cream', bg: '#f5efe1', edge: '#d9cfb6', accent: '#b8651e' },
  {
    id: 'lined', name: 'Lined', bg: '#f6f0e2', edge: '#d6cdb4', accent: '#b8651e',
    pattern: 'repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(42,36,28,0.13) 23px, rgba(42,36,28,0.13) 24px)',
  },
  {
    id: 'dotted', name: 'Dotted', bg: '#f4eedc', edge: '#d6cdb4', accent: '#7a6a4a',
    pattern: 'radial-gradient(circle, rgba(42,36,28,0.16) 1px, transparent 1.2px)',
    patternSize: '16px 16px',
  },
  { id: 'bone', name: 'Bone', bg: '#ede4d0', edge: '#cfc4a8', accent: '#a85a1c' },
]

export function Onboarding() {
  const { completeOnboarding } = useDiaryContext()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [paper, setPaper] = useState<PaperType>('cream')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === 1) setTimeout(() => inputRef.current?.focus(), 350)
  }, [step])

  const next = () => {
    if (step < 2) setStep(step + 1)
    else completeOnboarding(name.trim() || 'friend', paper)
  }
  const back = () => step > 0 && setStep(step - 1)
  const handleKey = (e: KeyboardEvent) => { if (e.key === 'Enter') next() }

  return (
    <div
      className="flex-1 flex items-center justify-center p-10 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--d-paper)',
        backgroundImage: 'var(--d-pattern), radial-gradient(ellipse at top right, rgba(184,101,30,0.08), transparent 50%), radial-gradient(ellipse at bottom left, rgba(184,101,30,0.05), transparent 50%)',
        backgroundSize: 'var(--d-pattern-size), auto, auto',
      }}
    >
      {/* decorative SVGs */}
      <svg className="absolute top-10 left-12 opacity-50 pointer-events-none" style={{ transform: 'rotate(-8deg)' }} width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#b8651e" strokeWidth="1.4" strokeLinecap="round">
        <path d="M10 40 Q 30 10 50 30 T 75 25" />
        <circle cx="20" cy="60" r="6" />
        <path d="M55 55 l 8 -3 l -2 8 z" />
      </svg>
      <svg className="absolute bottom-12 right-16 opacity-50 pointer-events-none" style={{ transform: 'rotate(6deg)' }} width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="#b8651e" strokeWidth="1.4" strokeLinecap="round">
        <path d="M5 50 Q 25 10 60 30 T 95 50" />
        <path d="M75 60 q 10 5 20 0" />
        <path d="M30 65 l 6 -2 l -1 6 z" />
      </svg>

      <div className="w-full max-w-[460px] text-center relative z-10">
        {step === 0 && (
          <>
            <div className="text-[11px] tracking-[2.5px] uppercase mb-[18px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
              a small place for thoughts
            </div>
            <h1 className="text-[76px] font-semibold leading-[0.95] mb-5" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
              hello, <span style={{ color: 'var(--d-accent)' }}>friend</span>.
            </h1>
            <p className="text-[18px] leading-[1.55] mx-auto mb-9 max-w-[380px]" style={{ fontFamily: 'var(--d-serif)', color: 'var(--d-ink-soft)' }}>
              Welcome to <em>my-diary</em> — a quiet little corner of the internet that's just yours.
              Write what you want, when you want. Nothing leaves this page.
            </p>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 px-[22px] py-[11px] rounded-full text-[14px] font-medium cursor-pointer transition-all active:translate-y-px"
              style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-ink)', color: 'var(--d-paper)', border: '1px solid var(--d-ink)' }}
            >
              Begin <Icon name="arrow" size={14} />
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-[11px] tracking-[2.5px] uppercase mb-[18px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
              step 1 of 2
            </div>
            <h1 className="text-[76px] font-semibold leading-[0.95] mb-5" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
              what do we<br />call you?
            </h1>
            <div className="mx-auto mb-7 max-w-[320px] text-left">
              <div className="text-[11px] tracking-[1.5px] uppercase mb-[6px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
                your name
              </div>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKey}
                placeholder="type something…"
                maxLength={40}
                className="w-full bg-transparent outline-none text-[30px] py-1 px-0.5 pb-1.5"
                style={{
                  fontFamily: 'var(--d-hand)',
                  color: 'var(--d-ink)',
                  border: 'none',
                  borderBottom: '1.5px solid var(--d-ink)',
                }}
              />
            </div>
            <div className="flex gap-2.5 justify-center">
              <button onClick={back} className="inline-flex items-center gap-2 px-[14px] py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px border-transparent border" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}>
                <Icon name="arrowL" size={13} /> back
              </button>
              <button onClick={next} className="inline-flex items-center gap-2 px-[22px] py-[11px] rounded-full text-[14px] font-medium cursor-pointer transition-all active:translate-y-px" style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-ink)', color: 'var(--d-paper)', border: '1px solid var(--d-ink)' }}>
                {name.trim() ? <>Nice to meet you <Icon name="arrow" size={14} /></> : <>Skip <Icon name="arrow" size={14} /></>}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-[11px] tracking-[2.5px] uppercase mb-[18px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
              step 2 of 2
            </div>
            <h1 className="text-[60px] font-semibold leading-[0.95] mb-5" style={{ fontFamily: 'var(--d-hand)', color: 'var(--d-ink)' }}>
              pick your<br />paper.
            </h1>
            <p className="text-[18px] leading-[1.55] mb-7" style={{ fontFamily: 'var(--d-serif)', color: 'var(--d-ink-soft)' }}>
              You can change this any time.
            </p>
            <div className="flex gap-3 justify-center mb-6 flex-wrap">
              {PAPER_CHOICES.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-6">
                  <div
                    onClick={() => setPaper(p.id)}
                    className="w-16 h-16 rounded-[8px] cursor-pointer transition-transform hover:-translate-y-0.5"
                    style={{
                      background: p.bg,
                      backgroundImage: p.pattern || 'none',
                      backgroundSize: p.patternSize || 'auto',
                      border: paper === p.id ? `1.5px solid ${p.accent}` : `1.5px solid ${p.edge}`,
                      boxShadow: paper === p.id ? `0 0 0 3px ${p.accent}33` : 'none',
                    }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.5px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 justify-center mt-[18px]">
              <button onClick={back} className="inline-flex items-center gap-2 px-[14px] py-2 rounded-full text-[13px] font-medium cursor-pointer transition-all hover:bg-black/5 active:translate-y-px border-transparent border" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink)' }}>
                <Icon name="arrowL" size={13} /> back
              </button>
              <button onClick={next} className="inline-flex items-center gap-2 px-[22px] py-[11px] rounded-full text-[14px] font-medium cursor-pointer transition-all active:translate-y-px" style={{ fontFamily: 'var(--d-ui)', background: 'var(--d-accent)', color: '#fff', border: '1px solid var(--d-accent)' }}>
                Open my diary <Icon name="arrow" size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-7 h-[3px] rounded-sm transition-all"
            style={{ background: step >= i ? 'var(--d-ink)' : 'var(--d-ink-faint)', opacity: step >= i ? 1 : 0.4 }}
          />
        ))}
      </div>
    </div>
  )
}

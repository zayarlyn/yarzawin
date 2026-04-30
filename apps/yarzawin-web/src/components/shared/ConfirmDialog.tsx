import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { Button } from '@yarzawin-web/components/ui/button'
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from '@yarzawin-web/components/ui/dialog'
import { Spinner } from '../ui/Spinner'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  entryTitle: string
  mutating?: boolean
}

export function ConfirmDialog(props: Props) {
  const { open, onOpenChange, onConfirm, entryTitle, mutating } = props
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-[6px]" style={{ background: 'rgba(42,36,28,0.25)' }} />
        <DialogPrimitive.Content
          className="p-4 fixed left-[50%] top-[50%] z-50 w-11/12 max-w-90 origin-center translate-x-[-50%] translate-y-[-50%] rounded-[6px] border overflow-hidden duration-200"
          //  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          style={{
            background: '#fff',
            // borderColor: 'var(--d-paper-cream-edge)',
            boxShadow: 'var(--d-shadow-lg)',
          }}
        >
          {/* <div> */}
          <div className="mb-2 tracking-[2px] uppercase text-[10px]" style={{ fontFamily: 'var(--d-ui)', color: 'var(--d-ink-soft)' }}>
            remove entry
          </div>
          <DialogTitle
            className="m-0 mb-3 font-semibold leading-none"
            style={{ fontFamily: 'var(--d-hand)', fontSize: 38, color: 'var(--d-ink)' }}
          >
            Are you sure?
          </DialogTitle>
          <DialogDescription
            className="m-0"
            style={{ fontFamily: 'var(--d-serif)', fontSize: 15, lineHeight: 1.55, color: 'var(--d-ink-soft)' }}
          >
            This will permanently remove &ldquo;
            <strong style={{ color: 'var(--d-ink)' }}>{entryTitle}</strong>
            &rdquo;. You can&apos;t undo this.
          </DialogDescription>
          {/* </div> */}
          <div className="flex justify-end gap-2 mt-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm" disabled={mutating}>
                cancel
              </Button>
            </DialogClose>
            <Button size="sm" onClick={onConfirm} style={{ backgroundColor: 'var(--d-primary)' }} disabled={mutating}>
              {mutating ? <Spinner size="sm" className="mx-3.5" /> : 'remove'}
            </Button>
          </div>
          <DialogClose
            className="cursor-pointer absolute right-3 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-black/6"
            style={{ color: 'var(--d-ink-soft)' }}
            disabled={mutating}
          >
            <X size={14} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

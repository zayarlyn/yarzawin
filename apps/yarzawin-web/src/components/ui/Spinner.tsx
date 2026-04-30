import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@yarzawin-web/lib/utils'

const spinnerVariants = cva('animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(({ className, size, ...props }, ref) => {
  return <span ref={ref} role="status" aria-label="Loading" className={cn(spinnerVariants({ size }), className)} {...props} />
})
Spinner.displayName = 'Spinner'

export { Spinner, spinnerVariants }

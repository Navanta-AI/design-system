'use client'

import * as React from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '../utils/cn'

export interface DialogProps {
  /** Controlled open state */
  open?: boolean
  /** Callback fired when the dialog should close */
  onClose?: () => void
  /** Dialog content */
  children?: React.ReactNode
  /** Maximum width of the dialog */
  size?: 'sm' | 'md' | 'lg' | 'full'
  /** If true, clicking on the overlay closes the dialog */
  closeOnOverlay?: boolean
  /** If true, pressing Escape closes the dialog */
  closeOnEscape?: boolean
  /** If true, renders a close button in the top-right corner */
  showCloseButton?: boolean
  /** Additional CSS classes for the dialog panel */
  className?: string
}

const DialogSizeContext = React.createContext<DialogProps['size']>('md')
const DialogHasBodyContext = React.createContext(true)

function hasDialogBodyChild(node: React.ReactNode): boolean {
  let found = false

  React.Children.forEach(node, (child) => {
    if (found || !React.isValidElement(child)) return

    const childType = child.type as { displayName?: string } | string
    const displayName = typeof childType === 'string' ? childType : childType?.displayName

    if (displayName === 'DialogBody') {
      found = true
      return
    }

    if (child.props?.children) {
      found = hasDialogBodyChild(child.props.children)
    }
  })

  return found
}

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const dialogSize = React.useContext(DialogSizeContext)
    const hasBody = React.useContext(DialogHasBodyContext)

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-1.5 bg-secondary/40 px-6 py-5 text-left',
          hasBody && 'border-b border-border',
          dialogSize === 'sm' && 'items-center bg-background px-8 py-8 text-center',
          className
        )}
        {...props}
      />
    )
  }
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-[18px] font-semibold leading-[1.2] tracking-tight', className)}
      {...props}
    />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-[14px] leading-[1.4] text-muted-foreground', className)}
      {...props}
    />
  )
)
DialogDescription.displayName = 'DialogDescription'

export interface DialogIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'secondary'
}

const DialogIcon = React.forwardRef<HTMLSpanElement, DialogIconProps>(
  ({ className, tone = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&>svg]:size-6',
        tone === 'secondary' ? 'text-muted-foreground' : 'text-foreground',
        className
      )}
      {...props}
    />
  )
)
DialogIcon.displayName = 'DialogIcon'

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-6', className)} {...props} />
  )
)
DialogBody.displayName = 'DialogBody'

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const dialogSize = React.useContext(DialogSizeContext)

    return (
      <div
        ref={ref}
        className={cn(
          'h-[60px] border-t border-border bg-[#f9f9f9] dark:bg-zinc-950',
          dialogSize === 'sm'
            ? 'grid grid-cols-2 items-center gap-3 px-6 [&>*]:w-full'
            : 'flex flex-col-reverse items-center gap-2 px-6 sm:flex-row sm:justify-end',
          className
        )}
        {...props}
      />
    )
  }
)
DialogFooter.displayName = 'DialogFooter'

const sizeClasses = {
  sm: 'sm:max-w-[360px]',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-[680px]',
  full: 'max-w-none sm:h-[90vh] sm:max-w-[96vw]',
}

const ANIMATION_MS = 180

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      children,
      size = 'md',
      closeOnOverlay = true,
      closeOnEscape = true,
      showCloseButton = true,
      className,
    },
    ref
  ) => {
    const dialogRef = React.useRef<HTMLDivElement>(null)
    const previousFocus = React.useRef<HTMLElement | null>(null)
    const [rendered, setRendered] = React.useState(Boolean(open))
    const [visible, setVisible] = React.useState(false)
    const hasBody = React.useMemo(() => hasDialogBodyChild(children), [children])

    const handleEscape = React.useCallback(
      (e: KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') onClose?.()
      },
      [closeOnEscape, onClose]
    )

    React.useEffect(() => {
      if (open) {
        setRendered(true)
        const raf = window.requestAnimationFrame(() => setVisible(true))
        return () => window.cancelAnimationFrame(raf)
      }

      setVisible(false)
      if (rendered) {
        const timer = window.setTimeout(() => setRendered(false), ANIMATION_MS)
        return () => window.clearTimeout(timer)
      }
    }, [open, rendered])

    // Basic focus trapping logic for a11y
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    React.useEffect(() => {
      if (open) {
        previousFocus.current = document.activeElement as HTMLElement
        document.addEventListener('keydown', handleEscape)
        
        // Prevent body scroll
        document.body.style.setProperty('overflow', 'hidden')
        
        // Move focus into the dialog after it renders
        requestAnimationFrame(() => {
          if (dialogRef.current) {
            const focusable = dialogRef.current.querySelector<HTMLElement>(
              'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            if (focusable) {
              focusable.focus()
            } else {
              dialogRef.current.focus()
            }
          }
        })
      }
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.removeProperty('overflow')
        if (!open && previousFocus.current) {
          previousFocus.current.focus()
        }
      }
    }, [open, handleEscape])

    if (!rendered) return null

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlay && e.target === e.currentTarget) {
        onClose?.()
      }
    }

    return (
      <div
        className={cn(
          'fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 sm:p-0',
          'bg-black/80 backdrop-blur-[1px] transition-opacity duration-150',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          ref={(node) => {
            ;(dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative flex flex-col w-full max-h-[90vh] overflow-hidden rounded-[16px] border border-border bg-background shadow-lg',
            'transform-gpu transition-[opacity,transform] duration-150 ease-out',
            visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1',
            sizeClasses[size],
            className
          )}
        >
          <DialogSizeContext.Provider value={size}>
            <DialogHasBodyContext.Provider value={hasBody}>
              {children}
            </DialogHasBodyContext.Provider>
          </DialogSizeContext.Provider>
          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 rounded-sm text-foreground/80 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="size-4" weight="bold" />
              <span className="sr-only">Close dialog</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
Dialog.displayName = 'Dialog'

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogIcon, DialogBody, DialogFooter }
export default Dialog

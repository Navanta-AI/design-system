'use client'

import * as React from 'react'
import { X, Info, CheckCircle, WarningCircle, Warning } from '@phosphor-icons/react'
import { cn } from '../utils/cn'
import { useToast, type ToastItem, type ToastPosition } from '../context/ToastContext'

export type ToastType = ToastItem['type']

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual type of the toast affecting border, background, and icon */
  type?: ToastType
  /** Primary title of the toast */
  title?: string
  /** Sub-message or description */
  message?: string
  /** Duration in milliseconds before auto-dismissal. Set to 0 to disable auto-dismiss. */
  duration?: number
  /** Callback fired when the close button is clicked or duration ends */
  onClose?: () => void
  /** Position used to determine entry/exit direction */
  position?: ToastPosition
  /** Controlled closing state (used by Toaster/context) */
  dismissing?: boolean
}

export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ToastPosition
}

const EXIT_ANIMATION_MS = 220

const iconMap: Record<ToastType, React.ReactNode> = {
  info: <Info size={20} weight="fill" />,
  success: <CheckCircle size={20} weight="fill" />,
  error: <WarningCircle size={20} weight="fill" />,
  warning: <Warning size={20} weight="fill" />,
}

const typeClasses: Record<ToastType, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
}

const iconColors: Record<ToastType, string> = {
  info: 'text-blue-500',
  success: 'text-green-500',
  error: 'text-destructive',
  warning: 'text-yellow-500',
}

const hiddenOffsetByPosition: Record<ToastPosition, string> = {
  'top-right': 'sm:translate-x-6 -translate-y-2 sm:translate-y-0',
  'top-left': 'sm:-translate-x-6 -translate-y-2 sm:translate-y-0',
  'bottom-right': 'sm:translate-x-6 translate-y-2 sm:translate-y-0',
  'bottom-left': 'sm:-translate-x-6 translate-y-2 sm:translate-y-0',
  'top-center': '-translate-y-3',
  'bottom-center': 'translate-y-3',
}

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-0 right-0 items-end',
  'top-left': 'top-0 left-0 items-start',
  'bottom-right': 'bottom-0 right-0 items-end flex-col-reverse',
  'bottom-left': 'bottom-0 left-0 items-start flex-col-reverse',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
}

const TOAST_POSITIONS: ToastPosition[] = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-center',
  'bottom-center',
]

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      type = 'info',
      title,
      message,
      duration = 5000,
      onClose,
      className,
      position = 'bottom-right',
      dismissing = false,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = React.useState(false)
    const [isClosing, setIsClosing] = React.useState(dismissing)

    React.useEffect(() => {
      const raf = window.requestAnimationFrame(() => setMounted(true))
      return () => window.cancelAnimationFrame(raf)
    }, [])

    React.useEffect(() => {
      if (dismissing) setIsClosing(true)
    }, [dismissing])

    const requestClose = React.useCallback(() => {
      if (isClosing || dismissing) return
      setIsClosing(true)
      window.setTimeout(() => onClose?.(), EXIT_ANIMATION_MS)
    }, [isClosing, dismissing, onClose])

    // Standalone auto-dismiss support
    React.useEffect(() => {
      if (!onClose || duration <= 0 || dismissing) return
      const timer = window.setTimeout(requestClose, duration)
      return () => window.clearTimeout(timer)
    }, [duration, dismissing, onClose, requestClose])

    const isOpen = mounted && !isClosing

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={cn(
          'pointer-events-auto flex w-full max-w-[420px] items-start gap-3 rounded-md border p-4 shadow-md transform-gpu transition-[opacity,transform] duration-200 ease-out',
          typeClasses[type],
          !isOpen && 'opacity-0 scale-[0.98]',
          !isOpen && hiddenOffsetByPosition[position],
          isOpen && 'opacity-100 translate-x-0 translate-y-0 scale-100',
          className
        )}
        {...props}
      >
        <span className={cn('mt-0.5 shrink-0', iconColors[type])}>{iconMap[type]}</span>
        <div className="grid flex-1 gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {message && <div className="text-sm opacity-90">{message}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            className="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={requestClose}
            aria-label="Dismiss toast"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'

const KToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({ position = 'top-right', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4 pointer-events-none',
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
KToastContainer.displayName = 'KToastContainer'

export function Toaster({ position = 'bottom-right' }: { position?: ToastPosition }) {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {TOAST_POSITIONS.map((pos) => {
        const items = toasts.filter((toast) => (toast.position ?? position) === pos)
        if (items.length === 0) return null

        return (
          <KToastContainer key={pos} position={pos}>
            {items.map((t) => (
              <Toast
                key={t.id}
                type={t.type}
                title={t.title}
                message={t.message}
                duration={0}
                dismissing={Boolean(t.dismissing)}
                position={pos}
                onClose={() => dismiss(t.id)}
              />
            ))}
          </KToastContainer>
        )
      })}
    </>
  )
}

export { Toast, KToastContainer }
export default Toast

import { cn } from '../../lib/utils'

const variants = {
  default:     'bg-primary text-white hover:bg-primary/90',
  destructive: 'bg-destructive text-white hover:bg-destructive/90',
  outline:     'border border-border bg-white hover:bg-muted text-primary',
  ghost:       'hover:bg-muted text-primary',
  teal:        'bg-bgheader text-white hover:bg-bgheader-hover',
}

const sizes = {
  default: 'h-9 px-4 py-2 text-sm',
  sm:      'h-8 px-3 text-xs',
  lg:      'h-10 px-6 text-sm',
  icon:    'h-9 w-9',
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

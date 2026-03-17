import { cn } from '../../lib/utils'

export function Label({ className, children, htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    >
      {children}
    </label>
  )
}

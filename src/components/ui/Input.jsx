import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded border border-border bg-white px-3 py-1 text-sm',
        'placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-bgheader focus:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted',
        className
      )}
      {...props}
    />
  )
}

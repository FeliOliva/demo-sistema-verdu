import { cn } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

export function Select({ className, children, ...props }) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'flex h-9 w-full appearance-none rounded border border-border bg-white px-3 pr-8 py-1 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-bgheader focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  )
}

export function SelectOption({ value, children, disabled }) {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  )
}

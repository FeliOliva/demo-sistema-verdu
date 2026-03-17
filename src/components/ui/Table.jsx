import { cn } from '../../lib/utils'

export function Table({ className, children }) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children }) {
  return <thead className="bg-bgtable/40">{children}</thead>
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>
}

export function TableRow({ children, className }) {
  return (
    <tr className={cn('border-b border-border transition-colors hover:bg-muted/50', className)}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className }) {
  return (
    <th className={cn('h-10 px-4 text-left align-middle font-semibold text-gray-600', className)}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }) {
  return (
    <td className={cn('px-4 py-3 align-middle', className)}>
      {children}
    </td>
  )
}

export function TableEmpty({ colSpan, message = 'Sin registros' }) {
  return (
    <TableRow>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-gray-400">
        {message}
      </td>
    </TableRow>
  )
}

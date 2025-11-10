import { PropsWithChildren, HTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

interface TableProps extends HTMLAttributes<HTMLTableElement> {}

export function Table({ children, className, ...props }: PropsWithChildren<TableProps>) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-gray-100", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) {
  return (
    <thead className={cn("bg-gray-50", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) {
  return (
    <tbody className={cn("bg-white divide-y divide-gray-100", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableRowElement>>) {
  return (
    <tr className={cn("hover:bg-gray-50", className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) {
  const defaultStyle: CSSProperties = { padding: '12px 16px' };
  return (
    <th
      className={cn(
        "text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        className
      )}
      style={{ ...defaultStyle, ...style }}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, style, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) {
  const defaultStyle: CSSProperties = { padding: '16px' };
  return (
    <td className={cn("whitespace-nowrap text-sm text-gray-900", className)} style={{ ...defaultStyle, ...style }} {...props}>
      {children}
    </td>
  );
}

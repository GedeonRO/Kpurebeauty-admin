import { PropsWithChildren, HTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ children, className, style, ...props }: PropsWithChildren<CardProps>) {
  return (
    <div
      className={cn("bg-white rounded-xl border border-gray-100 shadow", className)}
      {...props}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, style, ...props }: PropsWithChildren<CardProps>) {
  const defaultStyle: CSSProperties = { padding: '20px 24px' };
  return (
    <div className={cn("border-b border-gray-100", className)} style={{ ...defaultStyle, ...style }} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: PropsWithChildren<CardProps>) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, style, ...props }: PropsWithChildren<CardProps>) {
  const defaultStyle: CSSProperties = { padding: '24px' };
  return (
    <div className={cn("", className)} style={{ ...defaultStyle, ...style }} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, style, ...props }: PropsWithChildren<CardProps>) {
  const defaultStyle: CSSProperties = { padding: '20px 24px' };
  return (
    <div className={cn("border-t border-gray-100 bg-gray-50", className)} style={{ ...defaultStyle, ...style }} {...props}>
      {children}
    </div>
  );
}

import { PropsWithChildren, ButtonHTMLAttributes, CSSProperties } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-[#14A800] text-white hover:bg-[#0f8500]",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  children,
  className,
  variant,
  size,
  style,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const sizeStyles: Record<string, CSSProperties> = {
    sm: { padding: '6px 12px' },
    md: { padding: '8px 16px' },
    lg: { padding: '12px 24px' },
  };

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      style={{ ...sizeStyles[size || 'md'], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

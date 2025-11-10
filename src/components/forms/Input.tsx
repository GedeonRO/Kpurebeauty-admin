import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, style, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '4px' }}>
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full border border-gray-300 rounded focus:outline-none bg-white disabled:bg-gray-50 disabled:text-gray-500",
            error && "border-red-500",
            className
          )}
          style={{ height: '40px', padding: '0 12px', ...style }}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-600" style={{ marginTop: '4px' }}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

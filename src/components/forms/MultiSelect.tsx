import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface MultiSelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ label, value, onChange, options, placeholder, className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = value.map(v => options.find(o => o.value === v)?.label).filter(Boolean);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left bg-white",
            className
          )}
        >
          {selectedLabels.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedLabels.map((label, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder || "Sélectionner..."}</span>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
            {options.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">Aucune option disponible</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

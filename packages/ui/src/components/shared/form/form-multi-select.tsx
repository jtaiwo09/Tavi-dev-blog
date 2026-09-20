"use client";

import * as React from "react";
import { Check } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@repo/ui/components/ui/select";
import { cn } from "@repo/ui/lib/utils";

import type { FormSelectOption } from "./form-select";

type FormMultiSelectProps = {
  id: string;
  name?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string[];
  defaultValue?: string[];
  maxSelections?: number;
  onMaxReached?: (max: number) => void;
  onValueChange?: (value: string[]) => void;
  options: FormSelectOption[];
};

const FormMultiSelect = ({
  id,
  name,
  error,
  required,
  disabled,
  placeholder = "Select options",
  options,
  value,
  defaultValue,
  maxSelections,
  onMaxReached,
  onValueChange,
}: FormMultiSelectProps) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    value ?? defaultValue ?? [],
  );

  const [open, setOpen] = React.useState(false);

  const keepOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  const max = maxSelections && maxSelections > 0 ? maxSelections : undefined;

  const limitReached = max !== undefined && selectedValues.length >= max;

  const handleValueChange = (nextValue: string) => {
    keepOpenRef.current = true;

    const exists = selectedValues.includes(nextValue);

    if (!exists && max !== undefined && selectedValues.length >= max) {
      onMaxReached?.(max);
      return;
    }

    const nextValues = exists
      ? selectedValues.filter((item) => item !== nextValue)
      : [...selectedValues, nextValue];

    setSelectedValues(nextValues);
    onValueChange?.(nextValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && keepOpenRef.current) {
      keepOpenRef.current = false;
      return;
    }

    keepOpenRef.current = false;
    setOpen(nextOpen);
  };

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  return (
    <>
      <Select
        open={open}
        onOpenChange={handleOpenChange}
        value=""
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          className={cn(
            "h-12",
            "bg-field",
            "border-input",
            "text-sm text-foreground",
            "shadow-none",
            "outline-none",
            "transition-[border-color,box-shadow,background-color] duration-150",
            "hover:border-input-hover",
            "focus-visible:border-brand",
            "focus-visible:bg-background",
            "focus-visible:ring-2",
            "focus-visible:ring-brand/10",
            "focus-visible:ring-offset-0",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",

            error && [
              "border-destructive/70",
              "hover:border-destructive",
              "focus-visible:border-destructive",
              "focus-visible:ring-destructive/10",
            ],
          )}
        >
          <span
            className={cn(
              "truncate",
              selectedLabels.length === 0
                ? "text-field-placeholder"
                : "text-foreground",
            )}
          >
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder}
          </span>
        </SelectTrigger>

        <SelectContent>
          {max !== undefined && (
            <div
              className={cn(
                "pointer-events-none px-2 pb-1 pt-1.5 text-xs",
                limitReached ? "text-brand" : "text-muted-foreground",
              )}
            >
              {selectedValues.length} of {max} selected
              {limitReached && " (limit reached)"}
            </div>
          )}

          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const isLimitBlocked = limitReached && !isSelected;

            return (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled || isLimitBlocked}
                className={cn(
                  "pl-2",
                  "[&>span:first-child]:hidden",
                  isSelected && "bg-brand/10",
                )}
              >
                <div className="flex w-full items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center",
                      "rounded-[4px] border transition-colors",
                      isSelected
                        ? "border-brand bg-brand text-white"
                        : "border-input bg-background",
                    )}
                  >
                    {isSelected && <Check className="size-3" strokeWidth={3} />}
                  </span>

                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <input
        type="hidden"
        name={name ?? id}
        value={selectedValues.join(",")}
        disabled={disabled}
        readOnly
      />
    </>
  );
};

export default FormMultiSelect;

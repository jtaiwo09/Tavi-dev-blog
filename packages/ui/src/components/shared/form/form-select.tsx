"use client";

import * as React from "react";
import { Check } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { cn } from "@repo/ui/lib/utils";

type FormSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormSelectProps = {
  id: string;
  name?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  /** Max number of options that can be selected (multiple mode only). */
  maxSelections?: number;
  /** Called when the user tries to select more than `maxSelections`. */
  onMaxReached?: (max: number) => void;
  onValueChange?: (value: string | string[]) => void;
  options: FormSelectOption[];
};

const FormSelect = ({
  id,
  name,
  error,
  required,
  disabled,
  placeholder = "Select an option",
  options,
  value,
  defaultValue,
  multiple = false,
  maxSelections,
  onMaxReached,
  onValueChange,
}: FormSelectProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string | string[]>(
    value ?? defaultValue ?? (multiple ? [] : ""),
  );
  const [open, setOpen] = React.useState(false);

  // Set right before Radix closes the menu after an item pick, so we can
  // keep the menu open in multiple mode.
  const keepOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const selectedValues = React.useMemo(
    () =>
      Array.isArray(selectedValue)
        ? selectedValue
        : selectedValue
          ? [selectedValue]
          : [],
    [selectedValue],
  );

  const max =
    multiple && maxSelections && maxSelections > 0 ? maxSelections : undefined;
  const limitReached = max !== undefined && selectedValues.length >= max;

  const handleValueChange = (nextValue: string) => {
    if (!multiple) {
      setSelectedValue(nextValue);
      onValueChange?.(nextValue);
      return;
    }

    keepOpenRef.current = true;

    const exists = selectedValues.includes(nextValue);

    // Block adding beyond the limit (removing is always allowed)
    if (!exists && max !== undefined && selectedValues.length >= max) {
      onMaxReached?.(max);
      return;
    }

    const nextValues = exists
      ? selectedValues.filter((item) => item !== nextValue)
      : [...selectedValues, nextValue];

    setSelectedValue(nextValues);
    onValueChange?.(nextValues);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    // Radix closes the menu after every item pick; ignore that in multiple mode
    if (multiple && !nextOpen && keepOpenRef.current) {
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
        value={multiple ? "" : (selectedValue as string)}
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

            "data-placeholder:text-field-placeholder",

            "disabled:cursor-not-allowed disabled:opacity-60",

            error && [
              "border-destructive/70",
              "hover:border-destructive",
              "focus-visible:border-destructive",
              "focus-visible:ring-destructive/10",
            ],
          )}
        >
          {multiple ? (
            <span
              className={cn(
                "truncate text-foreground",
                selectedLabels.length === 0 && "text-field-placeholder",
              )}
            >
              {selectedLabels.length > 0
                ? selectedLabels.join(", ")
                : placeholder}
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
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
            const isLimitBlocked = multiple && limitReached && !isSelected;

            return (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled || isLimitBlocked}
                className={cn(
                  // Hide Radix's built-in check indicator in multiple mode
                  // and remove the left padding it reserved.
                  multiple && "pl-2 [&>span:first-child]:hidden",
                  multiple && isSelected && "bg-brand/10",
                )}
              >
                <div className="flex w-full items-center gap-2">
                  {multiple && (
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
                      {isSelected && (
                        <Check className="size-3" strokeWidth={3} />
                      )}
                    </span>
                  )}

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

export default FormSelect;

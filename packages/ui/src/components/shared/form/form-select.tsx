"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { cn } from "@repo/ui/lib/utils";

export type FormSelectOption = {
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
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  onValueChange,
}: FormSelectProps) => {
  const [selectedValue, setSelectedValue] = React.useState(
    value ?? defaultValue ?? "",
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (nextValue: string) => {
    setSelectedValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <>
      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          className={cn(
            "h-12 mb-0",
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
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        type="hidden"
        name={name ?? id}
        value={selectedValue}
        disabled={disabled}
        readOnly
      />
    </>
  );
};

export default FormSelect;

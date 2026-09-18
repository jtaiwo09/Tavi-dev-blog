"use client";

import { useState } from "react";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { cn } from "@repo/ui/lib/utils";

type FormCheckboxProps = {
  id: string;
  name: string;
  error?: string | string[];
  disabled?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

const FormCheckbox = ({
  id,
  name,
  error,
  disabled,
  className,
  defaultChecked = false,
  onCheckedChange,
}: FormCheckboxProps) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleCheckedChange = (value: boolean | "indeterminate") => {
    const nextChecked = value === true;

    setChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Checkbox
        id={id}
        disabled={disabled}
        checked={checked}
        aria-invalid={!!error}
        onCheckedChange={handleCheckedChange}
      />

      <input
        type="hidden"
        name={name}
        value={checked ? "on" : ""}
        disabled={disabled}
      />
    </div>
  );
};

export default FormCheckbox;

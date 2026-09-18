// packages/ui/components/shared/form/form-input.tsx

import * as React from "react";

import { Input } from "@repo/ui/components/ui/input";
import { cn } from "@repo/ui/lib/utils";

type FormInputProps = React.ComponentProps<typeof Input> & {
  error?: boolean;
};

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          "h-12",
          "bg-field",
          "border-input",
          "text-sm text-foreground",
          "placeholder:text-field-placeholder",
          "shadow-none",
          "transition-[border-color,box-shadow,background-color] duration-150",
          "hover:border-input-hover",
          "focus-visible:border-brand",
          "focus-visible:bg-background",
          "focus-visible:ring-2",
          "focus-visible:ring-brand/10",
          "focus-visible:ring-offset-0",
          error && [
            "border-destructive/70",
            "hover:border-destructive",
            "focus-visible:border-destructive",
            "focus-visible:ring-destructive/10",
          ],
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;

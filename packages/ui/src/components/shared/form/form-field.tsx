// packages/ui/components/shared/form/form-field.tsx

import * as React from "react";

import { Label } from "@repo/ui/components/ui/label";
import { cn } from "@repo/ui/lib/utils";

type FormFieldProps = {
  id?: string;
  label?: string;
  description?: React.ReactNode;
  error?: string | string[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const getErrorMessage = (error?: string | string[]) => {
  if (!error) return undefined;

  return Array.isArray(error) ? error[0] : error;
};

const FormField = ({
  id,
  label,
  description,
  error,
  required,
  disabled,
  className,
  children,
}: FormFieldProps) => {
  const errorMessage = getErrorMessage(error);

  const descriptionId = id ? `${id}-description` : undefined;

  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="space-y-1">
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            {label}

            {required && (
              <span aria-hidden="true" className="ml-1 text-destructive">
                *
              </span>
            )}
          </Label>
        )}

        {children}

        {description && !errorMessage && (
          <p
            id={descriptionId}
            className="text-xs leading-5 text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>

      {errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="animate-shake text-xs font-medium text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormField;

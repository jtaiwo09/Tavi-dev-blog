// packages/ui/components/shared/form/form-file-upload.tsx

import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

type FormFileUploadProps =
  Omit<
    React.ComponentProps<"input">,
    "type"
  > & {

    error?: string | string[];
    required?: boolean;
  };

const FormFileUpload = React.forwardRef<
  HTMLInputElement,
  FormFileUploadProps
>(
  (
    {
      id,
      error,
      required,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    return (
       <input
          {...props}
          ref={ref}
          id={id}
          type="file"
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            "block w-full cursor-pointer rounded-xl border border-input",
            "bg-field text-sm text-field-foreground",
            "file:mr-4 file:border-0 file:border-r",
            "file:border-input file:bg-surface-subtle",
            "file:px-4 file:py-2.5",
            "file:text-sm file:font-medium",
            "file:text-foreground",
            "hover:file:bg-surface-hover",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring",
            disabled &&
              "cursor-not-allowed opacity-60",
            className,
          )}
        />
    );
  },
);

FormFileUpload.displayName =
  "FormFileUpload";

export default FormFileUpload;

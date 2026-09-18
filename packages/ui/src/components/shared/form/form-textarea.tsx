import * as React from "react";

import { Textarea } from "@repo/ui/components/ui/textarea";
import { cn } from "@repo/ui/lib/utils";

type FormTextareaProps = React.ComponentProps<typeof Textarea> & {
  error?: boolean;
  rows?: number;
};

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        rows={rows}
        aria-invalid={error || undefined}
        className={cn(
          "min-h-28 resize-y",
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

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;

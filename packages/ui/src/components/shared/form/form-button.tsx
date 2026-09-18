import * as React from "react";

import { Button, type ButtonProps } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

const FormButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "lg", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={cn(
          "w-full rounded-xs",
          "font-semibold",
          "shadow-none",
          "transition-all",
          "active:translate-y-px",
          className,
        )}
        {...props}
      />
    );
  },
);

FormButton.displayName = "FormButton";

export default FormButton;

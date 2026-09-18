// packages/ui/components/shared/form/form-search-input.tsx

import * as React from "react";

import FormInput from "./form-input";
import { cn } from "@repo/ui/lib/utils";
import { Search } from "lucide-react";

type FormSearchInputProps =
  React.ComponentProps<typeof FormInput>;

const FormSearchInput = React.forwardRef<
  HTMLInputElement,
  FormSearchInputProps
>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <FormInput
        {...props}
        ref={ref}
        type="search"
        className={cn(
          "pl-10",
          "[&::-webkit-search-cancel-button]:appearance-none",
          className,
        )}
      />
    </div>
  );
});

FormSearchInput.displayName =
  "FormSearchInput";

export default FormSearchInput;

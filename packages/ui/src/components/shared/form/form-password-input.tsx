// packages/ui/components/shared/form/form-password-input.tsx

"use client";

import * as React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import FormInput from "./form-input";

type FormPasswordInputProps = Omit<
  React.ComponentProps<typeof FormInput>,
  "type"
>;

const FormPasswordInput = React.forwardRef<
  HTMLInputElement,
  FormPasswordInputProps
>((props, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <FormInput
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        className="pr-11"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground hover:text-foreground"
        aria-label={
          visible
            ? "Hide password"
            : "Show password"
        }
      >
        {visible ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </Button>
    </div>
  );
});

FormPasswordInput.displayName =
  "FormPasswordInput";

export default FormPasswordInput;

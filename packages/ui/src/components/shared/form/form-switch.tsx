// packages/ui/components/shared/form/form-switch.tsx

import * as React from "react";

import { Switch } from "@repo/ui/components/ui/switch";
import FormField from "./form-field";

type FormSwitchProps = {
  id: string;
  error?: string | string[];
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
  ) => void;
};

const FormSwitch = ({
  id,
  error,
  required,
  disabled,
  ...props
}: FormSwitchProps) => {
  return (
    <Switch
        id={id}
        disabled={disabled}
        aria-invalid={!!error}
        {...props}
      />
  );
};

export default FormSwitch;

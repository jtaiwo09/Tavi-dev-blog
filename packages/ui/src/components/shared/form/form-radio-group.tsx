// packages/ui/components/shared/form/form-radio-group.tsx

import * as React from "react";

import {
  RadioGroup,
  RadioGroupItem,
} from "@repo/ui/components/ui/radio-group";

import { Label } from "@repo/ui/components/ui/label";

type FormRadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type FormRadioGroupProps = {
  id: string;
  error?: string | string[];
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: FormRadioOption[];
};

const FormRadioGroup = ({
  id,
  error,
  required,
  disabled,
  options,
  ...props
}: FormRadioGroupProps) => {
  return (
<RadioGroup
        id={id}
        disabled={disabled}
        {...props}
        className="gap-3"
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;

          return (
            <div
              key={option.value}
              className="flex items-center gap-3"
            >
              <RadioGroupItem
                id={optionId}
                value={option.value}
                disabled={
                  disabled || option.disabled
                }
              />

              <Label
                htmlFor={optionId}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
  );
};

export default FormRadioGroup;

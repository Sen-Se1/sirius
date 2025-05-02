"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormSelectProps {
  id: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      id,
      label,
      placeholder,
      defaultValue,
      disabled,
      errors,
      className,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Select defaultValue={defaultValue} name={id} disabled={pending || disabled}>
            <SelectTrigger
              id={id}
              ref={ref}
              className={cn(
                "text-sm px-2 py-1 h-8 border rounded shadow-sm focus:ring-0 focus:border-none",
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FormErrors
          id={id}
          errors={errors}
        />
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/crm/ui/select";
import { cn } from "@/lib/utils";

export type FormSelectOption = {
  value: string;
  label: string;
};

const EMPTY = "__empty__";

type FormSelectProps = {
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  options: FormSelectOption[];
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
};

/**
 * shadcn Select wired for HTML forms (hidden input) or controlled callbacks.
 */
export function FormSelect({
  name,
  id,
  value: controlled,
  defaultValue = "",
  placeholder = "Select…",
  options,
  className,
  triggerClassName,
  disabled,
  required,
  onValueChange,
}: FormSelectProps) {
  const [internal, setInternal] = useState(controlled ?? defaultValue);
  const value = controlled ?? internal;
  const selectValue = value === "" ? EMPTY : value;

  function handleChange(next: string | null) {
    const resolved = !next || next === EMPTY ? "" : next;
    if (controlled === undefined) setInternal(resolved);
    onValueChange?.(resolved);
  }

  return (
    <div className={cn("w-full", className)}>
      {name ? (
        <input type="hidden" name={name} value={value} required={required && !value} readOnly />
      ) : null}
      <Select value={selectValue} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger id={id} className={cn("w-full", triggerClassName)}>
          <SelectValue placeholder={placeholder}>
            {options.find((option) => option.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const itemValue = option.value === "" ? EMPTY : option.value;
            return (
              <SelectItem key={itemValue} value={itemValue}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

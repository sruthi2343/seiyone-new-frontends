import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LoginTextFieldProps = Omit<ComponentProps<typeof Input>, "id"> & {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Control placed inside the right edge of the input (the password show/hide button). */
  trailing?: ReactNode;
  fieldClassName?: string;
};

/** A labelled login input with a leading icon, styled like old Seiyone's .login-page__input. */
export function LoginTextField({
  id,
  label,
  icon: Icon,
  trailing,
  fieldClassName,
  className,
  ...inputProps
}: LoginTextFieldProps) {
  return (
    <div className={fieldClassName}>
      <Label
        htmlFor={id}
        className="mb-1 block text-xs leading-4 font-medium text-(color:--login-label) max-md:text-[13px] max-md:leading-[17px]"
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-(color:--login-icon)"
        />
        <Input
          id={id}
          className={cn(
            "h-10 rounded-[9px] border-(color:--login-input-border) bg-(color:--login-input-bg) py-2 pr-3 pl-[42px]",
            "text-xs text-(color:--login-input-text) shadow-(--login-input-shadow) placeholder:text-(color:--login-placeholder) md:text-xs",
            "focus-visible:border-(color:--login-focus-border) focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-(color:--login-focus-outline)",
            "max-md:h-[46px] max-md:text-[13px]",
            trailing && "pr-11",
            className,
          )}
          {...inputProps}
        />
        {trailing}
      </div>
    </div>
  );
}

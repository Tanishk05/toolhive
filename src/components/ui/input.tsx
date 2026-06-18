import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-2xl bg-surface px-4 text-sm text-foreground shadow-sm ring-1 ring-white/[0.06] transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-11",
        sm: "h-9 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={error ? true : ariaInvalid}
        className={cn(inputVariants({ size }), error && "ring-destructive focus-visible:ring-destructive", className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
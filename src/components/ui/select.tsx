import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectVariants = cva(
  "flex w-full appearance-none rounded-full border border-input bg-card px-4 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-10",
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, error, "aria-invalid": ariaInvalid, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={error ? true : ariaInvalid}
        className={cn(selectVariants({ size }), error && "border-destructive focus-visible:ring-destructive", className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export { Select, selectVariants };

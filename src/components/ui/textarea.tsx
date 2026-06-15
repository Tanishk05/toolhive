import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 resize-none",
  {
    variants: {
      size: {
        default: "min-h-[120px]",
        sm: "min-h-[80px] text-xs",
        lg: "min-h-[180px] text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, error, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={error ? true : ariaInvalid}
        className={cn(textareaVariants({ size }), error && "border-destructive focus-visible:ring-destructive", className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };

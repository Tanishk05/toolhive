import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-[var(--radius)] text-card-foreground transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.2),0_8px_32px_rgba(0,0,0,0.12)]",
      elevated: "bg-surface shadow-[0_4px_24px_rgba(0,0,0,0.2),0_16px_64px_rgba(0,0,0,0.16)]",
      glass: "bg-white/[0.03] backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.12)]",
      floating:
        "bg-surface shadow-[0_2px_12px_rgba(0,0,0,0.15),0_12px_48px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2),0_24px_80px_rgba(0,0,0,0.16),0_0_0_1px_rgba(143,175,147,0.06)]",
      outline: "border border-border bg-transparent",
    },
    padding: {
      none: "",
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, padding, ...props }: Readonly<CardProps>) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
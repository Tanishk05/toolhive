"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronRight, Check, Circle } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Dropdown = DropdownMenuPrimitive.Root;
const DropdownTrigger = DropdownMenuPrimitive.Trigger;
const DropdownGroup = DropdownMenuPrimitive.Group;
const DropdownPortal = DropdownMenuPrimitive.Portal;
const DropdownSub = DropdownMenuPrimitive.Sub;
const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup;

const dropdownContentVariants = cva(
  "z-50 min-w-48 overflow-hidden rounded-[var(--radius)] border border-border bg-popover p-2 text-popover-foreground shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
);

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 10, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn(dropdownContentVariants(), className)} {...props} />
  </DropdownMenuPrimitive.Portal>
));
DropdownContent.displayName = DropdownMenuPrimitive.Content.displayName;

const itemBase =
  "relative flex cursor-default select-none items-center rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => <DropdownMenuPrimitive.Item ref={ref} className={cn(itemBase, className)} {...props} />);
DropdownItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem ref={ref} className={cn(itemBase, "pl-8", className)} checked={checked} {...props}>
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" aria-hidden="true" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={cn(itemBase, "pl-8", className)} {...props}>
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-3 w-3 fill-current" aria-hidden="true" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => <DropdownMenuPrimitive.Label ref={ref} className={cn("px-3 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground", className)} {...props} />);
DropdownLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-2 h-px bg-border", className)} {...props} />);
DropdownSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-wide text-muted-foreground", className)} {...props} />
);
DropdownShortcut.displayName = "DropdownShortcut";

const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger ref={ref} className={cn(itemBase, className)} {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" aria-hidden="true" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent ref={ref} className={cn(dropdownContentVariants(), className)} {...props} />
));
DropdownSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownShortcut,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
  DropdownRadioGroup,
};
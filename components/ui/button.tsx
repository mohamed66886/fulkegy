"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#1F4B8F] text-white shadow hover:bg-[#1F4B8F]/90 focus-visible:ring-[#1F4B8F]",
        secondary:
          "bg-[#2F6EDB] text-white shadow-sm hover:bg-[#2F6EDB]/90 focus-visible:ring-[#2F6EDB]",
        outline:
          "border border-[#1F4B8F] text-[#1F4B8F] bg-transparent shadow-sm hover:bg-[#E8EEF9] focus-visible:ring-[#1F4B8F]",
        ghost:
          "text-[#1F4B8F] hover:bg-[#E8EEF9] focus-visible:ring-[#1F4B8F]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-600/90 focus-visible:ring-red-600",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 rounded-md px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

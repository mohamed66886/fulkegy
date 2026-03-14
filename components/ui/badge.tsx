import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F4B8F] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1F4B8F] text-white shadow hover:bg-[#1F4B8F]/80",
        secondary:
          "border-transparent bg-[#E8EEF9] text-[#1F4B8F] hover:bg-[#E8EEF9]/80",
        outline:
          "border-[#1F4B8F] text-[#1F4B8F] bg-transparent",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-600/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

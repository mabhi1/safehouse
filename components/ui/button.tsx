import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2, LucideProps } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
  ICON?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  iconClassName?: string;
  loading?: boolean;
  mobileVariant?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, ICON, loading, iconClassName, mobileVariant = false, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (loading) {
      return (
        <Comp
          className={cn("flex gap-2 items-center", buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
          disabled
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="mt-[2px]">Please wait</span>
        </Comp>
      );
    }
    if (ICON) {
      return (
        <>
          <Comp
            className={cn(
              "gap-2 items-center",
              buttonVariants({ variant, size, className }),
              mobileVariant ? "hidden md:inline-flex" : "inline-flex"
            )}
            ref={ref}
            {...props}
          >
            <ICON className={cn("w-4 h-4", iconClassName)} />
            <span className="mt-[2px]">{props.children}</span>
          </Comp>
          <Comp
            className={cn(
              buttonVariants({
                variant: variant !== "destructive" ? "outline" : "destructive",
                size: "icon",
                className,
              }),
              mobileVariant ? "inline-flex md:hidden" : "hidden"
            )}
            ref={ref}
            {...props}
          >
            <ICON className={cn("w-4 h-4", iconClassName)} />
          </Comp>
        </>
      );
    }
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

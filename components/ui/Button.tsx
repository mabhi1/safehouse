import { ButtonHTMLAttributes, FC } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { mergeClass } from "@/utils/mergeClass";

const buttonVariants = cva("py-2 px-4 cursor-pointer rounded", {
  variants: {
    variant: {
      default: "shadow-lg shadow-cyan-900/50 bg-cyan-900 hover:bg-cyan-800 focus:bg-cyan-800 text-slate-50",
      destructive: "shadow-lg shadow-red-900/50 bg-red-900 hover:bg-red-800 focus:bg-red-800 text-slate-50",
      outline: "px-2 py-1 shadow shadow-cyan-950/50 bg-cyan-50 hover:bg-cyan-100 focus:bg-cyan-100 text-cyan-950 border border-cyan-950",
      outline2: "px-2 py-1 shadow shadow-amber-950/50 bg-amber-50 hover:bg-amber-100 focus:bg-amber-100 text-amber-950 border border-amber-950",
      disabled: "bg-slate-400 flex justify-center items-center text-slate-50 cursor-not-allowed",
      subtle: "",
      ghost: "p-0",
      link: "p-0 text-cyan-900 relative hover:after:w-full after:transition-all after:duration-500 after:content-[''] after:w-0 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-cyan-900",
    },
    size: {
      default: "",
      sm: "min-w-[4rem] py-1 px-2",
      md: "min-w-[7rem]",
      lg: "w-72 lg:w-96 md:w-80",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button: FC<ButtonProps> = ({ className, size, variant, ...props }) => {
  return <button className={mergeClass(buttonVariants({ variant, size, className }))} {...props} />;
};

export default Button;

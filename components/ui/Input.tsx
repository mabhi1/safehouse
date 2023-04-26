import { FC, InputHTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { mergeClass } from "@/utils/mergeClass";

const inputVariants = cva("border-2 focus-visible:outline-none bg-slate-50 border-slate-400 rounded", {
  variants: {
    variant: {
      default: "p-2 focus:border-cyan-900",
      compact: "px-2 py-1 focus:border-cyan-900",
      iconSmall: "py-1 px-2 pl-6 focus:border-cyan-900",
      iconLarge: "p-2 pl-5 focus:border-cyan-900",
      disabled: "bg-transparent border-none ",
      checkbox:
        "appearance-none after:absolute hover:after:-inset-[0.8rem] checked:after:-inset-[0.8rem] focus:after:-inset-[0.8rem] after:bg-cyan-500/10 after:rounded-full shadow-cyan-900 relative w-4 h-4 outline-none focus:ring-0 before:absolute checked:before:inset-0 before:content-[''] before:bg-cyan-900 before:rounded-sm",
    },
    wide: {
      default: "",
      xs: "w-32 lg:w-32 md:w-40",
      sm: "w-40 lg:w-40 md:w-60",
      md: "w-60 lg:w-60 md:w-80",
      lg: "w-96",
      full: "w-full",
    },
  },
  defaultVariants: {
    variant: "default",
    wide: "default",
  },
});

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input: FC<InputProps> = ({ className, wide, variant, ...props }) => {
  if (props.type === "checkbox") variant = "checkbox";
  return <input className={mergeClass(inputVariants({ className, variant, wide }))} {...props} />;
};

export default Input;

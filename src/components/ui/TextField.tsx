import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** `hero` is the task input on `/`; `control` is every other text input. */
  tone?: "hero" | "control";
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ tone = "control", className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={props.type ?? "text"}
        className={cn(
          "w-full rounded-sm border border-rule bg-surface text-ink",
          "transition-colors duration-150 hover:border-muted focus:border-signal",
          tone === "hero"
            ? "px-4 py-3 text-body"
            : "px-2.5 py-1.5 text-ui",
          className,
        )}
        {...props}
      />
    );
  },
);

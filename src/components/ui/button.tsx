import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-bold uppercase tracking-wider font-display transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-slate-blue text-bone hover:bg-slate-blue/80",
          variant === "outline" && "border border-slate-blue/40 text-muted-blue hover:text-bone hover:bg-navy/40 bg-transparent",
          variant === "ghost" && "hover:bg-slate-blue/10 text-muted-blue hover:text-bone",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

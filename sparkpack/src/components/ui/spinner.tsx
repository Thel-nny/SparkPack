import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for combining class names

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "medium", ...props }, ref) => {
    const sizeClasses = {
      small: "h-4 w-4",
      medium: "h-6 w-6",
      large: "h-8 w-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClasses[size],
          className
        )}
        role="status"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
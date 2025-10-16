import { forwardRef } from "react";
import { Button, ButtonProps } from "./Button";
import { cn } from "@/utils/lib";

export const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, icon, children, ...props }, ref) => {
		return (
			<Button
				className={cn("flex items-center space-x-2 bg-sky-600 text-white hover:bg-sky-700", className)}
				ref={ref}
				{...props}
			>
				{icon}
				{children}
			</Button>
		);
	},
);

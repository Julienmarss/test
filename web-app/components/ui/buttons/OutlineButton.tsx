import { forwardRef } from "react";
import { Button, ButtonProps } from "./Button";
import { cn } from "@/utils/lib";

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, icon, children, ...props }, ref) => {
		return (
			<Button
				className={cn("border border-gray-200 bg-white font-semibold text-sky-950 hover:bg-sky-50", className)}
				ref={ref}
				{...props}
			>
				{icon}
				{children}
			</Button>
		);
	},
);

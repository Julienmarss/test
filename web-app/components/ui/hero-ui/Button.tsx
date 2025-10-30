"use client";
import { cn } from "@/utils/lib";
import { Button as HButton } from "@heroui/react";
import * as React from "react";

type ButtonIntent = "default" | "magic" | "outline" | "plain";

export const Button = React.forwardRef<
	React.ElementRef<typeof HButton>,
	React.ComponentPropsWithoutRef<typeof HButton> & { intent?: ButtonIntent }
>(({ intent = "default", className, isDisabled, color, ...rest }, ref) => {
	return (
		<HButton
			ref={ref}
			color={color}
			isDisabled={isDisabled}
			aria-disabled={isDisabled}
			className={cn(
				"h-9 min-h-9 rounded-lg bg-sky-600 text-sm font-semibold text-white hover:bg-sky-500",
				color === "danger" && "bg-red-600 text-white hover:bg-red-500",
				intent === "outline" && "border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50",
				intent === "outline" && color === "danger" && "border-red-200 text-red-900 hover:bg-red-50",
				intent === "plain" && "bg-white text-gray-900 hover:bg-gray-50",
				intent === "magic" &&
					"magic-effect flex items-center space-x-2 font-medium after:bg-sky-950 hover:after:bg-sky-800",
				intent === "default" && isDisabled && "bg-gray-100 text-gray-400",
				className,
			)}
			{...rest}
		/>
	);
});
Button.displayName = "Button";

"use client";
import { cn } from "@/utils/lib";
import { Button as HButton } from "@heroui/react";
import * as React from "react";

type ButtonIntent = "default" | "magic" | "outline" | "plain";

export const Button = React.forwardRef<
	React.ElementRef<typeof HButton>,
	React.ComponentPropsWithoutRef<typeof HButton> & { intent?: ButtonIntent }
>(({ intent = "default", className, ...rest }, ref) => {
	return (
		<HButton
			ref={ref}
			className={cn(
				className +
					" h-9 min-h-9 rounded-lg bg-sky-600 text-sm font-semibold text-white hover:bg-sky-500" +
					(intent === "outline"
						? "border border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
						: "") +
					(intent === "plain" ? "bg-white text-gray-900 hover:bg-gray-50" : ""),
			)}
			{...rest}
		/>
	);
});
Button.displayName = "Button";

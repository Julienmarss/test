"use client";
import * as React from "react";
import { Tooltip as HTooltip } from "@heroui/react";

export type TooltipProps = React.ComponentProps<typeof HTooltip>;

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
	({ children, delay = 250, closeDelay = 100, ...rest }, ref) => {
		return (
			<HTooltip ref={ref as any} delay={delay} closeDelay={closeDelay} {...rest}>
				{children}
			</HTooltip>
		);
	},
);
Tooltip.displayName = "Tooltip";

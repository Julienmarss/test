"use client";

import * as React from "react";
import { RadioGroup as HRadioGroup, Radio as HRadio } from "@heroui/react";

export const RadioGroup = React.forwardRef<
	React.ElementRef<typeof HRadioGroup>,
	React.ComponentPropsWithoutRef<typeof HRadioGroup>
>(({ children, ...rest }, ref) => (
	<HRadioGroup ref={ref} classNames={{ label: "text-gray-900 text-sm" }} {...rest}>
		{children}
	</HRadioGroup>
));
RadioGroup.displayName = "RadioGroup";

export { HRadio as Radio };

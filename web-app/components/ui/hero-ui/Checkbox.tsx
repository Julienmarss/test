"use client";
import { Checkbox as HCheckbox } from "@heroui/react";
import * as React from "react";

export const Checkbox = React.forwardRef<
	React.ElementRef<typeof HCheckbox>,
	React.ComponentPropsWithoutRef<typeof HCheckbox>
>((props, ref) => (
	<HCheckbox
		ref={ref}
		classNames={{
			base: "[&_span]:before:!rounded-[2px] [&_span]:!rounded-[2px] [&_span]:after:!rounded-[2px]",
		}}
		{...props}
	/>
));

Checkbox.displayName = "Checkbox";

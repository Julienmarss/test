"use client";
import * as React from "react";
import {
	Dropdown as HDropdown,
	DropdownTrigger as HDropdownTrigger,
	DropdownMenu as HDropdownMenu,
	DropdownItem as HDropdownItem,
	DropdownSection as HDropdownSection,
} from "@heroui/react";

export const Dropdown = React.forwardRef<
	any,
	React.ComponentPropsWithoutRef<typeof HDropdown>
>(({ children, ...rest }, ref) => (
	<HDropdown ref={ref as any} {...rest}>
		{children}
	</HDropdown>
));
Dropdown.displayName = "Dropdown";

export { HDropdownTrigger as DropdownTrigger };
export { HDropdownMenu as DropdownMenu };
export { HDropdownItem as DropdownItem };
export { HDropdownSection as DropdownSection };

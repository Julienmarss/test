"use client";

import * as React from "react";
import { DatePicker as HDatePicker } from "@heroui/react";

export type HDatePickerProps = React.ComponentProps<typeof HDatePicker>;

/**
 * Passe-plat du HeroUI DatePicker :
 * - forwardRef
 * - forward de toutes les props sans logique supplémentaire
 */
const DatePicker = React.forwardRef<HTMLDivElement, HDatePickerProps>((props, ref) => {
	return (
		<HDatePicker
			variant="bordered"
			labelPlacement="outside"
			classNames={{
				inputWrapper:
					"border border-gray-200 bg-white rounded-md min-h-[36px] h-[36px] " +
					"!transition-all !duration-200 !ease-out " +
					"data-[hover=true]:border-gray-300 " +
					"data-[focus=true]:!border-sky-700 " +
					"data-[focus=true]:shadow-[0_0_0_4px_rgba(116,212,255,1)]",
				label: "-translate-y-[calc(4px)] text-gray-900 start-0 ",
			}}
			ref={ref}
			{...props}
		/>
	);
});

DatePicker.displayName = "DatePicker";
export default DatePicker;

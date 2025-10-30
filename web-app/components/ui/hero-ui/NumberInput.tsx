"use client";

import * as React from "react";
import { NumberInput as SourceNumberInput } from "@heroui/react";

export type HeroNumberInputProps = React.ComponentPropsWithoutRef<typeof SourceNumberInput>;
export type HeroNumberInputRef = React.ElementRef<typeof SourceNumberInput>;

const NumberInput = React.forwardRef<HeroNumberInputRef, HeroNumberInputProps>((props, ref) => (
	<SourceNumberInput
		ref={ref}
		variant="bordered"
		labelPlacement="outside"
		classNames={{
			inputWrapper:
				"border border-gray-200 bg-white rounded-md min-h-[36px] h-[36px] " +
				"!transition-all !duration-200 !ease-out " +
				"data-[hover=true]:border-gray-300 " +
				"data-[focus=true]:!border-sky-700 " +
				"data-[focus=true]:shadow-[0_0_0_4px_rgba(116,212,255,1)]",
			label: "-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] text-gray-900 start-0 ",
			clearButton: "text-gray-400",
		}}
		{...props}
	/>
));

NumberInput.displayName = "HeroNumberInput";
export default NumberInput;

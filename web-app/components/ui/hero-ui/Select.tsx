"use client";
import * as React from "react";
import {
	Select as HSelect,
	SelectItem as HSelectItem,
	SelectSection as HSelectSection,
	type SelectProps as HSelectProps,
	type SelectItemProps as HSelectItemProps,
	type SelectSectionProps as HSelectSectionProps,
} from "@heroui/react";
import { ChevronUpDown } from "../icons/ChevronUpDown";

export const Select = React.forwardRef<HTMLSelectElement, HSelectProps<any>>(({ children, ...rest }, ref) => (
	<HSelect
		ref={ref}
		{...rest}
		selectorIcon={<ChevronUpDown className="size-5 text-gray-400" />}
		labelPlacement="outside"
		variant="bordered"
		classNames={{
			trigger:
				"border border-gray-200 rounded-md min-h-[36px] h-[36px] " +
				"!transition-all !duration-200 !ease-out " +
				"data-[hover=true]:border-gray-300 " +
				"data-[open=true]:!border-sky-700 " +
				"data-[open=true]:shadow-[0_0_0_4px_rgba(116,212,255,1)]",
			label: "-translate-y-[calc(100%_+_theme(fontSize.small)/2_+_20px)] text-gray-900 start-0 ",
			popoverContent: "rounded-md ",
		}}
	>
		{children}
	</HSelect>
));
Select.displayName = "Select";

const _SelectItem: React.FC<HSelectItemProps> = ({ children, ...rest }) => (
	<HSelectItem {...rest}>{children}</HSelectItem>
);
// @ts-expect-error
_SelectItem.getCollectionNode = (HSelectItem as any).getCollectionNode;

const _SelectSection: React.FC<HSelectSectionProps> = ({ children, ...rest }) => (
	<HSelectSection {...rest}>{children}</HSelectSection>
);
// @ts-expect-error
_SelectSection.getCollectionNode = (HSelectSection as any).getCollectionNode;

export { _SelectItem as SelectItem, _SelectSection as SelectSection };

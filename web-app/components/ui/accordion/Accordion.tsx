"use client";
import * as React from "react";
import {
	Accordion as HAccordion,
	AccordionItem as HAccordionItem,
	type AccordionProps as HAccordionProps,
	type AccordionItemProps as HAccordionItemProps,
} from "@heroui/react";

export const Accordion = React.forwardRef<HTMLDivElement, HAccordionProps>(({ children, ...rest }, ref) => (
	<HAccordion
		className="border-spacing-6 rounded-xl border border-gray-200 bg-white px-0"
		itemClasses={{
			trigger: "py-6 px-6",
			content: "p-6 pt-0",
			title: "font-medium leading-7 text-lg",
		}}
		defaultExpandedKeys={["1"]}
		ref={ref}
		{...rest}
	>
		{children}
	</HAccordion>
));
Accordion.displayName = "Accordion";

const _AccordionItem: React.FC<HAccordionItemProps> = ({ children, ...rest }) => (
	<HAccordionItem {...rest}>{children}</HAccordionItem>
);

// @ts-expect-error
_AccordionItem.getCollectionNode = (HAccordionItem as any).getCollectionNode;

export { _AccordionItem as AccordionItem };

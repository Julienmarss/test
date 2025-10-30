"use client";
import * as React from "react";
import {
	Modal as HModal,
	ModalContent as HModalContent,
	ModalHeader as HModalHeader,
	ModalBody as HModalBody,
	ModalFooter as HModalFooter,
	useDisclosure,
} from "@heroui/react";
import { XMark } from "../icons/XMark";
import { ArrowLeft } from "../icons/ArrowLeft";
import { cn } from "@/utils/lib";

/** Modal */
type HModalProps = React.ComponentProps<typeof HModal>;
export const Modal = React.forwardRef<HTMLDivElement, HModalProps>(function Modal({ children, ...rest }, ref) {
	return (
		<HModal
			hideCloseButton
			ref={ref as any}
			{...rest}
			classNames={{
				base: "shadow-2xl rounded-lg overflow-hidden",
				body: "bg-gray-100",
				header: "border-b border-gray-200 flex justify-between items-center relative min-h-[80px] text-center",
				footer: "border-t border-gray-200",
			}}
		>
			{children}
		</HModal>
	);
});
Modal.displayName = "Modal";

/** ModalContent */
type HModalContentProps = React.ComponentProps<typeof HModalContent>;
export function ModalContent({ children, ...rest }: HModalContentProps) {
	return <HModalContent {...rest}>{children}</HModalContent>;
}

/** ModalHeader */
type HModalHeaderProps = React.ComponentProps<typeof HModalHeader> & {
	onClose?: () => void;
	onReturn?: () => void;
	showReturn?: boolean;
};
export function ModalHeader({ children, onClose, onReturn, showReturn = false, ...rest }: HModalHeaderProps) {
	return (
		<HModalHeader {...rest}>
			<button
				type="button"
				onClick={onReturn}
				className={cn(
					"pointer-events-none opacity-0 transition",
					showReturn && "pointer-events-auto cursor-pointer opacity-100 hover:opacity-50",
				)}
			>
				<ArrowLeft className="size-4" />
			</button>
			<section className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-sm font-normal leading-5 text-sky-600 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:leading-6 [&_h1]:text-sky-900">
				{children}
			</section>
			<button type="button" onClick={onClose} className="transition hover:opacity-50">
				<XMark className="size-4" />
			</button>
		</HModalHeader>
	);
}

/** ModalBody */
type HModalBodyProps = React.ComponentProps<typeof HModalBody>;
export function ModalBody({ children, ...rest }: HModalBodyProps) {
	return <HModalBody {...rest}>{children}</HModalBody>;
}

/** ModalFooter */
type HModalFooterProps = React.ComponentProps<typeof HModalFooter>;
export function ModalFooter({ children, ...rest }: HModalFooterProps) {
	return <HModalFooter {...rest}>{children}</HModalFooter>;
}

export { useDisclosure };

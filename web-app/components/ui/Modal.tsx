import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/utils/lib";
import * as React from "react";

type ClassNames = Partial<{
	content: string;
	header: string;
	title: string;
	body: string;
	footer: string;
}>;

type Props = {
	title: string;
	subtitle?: string;
	open: boolean;
	onClose: (open: boolean) => void;
	children: React.ReactNode;
	footer?: React.ReactNode;
	closable?: boolean;
	classNames?: ClassNames;
};

export const Modal = ({ open, onClose, title, subtitle, children, footer, closable = true, classNames }: Props) => {
	const cx = {
		content: cn("h-full md:max-w-[80vw] md:h-auto p-0 gap-0 z-[200]", classNames?.content),
		header: cn(classNames?.header),
		title: cn("text-center flex flex-col gap-2 font-semibold text-sky-900 border-b p-4", classNames?.title),
		body: cn(
			"flex justify-center items-center bg-gray-50 overflow-y-auto",
			!footer && "min-h-[80vh]",
			classNames?.body,
		),
		footer: cn("flex justify-end items-center py-4 px-8 bg-white", classNames?.footer),
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className={cx.content} closable={closable}>
				<DialogHeader className={cx.header}>
					<DialogTitle className={cx.title}>
						{title}
						{subtitle && <span className="text-sm font-normal text-sky-600">{subtitle}</span>}
					</DialogTitle>
				</DialogHeader>

				<div className={cx.body}>{children}</div>

				{footer && <div className={cx.footer}>{footer}</div>}

				{closable && <DialogClose />}
			</DialogContent>
		</Dialog>
	);
};

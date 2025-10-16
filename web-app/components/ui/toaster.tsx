"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, Loader, XCircleIcon } from "lucide-react";
import { cn } from "@/utils/lib";
import { JSX } from "react";

type ToastVariant = "success" | "error" | "info" | "warning" | "default" | "destructive" | "wip";

const successAndDefault = {
	icon: <CheckCircleIcon className="mt-0.5 h-5 w-5 text-green-600" />,
	bg: "bg-white",
	text: "text-gray-900",
	description: "text-gray-500",
};

const errorAndDestructive = {
	icon: <XCircleIcon className="mt-0.5 h-5 w-5 text-red-600" />,
	bg: "bg-white",
	text: "text-gray-900",
	description: "text-gray-500",
};

const variantStyles: Record<
	ToastVariant,
	{
		icon: JSX.Element;
		bg: string;
		text: string;
		description: string;
	}
> = {
	default: successAndDefault,
	success: successAndDefault,
	error: errorAndDestructive,
	destructive: errorAndDestructive,
	info: {
		icon: <InfoIcon className="mt-0.5 h-5 w-5 text-blue-600" />,
		bg: "bg-white",
		text: "text-gray-900",
		description: "text-gray-500",
	},
	wip: {
		icon: <Loader className="mt-0.5 h-5 w-5 animate-spin text-blue-600" />,
		bg: "bg-white",
		text: "text-gray-900",
		description: "text-gray-500",
	},
	warning: {
		icon: <AlertTriangleIcon className="mt-0.5 h-5 w-5 text-yellow-600" />,
		bg: "bg-white",
		text: "text-gray-900",
		description: "text-gray-500",
	},
};

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, variant = "success", ...props }) => {
				const styles = variantStyles[variant!];
				return (
					<Toast
						key={id}
						{...props}
						className={cn("flex w-[360px] items-start gap-4 rounded-xl border p-4 shadow-lg", styles.bg)}
					>
						<div>{styles.icon}</div>
						<div className="grid flex-1 gap-1">
							{title && <ToastTitle className={cn("text-sm font-semibold", styles.text)}>{title}</ToastTitle>}
							{description && (
								<ToastDescription className={cn("text-sm", styles.description)}>{description}</ToastDescription>
							)}
						</div>
						<ToastClose className="text-gray-400 transition hover:text-gray-600" />
					</Toast>
				);
			})}
			<ToastViewport className="fixed right-4 top-4 z-50 flex flex-col gap-3" />
		</ToastProvider>
	);
}

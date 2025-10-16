"use client";
import * as React from "react";
import { Button } from "@/components/ui/hero-ui/Button";
import { Modal } from "./Modal";

type ConfirmDeleteModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
	confirmLabel?: string;
	isLoading?: boolean;
	onConfirm: () => void;
};

export function ConfirmDeleteModal({
	open,
	onOpenChange,
	title,
	subtitle,
	children,
	confirmLabel = "Supprimer",
	isLoading = false,
	onConfirm,
}: ConfirmDeleteModalProps) {
	return (
		<Modal
			open={open}
			onClose={onOpenChange}
			title={title}
			subtitle={subtitle}
			closable={!isLoading}
			footer={
				<div className="flex gap-3">
					<Button type="button" intent="plain" onClick={() => onOpenChange(false)} isDisabled={isLoading}>
						Annuler
					</Button>
					<Button type="button" color="danger" onClick={onConfirm} isLoading={isLoading} isDisabled={isLoading}>
						{confirmLabel}
					</Button>
				</div>
			}
			classNames={{ content: "w-auto" }}
		>
			<div className="w-full p-6">{children}</div>
		</Modal>
	);
}

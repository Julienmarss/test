"use client";
import { RightResponse, useDeleteRight } from "@/api/company/right.api";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Trash } from "@/components/ui/icons/Trash";
import { useCompany } from "@/components/utils/CompanyProvider";
import { toast } from "@/hooks/use-toast";
import type { UUID } from "node:crypto";
import * as React from "react";

export default function RightToAdminRemove({ item }: { item: RightResponse; onDeleted: (id: UUID) => void }) {
	const { company } = useCompany();
	const [open, setOpen] = React.useState(false);

	const del = useDeleteRight();

	const onConfirmDelete = async () => {
		try {
			await del.mutateAsync({ userId: item.user.id, companyId: company.id });

			toast({
				title: `Membre exclus`,
				description: `${item.user.firstname} ${item.user.lastname.toUpperCase()} a été exclu de votre liste de membres.`,
				variant: "default",
			});

			setOpen(false);
		} catch {
			toast({
				title: "Suppression impossible",
				description: "Une erreur est survenue pendant la suppression.",
				variant: "destructive",
			});
		}
	};

	return (
		<>
			<button type="button" className="justify-self-end" onClick={() => setOpen(true)}>
				<Trash className="size-5 text-red-500 transition-opacity hover:opacity-50" />
			</button>

			<ConfirmDeleteModal
				open={open}
				onOpenChange={setOpen}
				title="Exclure un membre"
				isLoading={del.isPending}
				onConfirm={onConfirmDelete}
				confirmLabel="Supprimer"
			>
				<p className="text-sm text-gray-600">
					Cette action supprimera le droit de {item.user.firstname} {item.user.lastname.toUpperCase()} dans votre
					entreprise.
				</p>
			</ConfirmDeleteModal>
		</>
	);
}

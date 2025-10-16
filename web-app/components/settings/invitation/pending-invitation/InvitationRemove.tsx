"use client";
import { InvitationResponse, useDeleteInvitation } from "@/api/company/invitation.api";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Trash } from "@/components/ui/icons/Trash";
import { useCompany } from "@/components/utils/CompanyProvider";
import { toast } from "@/hooks/use-toast";
import * as React from "react";

export default function InvitationRemove({ invitation }: { invitation: InvitationResponse }) {
	const { company } = useCompany();
	const [open, setOpen] = React.useState(false);

	const del = useDeleteInvitation();

	const onConfirmDelete = async () => {
		try {
			await del.mutateAsync({
				invitationId: invitation.id,
				companyId: company.id,
			});

			toast({
				title: "Invitation supprimée",
				description: `${invitation.email} a été retiré de la liste.`,
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
			<button type="button" onClick={() => setOpen(true)} aria-label="Supprimer l’invitation">
				<Trash className="size-5" />
			</button>

			<ConfirmDeleteModal
				open={open}
				onOpenChange={setOpen}
				title="Supprimer l’invitation ?"
				subtitle={invitation.email}
				isLoading={del.isPending}
				onConfirm={onConfirmDelete}
				confirmLabel="Supprimer"
			>
				<p className="text-sm">
					Cette action supprimera l’invitation envoyée à <strong>{invitation.email}</strong>.
				</p>
			</ConfirmDeleteModal>
		</>
	);
}

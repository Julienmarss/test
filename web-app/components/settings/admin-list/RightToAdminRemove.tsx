"use client";
import { CompanyAdministratorInfo, useRemoveAdministrator } from "@/api/company/right.api";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Trash } from "@/components/ui/icons/Trash";
import { useCompany } from "@/components/utils/CompanyProvider";
import * as React from "react";

export default function RightToAdminRemove({ item }: { item: CompanyAdministratorInfo }) {
    const { company } = useCompany();
    const [open, setOpen] = React.useState(false);

    const removeAdmin = useRemoveAdministrator();

    const onConfirmDelete = async () => {
        try {
            await removeAdmin.mutateAsync({
                companyId: company.id,
                administratorId: item.administratorId
            });
            setOpen(false);
        } catch {
        }
    };

    return (
        <>
            <button
                type="button"
                className="justify-self-end disabled:opacity-50"
                onClick={() => setOpen(true)}
                disabled={removeAdmin.isPending}
            >
                <Trash className="size-5 text-red-500 transition-opacity hover:opacity-50" />
            </button>

            <ConfirmDeleteModal
                open={open}
                onOpenChange={setOpen}
                title="Exclure un membre"
                isLoading={removeAdmin.isPending}
                onConfirm={onConfirmDelete}
                confirmLabel="Supprimer"
            >
                <p className="text-sm text-gray-600">
                    Cette action supprimera le droit de {item.firstname} {item.lastname.toUpperCase()} dans votre entreprise.
                </p>
            </ConfirmDeleteModal>
        </>
    );
}
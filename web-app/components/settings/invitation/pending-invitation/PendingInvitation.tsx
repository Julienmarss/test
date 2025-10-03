import { InvitationResponse } from "@/api/company/invitation.api";
import AccordionSubtitle from "@/components/ui/accordion/AccordionSubtitle";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/ui/hero-ui/Table";
import { Spinner } from "@heroui/react";
import type { Key } from "@react-types/shared";
import InvitationRemove from "./InvitationRemove";

type Column = { key: "email" | "right" | "status" | "expiresAt" | "remove"; value: string };

const columns: Column[] = [
    { key: "email", value: "Email" },
    { key: "right", value: "Droit" },
    { key: "status", value: "Statut" },
    { key: "expiresAt", value: "Expire le" },
    { key: "remove", value: " " },
];

const statusLabels: Record<string, string> = {
    PENDING: "En attente",
    ACCEPTED: "Acceptée",
    EXPIRED: "Expirée",
    CANCELLED: "Annulée",
};

export default function PendingInvitation({
                                              isLoading = false,
                                              isError = false,
                                              invitations,
                                          }: {
    isLoading: boolean;
    isError: boolean;
    invitations: InvitationResponse[];
}) {
    const renderCell = (item: InvitationResponse, columnKey: Key) => {
        switch (columnKey) {
            case "email":
                return item.email;
            case "right":
                return item.rights;
            case "status":
                return (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            item.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "ACCEPTED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                        }`}
                    >
						{statusLabels[item.status] || item.status}
					</span>
                );
            case "expiresAt":
                return new Date(item.expiresAt).toLocaleDateString("fr-FR");
            case "remove":
                return <InvitationRemove invitation={item} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <AccordionSubtitle>Invitations en attente</AccordionSubtitle>

            <Table aria-label="Invitations en attente">
                <TableHeader columns={columns}>
                    {(column: Column) => <TableColumn key={column.key}>{column.value}</TableColumn>}
                </TableHeader>

                <TableBody
                    items={!isLoading && !isError ? invitations : []}
                    emptyContent={
                        isError ? (
                            <p className="text-sm text-red-500">Erreur lors de la récupération des invitations</p>
                        ) : (
                            "Aucune invitation en attente"
                        )
                    }
                    isLoading={isLoading}
                    loadingContent={<Spinner label="Chargement..." />}
                >
                    {(item: InvitationResponse) => (
                        <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
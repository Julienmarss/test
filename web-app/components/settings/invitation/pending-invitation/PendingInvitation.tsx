import { InvitationResponse } from "@/api/company/invitation.api";
import AccordionSubtitle from "@/components/ui/accordion/AccordionSubtitle";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/ui/hero-ui/Table";
import { Spinner } from "@heroui/react";
import type { Key } from "@react-types/shared";
import InvitationRemove from "./InvitationRemove";

type Column = { key: "email" | "right" | "remove"; value: string };

const columns: Column[] = [
	{ key: "email", value: "Email" },
	{ key: "right", value: "Droit" },
	{ key: "remove", value: " " },
];

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
				return item.right;
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

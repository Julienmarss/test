"use client";
import {
	CompanyAdministratorInfo,
	useCompanyAdministrators,
	useUpdateAdministratorRights,
} from "@/api/company/right.api";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/ui/hero-ui/Table";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { Spinner } from "@heroui/react";
import { Key } from "@react-types/shared";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import RightToAdminRemove from "./RightToAdminRemove";

export default function RightToAdminTable() {
	type Column = { key: "user" | "right" | "remove"; value: string };

	const columns: Column[] = [
		{ key: "user", value: "Utilisateur" },
		{ key: "right", value: "Droit" },
		{ key: "remove", value: " " },
	];

	const { company } = useSelectedCompany();
	const { data: session } = useSession();
	const currentUserId = session?.user?.id;

	const { data: items = [], isLoading, isError } = useCompanyAdministrators(company.id);
	const updateRights = useUpdateAdministratorRights();

	const currentUserInfo = items.find((item) => item.administratorId === currentUserId);
	const isCurrentUserOwner = currentUserInfo?.rights === "OWNER";

	const rightOptions = [
		{ key: "OWNER", label: "Propriétaire" },
		{ key: "MANAGER", label: "Responsable" },
	];

	const renderCell = useCallback(
		(item: CompanyAdministratorInfo, columnKey: Key) => {
			const isCurrentUser = item.administratorId === currentUserId;
			const isItemOwner = item.rights === "OWNER";

			switch (columnKey) {
				case "user":
					return (
						<div>
							<p>
								{item.firstname} {item.lastname.toUpperCase()}
								{isCurrentUser && <span className="ml-2 text-xs text-gray-500">(Vous)</span>}
							</p>
							<p className="text-xs text-gray-500">{item.email}</p>
						</div>
					);
				case "right":
					if (isCurrentUser) {
						return (
							<div className="flex items-center gap-2">
								<span
									className={`rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 ${item.rights === "OWNER" && "bg-purple-100 text-purple-800"} ${item.rights === "MANAGER" && "bg-blue-100 text-blue-800"} }`}
								>
									{item.rights === "OWNER" ? "Propriétaire" : item.rights === "MANAGER" ? "Responsable" : "Observateur"}
								</span>
							</div>
						);
					}

					if (!isCurrentUserOwner) {
						return (
							<span
								className={`rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 ${item.rights === "OWNER" && "bg-purple-100 text-purple-800"} ${item.rights === "MANAGER" && "bg-blue-100 text-blue-800"} `}
							>
								{item.rights === "OWNER" ? "Propriétaire" : item.rights === "MANAGER" ? "Responsable" : "Observateur"}
							</span>
						);
					}

					return (
						<Select
							selectedKeys={[item.rights]}
							onSelectionChange={(keys) => {
								const newRight = Array.from(keys)[0] as "OWNER" | "MANAGER" | "READONLY";
								if (newRight && newRight !== item.rights) {
									updateRights.mutate({
										companyId: company.id,
										administratorId: item.administratorId,
										rights: newRight,
									});
								}
							}}
							isDisabled={updateRights.isPending}
							aria-label="Modifier les droits"
						>
							{rightOptions.map((option) => (
								<SelectItem key={option.key}>{option.label}</SelectItem>
							))}
						</Select>
					);
				case "remove":
					if (isCurrentUser) {
						return null;
					}
					if (!isCurrentUserOwner) {
						return null;
					}
					return <RightToAdminRemove item={item} />;
				default:
					return <p>--</p>;
			}
		},
		[company.id, updateRights, currentUserId, isCurrentUserOwner],
	);

	return (
		<Table aria-label="Droits des administrateurs">
			<TableHeader columns={columns}>
				{(column: Column) => <TableColumn key={column.key}>{column.value}</TableColumn>}
			</TableHeader>
			<TableBody
				items={!isError ? items : []}
				isLoading={isLoading}
				emptyContent={
					isError ? (
						<p className="text-sm text-red-500">
							Erreur lors de la récupération des administrateurs de votre entreprise
						</p>
					) : (
						"Il n'y a aucun administrateur dans votre entreprise"
					)
				}
				loadingContent={<Spinner label="Chargement..." />}
			>
				{(item: CompanyAdministratorInfo) => (
					<TableRow key={item.administratorId}>
						{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

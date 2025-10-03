"use client";
import { RightResponse, useRights } from "@/api/company/right.api";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/ui/hero-ui/Table";
import { useCompany } from "@/components/utils/CompanyProvider";
import { Spinner } from "@heroui/react";
import { Key } from "@react-types/shared";
import { useQueryClient } from "@tanstack/react-query";
import type { UUID } from "node:crypto";
import { useCallback } from "react";
import RightToAdminRemove from "./RightToAdminRemove";

export default function RightToAdminTable() {
	type Column = { key: "user" | "right" | "remove"; value: string };

	const columns: Column[] = [
		{ key: "user", value: "Utilisateur" },
		{ key: "right", value: "Droit" },
		{ key: "remove", value: " " },
	];

	const { company } = useCompany();
	const qc = useQueryClient();

	const { data: items = [], isLoading, isError } = useRights(company.id);

	const handleDeleted = (userId: UUID) => {
		const key = ["rights", { companyId: company.id }] as const;
		qc.setQueryData<RightResponse[]>(key, (old = []) => old.filter((i) => i.user.id !== userId));
	};

	const renderCell = useCallback(
		(item: RightResponse, columnKey: Key) => {
			switch (columnKey) {
				case "user":
					return (
						<div>
							<p>
								{item.user.firstname} {item.user.lastname.toUpperCase()}
							</p>
							<p className="text-xs text-gray-500">{item.user.email}</p>
						</div>
					);
				case "right":
					return (
						<Select selectedKeys={[item.right]} isDisabled>
							<SelectItem key={item.right}>{item.right}</SelectItem>
						</Select>
					);
				case "remove":
					return <RightToAdminRemove item={item} onDeleted={handleDeleted} />;
				default:
					return <p>--</p>;
			}
		},
		[handleDeleted],
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
				{(item: RightResponse) => (
					<TableRow key={item.user.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

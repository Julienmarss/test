"use client";
import { CompanyAdministratorInfo, useCompanyAdministrators, useUpdateAdministratorRights } from "@/api/company/right.api";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/ui/hero-ui/Table";
import { useCompany } from "@/components/utils/CompanyProvider";
import { Spinner } from "@heroui/react";
import { Key } from "@react-types/shared";
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

    const { data: items = [], isLoading, isError } = useCompanyAdministrators(company.id);
    const updateRights = useUpdateAdministratorRights();

    const rightOptions = [
        { key: "OWNER", label: "Propriétaire" },
        { key: "MANAGER", label: "Responsable" },
        { key: "READONLY", label: "Observateur" },
    ];

    const renderCell = useCallback(
        (item: CompanyAdministratorInfo, columnKey: Key) => {
            switch (columnKey) {
                case "user":
                    return (
                        <div>
                            <p>
                                {item.firstname} {item.lastname.toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                    );
                case "right":
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
                        >
                            {rightOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    );
                case "remove":
                    return <RightToAdminRemove item={item} />;
                default:
                    return <p>--</p>;
            }
        },
        [company.id, updateRights]
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
                        <p className="text-sm text-red-500">Erreur lors de la récupération des administrateurs de votre entreprise</p>
                    ) : (
                        "Il n'y a aucun administrateur dans votre entreprise"
                    )
                }
                loadingContent={<Spinner label="Chargement..." />}
            >
                {(item: CompanyAdministratorInfo) => (
                    <TableRow key={item.administratorId}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
                )}
            </TableBody>
        </Table>
    );
}
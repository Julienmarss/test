import { UUID } from "node:crypto";
import { CollaboratorRaw } from "@/app/admin/components/CollaboratorRaw";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { FonctionColumn } from "@/app/admin/components/columns/FonctionColumn";
import { ResponsibleColumn } from "@/app/admin/components/columns/ResponsibleColumn";
import { ContractColumn } from "@/app/admin/components/columns/ContractColumn";
import { BeginDateColumn } from "@/app/admin/components/columns/BeginDateColumn";
import { RemunerationColumn } from "@/app/admin/components/columns/RemunerationColumn";
import { StatusColumn } from "@/app/admin/components/columns/StatusColumn";
import { Filters } from "./table.service";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import {  useState } from "react";
import { useDeleteCollaborator } from "@/api/collaborator/collaborators.api";
import { useCompany } from "@/components/utils/CompanyProvider";
import NameColumn from "./columns/NameColumn";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    filters: Filters;
    setPartialFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
    collaborators: CollaboratorResponse[],
    allCollaborators:CollaboratorResponse[],
    selectedCollaborators: CollaboratorResponse[],
    setSelectedCollaborators: React.Dispatch<React.SetStateAction<CollaboratorResponse[]>>,
};

export const MyCollaboratorsTable = ({
    filters,
    setPartialFilter,
    collaborators,
    allCollaborators,
    selectedCollaborators,
    setSelectedCollaborators,
}: Props) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [collaboratorSelected, setCollaboratorSelected] = useState<any>();
    const { mutate: deleteCollaborator } = useDeleteCollaborator();
    const { company } = useCompany()

    const handleConfirmDelete = async() => {
        await deleteCollaborator({
            collaboratorId: collaboratorSelected,
            companyId: company.id
        })
        setOpenConfirm(false);
    }

    const handleOpenConfirm = (collaboratorId: string) => {
        setCollaboratorSelected(collaboratorId);
        setOpenConfirm(true);
    }

    // const getContractBadge = (contract?: string) => {
    //     if (!contract) {
    //         return 'bg-gray-100 text-gray-800';
    //     }
    //     const colors = {
    //         'CDI': 'bg-blue-100 text-blue-800',
    //         'CDD': 'bg-purple-100 text-purple-800',
    //         'EXT': 'bg-orange-100 text-orange-800',
    //         'PRO': 'bg-green-100 text-green-800'
    //     };
    //     return colors[contract] || 'bg-gray-100 text-gray-800';
    // };

    const toggleEmployee = (id: UUID) => {
        const isSelected = selectedCollaborators.some(collab => collab.id === id);

        if (isSelected) {
            setSelectedCollaborators(selectedCollaborators.filter(collab => collab.id !== id));
        } else {
            const collaboratorToAdd = collaborators.find(collab => collab.id === id);
            if (collaboratorToAdd) {
                setSelectedCollaborators([...selectedCollaborators, collaboratorToAdd]);
            }
        }
    };

    const toggleAll = () => {
        if (selectedCollaborators.length === collaborators.length) {
            setSelectedCollaborators([]);
        } else {
            setSelectedCollaborators([...collaborators]);
        }
    };

    return (
        <>
            <div className="overflow-x-auto bg-white">
                <table className="w-full">
                    <thead className="border border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <Checkbox
                                    checked={selectedCollaborators.length === collaborators.length}
                                    onCheckedChange={toggleAll}
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <NameColumn filter={filters?.name} setFilter={(value) => setPartialFilter("name", value)} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <FonctionColumn
                                    collaborators={allCollaborators} filteredCollaborators={collaborators}
                                    filter={filters.function} setFilter={(value) => setPartialFilter("function", value)} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <ResponsibleColumn
                                    collaborators={allCollaborators} filteredCollaborators={collaborators}
                                    filter={filters.manager} setFilter={(value) => setPartialFilter("manager", value)} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <ContractColumn
                                    filteredCollaborators={collaborators}
                                    filter={filters.contract} setFilter={(value) => setPartialFilter("contract", value)} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <BeginDateColumn
                                    filteredCollaborators={collaborators}
                                    filter={filters.date} setFilter={(val) => setPartialFilter("date", val)} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <RemunerationColumn
                                    filteredCollaborators={collaborators}
                                    filter={filters.compensation} setFilter={(val) => setPartialFilter("compensation", val)} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider">
                                <StatusColumn
                                    collaborators={collaborators} filteredCollaborators={collaborators}
                                    filter={filters.status} setFilter={(value) => setPartialFilter("status", value)} />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {collaborators.map((collaborator) => (
                            <CollaboratorRaw key={collaborator.id} collaborator={collaborator}
                                selectedCollaborators={selectedCollaborators} toggleEmployee={toggleEmployee} handleOpenConfirm={handleOpenConfirm} />
                        ))}
                    </tbody>
                </table>
            </div>
            {openConfirm && <ConfirmDeleteDialog open={openConfirm} setOpen={setOpenConfirm} handleConfirm={handleConfirmDelete} />}
        </>
    );
};
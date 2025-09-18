import { UUID } from "node:crypto";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { getStatusBorderColor, getStatusColor } from "./table.service";
import React, { useState } from "react";
import Badge, { IconType } from "@/components/ui/Badge";
import { Trash2 } from "lucide-react";
import { useCompany } from "@/components/utils/CompanyProvider";
import { useDeleteCollaborator } from "@/api/collaborator/collaborators.api";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type Props = {
    collaborators: CollaboratorResponse[],
    selectedCollaborators: CollaboratorResponse[],
    setSelectedCollaborators: React.Dispatch<React.SetStateAction<CollaboratorResponse[]>>,
};

export const MyCollaboratorsTrombinoscope = ({
    collaborators,
    selectedCollaborators,
    setSelectedCollaborators
}: Props) => {
    const router = useRouter();
    const { company } = useCompany()
    const { mutate: deleteCollaborator } = useDeleteCollaborator();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [collaboratorSelected, setCollaboratorSelected] = useState<any>();

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

    const handleConfirmDelete = async () => {
        await deleteCollaborator({
            collaboratorId: collaboratorSelected,
            companyId: company.id
        })
        setOpenConfirm(false);
    }

    return (
        <div className="overflow-x-auto bg-gray-50 grid grid-cols-1 px-2 md:grid-cols-3 gap-4 md:px-14 py-10">
            {collaborators.length > 0 && collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex flex-col p-4 bg-white border-gray-200 border rounded-xl gap-x-4">
                    <section className="flex w-full items-center md:items-start justify-between">
                        <Checkbox
                            checked={selectedCollaborators.includes(collaborator)}
                            onCheckedChange={() => toggleEmployee(collaborator.id)}
                        />

                        {selectedCollaborators.includes(collaborator) && (
                            <button className="text-red-600 hover:text-red-900 ml-3" onClick={() => {
                                setCollaboratorSelected(collaborator.id)
                                setOpenConfirm(true);
                            }}>
                                <Trash2 size={16} />
                            </button>
                        )}
                    </section>


                    <div className="flex flex-row gap-4 w-full cursor-pointer ml-4 mb-4"
                        onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                        <div className="flex-shrink-0 w-28 cursor-pointer"
                            onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                            {collaborator.picture && collaborator.picture.length > 0 ?
                                (
                                    <img src={collaborator.picture}
                                        alt={`Photo de ${collaborator.firstname} ${collaborator.lastname}`}
                                        className={`w-28 h-28 rounded-full bg-white ${getStatusBorderColor(collaborator.status)}`} />
                                ) : (
                                    <div
                                        className={`w-28 h-28 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-3xl text-blue-700 font-medium`}>
                                        {(collaborator.firstname?.[0] ?? '') + (collaborator.lastname?.[0] ?? '')}
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex flex-col items-start gap-2">
                            <span className="flex items-center gap-2 text-gray-900 justify-center md:justify-start">
                                {collaborator.firstname || '--'} {collaborator.lastname || '--'}
                                <div className={`h-2 w-2 rounded-full ${getStatusColor(collaborator.status)}`}></div>
                            </span>

                            <div className="flex flex-col items-start gap-2">
                                {[
                                    {
                                        label: 'Fonction :',
                                        icon: 'Briefcase',
                                        value: collaborator.professionalSituation?.jobTitle
                                    },
                                    {
                                        label: 'Contrat :',
                                        icon: 'DocumentText',
                                        value: collaborator.professionalSituation?.contractType
                                    },
                                    {
                                        label: 'Responsable :',
                                        icon: 'User',
                                        value: collaborator.professionalSituation?.responsible
                                    }
                                ].map((item) => (
                                    <div className="flex items-center gap-2" key={item.label}>
                                        <Badge icon={item.icon as IconType} text={item.value} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {openConfirm && <ConfirmDeleteDialog open={openConfirm} setOpen={setOpenConfirm} handleConfirm={handleConfirmDelete} />}
        </div>
    );
};
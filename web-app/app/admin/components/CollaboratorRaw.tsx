'use client';

import {useRouter} from "next/navigation";
import {Trash2} from "lucide-react";
import {UUID} from "node:crypto";
import {CollaboratorResponse, StatusResponseCollaborator} from "@/api/collaborator/collaborators.dto";
import {getStatusBorderColor, getStatusColorCollaborator} from "./table.service";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    collaborator: CollaboratorResponse,
    selectedCollaborators: CollaboratorResponse[],
    toggleEmployee: (id: UUID) => void,
    handleOpenConfirm: (id: UUID) => void
};
export const CollaboratorRaw = ({collaborator, selectedCollaborators, toggleEmployee, handleOpenConfirm}: Props) => {
    const router = useRouter();

    return (
        <tr key={collaborator.id} className="hover:bg-gray-100 odd:bg-gray-50 hover:cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap">
                <Checkbox
                    checked={selectedCollaborators.includes(collaborator)}
                    onCheckedChange={() => toggleEmployee(collaborator.id)}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap"
                onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10">
                        {collaborator.picture && collaborator.picture.length > 0 ?
                            (
                                <img src={collaborator.picture}
                                     alt={`Photo de ${collaborator.firstname} ${collaborator.lastname}`}
                                     className={`w-8 h-8 rounded-full bg-white ${getStatusBorderColor(collaborator.status)}`}/>
                            ) : (
                                <div
                                    className="w-8 h-8 bg-sky-300 rounded-full flex items-center justify-center text-sm font-medium">
                                    {(collaborator.firstname?.[0] ?? '') + (collaborator.lastname?.[0] ?? '')}
                                </div>
                            )
                        }
                    </div>
                    <div className="ml-4">
                        <span className="text-sm font-medium text-gray-900">
                            {collaborator.firstname || '--'} {collaborator.lastname || '--'}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"
                onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                <div className="text-sm text-gray-500">
                    {collaborator.professionalSituation?.jobTitle || '--'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"
                onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                <div className="text-sm text-gray-500">
                    {collaborator.professionalSituation?.responsible || '--'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className="inline-flex px-2 py-1 text-xs rounded-full text-gray-500">
                    {collaborator.professionalSituation?.contractType || '--'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"
                onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                <div className="text-sm text-gray-500">
                    {collaborator.professionalSituation?.hireDate || '--'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap"
                onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}>
                <div className="text-sm text-gray-500">
                    {collaborator.contractInformations?.annualSalary ? collaborator.contractInformations?.annualSalary + ' €' : '--'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center ml-4">
                    <div
                        className={`h-2 w-2 rounded-full ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator)}`}></div>
                    {selectedCollaborators.includes(collaborator) && (
                        <button className="text-red-600 hover:text-red-900 ml-3"
                                onClick={() => handleOpenConfirm(collaborator.id)}>
                            <Trash2 size={16}/>
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};
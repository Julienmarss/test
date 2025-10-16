"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { UUID } from "node:crypto";
import { CollaboratorResponse, StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";
import { getStatusBorderColor, getStatusColorCollaborator } from "./table.service";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
	collaborator: CollaboratorResponse;
	selectedCollaborators: CollaboratorResponse[];
	toggleEmployee: (id: UUID) => void;
	handleOpenConfirm: (id: UUID) => void;
};
export const CollaboratorRaw = ({ collaborator, selectedCollaborators, toggleEmployee, handleOpenConfirm }: Props) => {
	const router = useRouter();

	return (
		<tr
			key={collaborator.id}
			className="hover:cursor-pointer [&>td]:px-4 [&>td]:py-3 [&>td]:transition-all [&>td]:duration-200 first:[&>td]:rounded-l-lg last:[&>td]:rounded-r-lg [&>td]:even:bg-gray-50 [&>td]:hover:bg-gray-100"
			onClick={() => router.push(`/admin/collaborator/${collaborator.id}`)}
		>
			<td className="whitespace-nowrap">
				<Checkbox
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					className="border-gray-400"
					checked={selectedCollaborators.includes(collaborator)}
					onCheckedChange={() => toggleEmployee(collaborator.id)}
				/>
			</td>
			<td className="whitespace-nowrap !pl-0">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						{collaborator.picture && collaborator.picture.length > 0 ? (
							<img
								src={collaborator.picture}
								alt={`Photo de ${collaborator.firstname} ${collaborator.lastname}`}
								className={`h-8 w-8 rounded-full bg-white ${getStatusBorderColor(collaborator.status)}`}
							/>
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-300 bg-blue-100 text-sm font-bold text-blue-700">
								{(collaborator.firstname?.[0].toUpperCase() ?? "") + (collaborator.lastname?.[0].toUpperCase() ?? "")}
							</div>
						)}
					</div>
					<div className="ml-4">
						<span className="text-sm font-medium text-gray-900">
							{collaborator.firstname || "--"} {collaborator.lastname || "--"}
						</span>
					</div>
				</div>
			</td>
			<td className="whitespace-nowrap">
				<div className="text-sm text-gray-500">{collaborator.professionalSituation?.jobTitle || "--"}</div>
			</td>
			<td className="whitespace-nowrap">
				<div className="text-sm text-gray-500">{collaborator.professionalSituation?.responsible || "--"}</div>
			</td>
			<td className="whitespace-nowrap">
				<span className="inline-flex rounded-full px-2 py-1 text-xs text-gray-500">
					{collaborator.professionalSituation?.contractType || "--"}
				</span>
			</td>
			<td className="whitespace-nowrap">
				<div className="text-sm text-gray-500">{collaborator.professionalSituation?.hireDate || "--"}</div>
			</td>
			<td className="whitespace-nowrap">
				<div className="text-sm text-gray-500">
					{collaborator.contractInformations?.annualSalary
						? collaborator.contractInformations?.annualSalary + " €"
						: "--"}
				</div>
			</td>
			<td className="whitespace-nowrap">
				<div className="ml-4 flex items-center">
					<div
						className={`flex h-4 w-4 items-center justify-center rounded-full border-4 ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator).border} `}
					>
						<div
							className={`h-2 w-2 rounded-full ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator).bg} `}
						/>
					</div>

					{selectedCollaborators.includes(collaborator) && (
						<button
							className="ml-3 text-red-600 hover:text-red-900"
							onClick={(e) => {
								e.stopPropagation();
								handleOpenConfirm(collaborator.id);
							}}
							onKeyDown={(e) => e.stopPropagation()}
						>
							<Trash2 size={16} />
						</button>
					)}
				</div>
			</td>
		</tr>
	);
};

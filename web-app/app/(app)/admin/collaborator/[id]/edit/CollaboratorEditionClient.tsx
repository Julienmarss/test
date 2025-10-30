"use client";

import { CompanyResponse } from "@/api/company/company.api";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Save } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { displayStatus, toUpdateCollaboratorRequest } from "@/app/(app)/admin/collaborator/collaborator.service";
import { CollaboratorSearch } from "../CollaboratorSearch";
import Badge, { IconType } from "@/components/ui/Badge";
import {
	UpdateCollaboratorRequest,
	useCollaborator,
	useModifyCollaboratorPicture,
	useUpdateCollaborator,
} from "@/api/collaborator/collaborators.api";
import { NotesCard } from "@/app/(app)/admin/collaborator/[id]/containers/NotesCard";
import { DocumentsCard } from "@/app/(app)/admin/collaborator/[id]/containers/DocumentsCard";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import { ModifyCollaborator } from "@/app/(app)/admin/collaborator/[id]/containers/ModifyCollaborator";
import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { getStatusBorderColor, getStatusColorCollaborator } from "@/app/(app)/admin/components/table.service";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { useRouter } from "next/navigation";
import { ModifyCollaboratorExtern } from "../containers/ModifyCollaboratorExtern";
import { StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";
import HeaderBar from "@/components/HeaderBar";

type Props = {
	company: CompanyResponse;
	collaboratorId: string;
};

export const CollaboratorEditionClient = ({ company, collaboratorId }: Props) => {
	const router = useRouter();
	const { data: collaborator, isError, isPending } = useCollaborator(company.id, collaboratorId);
	const { mutate: updateCollaborator, isPending: isUpdatePending, isError: isUpdateError } = useUpdateCollaborator();
	const { mutate: modifyPicture, isPending: modifyPicturePending } = useModifyCollaboratorPicture();
	const [modifiedCollaborator, setModifiedCollaborator] = useState<UpdateCollaboratorRequest>();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const initialCollaborator = useMemo(() => {
		return collaborator ? toUpdateCollaboratorRequest(collaborator) : undefined;
	}, [collaborator]);

	useEffect(() => {
		if (initialCollaborator) {
			setModifiedCollaborator(initialCollaborator);
		}
	}, [initialCollaborator]);

	if (isPending) {
		return <PageSpinner />;
	}

	if (!collaborator || isError) {
		return <div>Collaborateur introuvable</div>;
	}

	function handleInputChange(field: string, value?: string | boolean | number | string[]) {
		setModifiedCollaborator((prev) => (prev ? { ...prev, [field]: value } : undefined));
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Breadcrumb and Search */}
			<HeaderBar
				breadcrumb={
					<>
						<Link href="/admin" className="hover:text-slate-900">
							Copilote Admin
						</Link>

						<ChevronRight className="h-4 w-4" />

						<span className="text-xs text-slate-700">
							{collaborator.firstname} {collaborator.lastname}
						</span>
					</>
				}
				searchbar={<CollaboratorSearch companyId={company.id} />}
			/>

			<div className="space-y-6 py-6 md:px-[10%]">
				{/* Profile Header */}
				<Card className="border-2 border-sky-900">
					<CardContent className="p-6">
						<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
							<div>
								<div className="flex w-full flex-col items-center gap-4 space-x-4 md:w-auto md:flex-row md:gap-0">
									{collaborator.picture && collaborator.picture.length > 0 ? (
										<img
											src={collaborator.picture}
											alt={collaborator.firstname + " " + collaborator.lastname}
											className={`h-[80px] w-[80px] rounded-full ${getStatusBorderColor(collaborator?.status)}`}
										/>
									) : (
										<div
											className={`flex h-[80px] w-[80px] items-center justify-center rounded-full border border-green-300 bg-blue-100 text-3xl font-bold tracking-normal text-blue-700 ${getStatusBorderColor(collaborator?.status)}`}
										>
											{collaborator.firstname.charAt(0).toUpperCase()}
											{collaborator.lastname.charAt(0).toUpperCase()}
										</div>
									)}
									<div>
										<div className="flex flex-col space-x-1 space-y-1">
											<h1 className="text-2xl font-bold text-slate-900">
												{collaborator.firstname} {collaborator.lastname}
											</h1>
											<div className="flex items-center space-x-2">
												<div
													className={`flex h-4 w-4 items-center justify-center rounded-full border-4 ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator).border} `}
												>
													<div
														className={`h-2 w-2 rounded-full ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator).bg} `}
													/>
												</div>
												<span className="text-sm text-slate-600">{displayStatus(collaborator?.status)}</span>
											</div>
										</div>
									</div>
								</div>
								<div className="mt-4">
									<input
										type="file"
										className="hidden"
										onChange={(e) => {
											if (e.target.files && e.target.files[0])
												modifyPicture({
													file: e.target.files[0],
													companyId: company.id,
													collaboratorId: collaborator.id,
												});
										}}
										ref={fileInputRef}
									/>
									<OutlineButton onClick={() => fileInputRef.current?.click()} disabled={modifyPicturePending}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-6 text-gray-500"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
											/>
										</svg>

										{collaborator.picture && collaborator.picture.length > 0
											? "Modifier la photo"
											: "Ajouter une photo"}
									</OutlineButton>
								</div>
							</div>

							<div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[max-content,1fr]">
								{[
									{
										label: "Fonction :",
										icon: "Briefcase",
										value: collaborator.professionalSituation?.jobTitle,
									},
									{
										label: "Contrat :",
										icon: "DocumentText",
										value: collaborator.professionalSituation?.contractType,
									},
									{
										label: "Date de début :",
										icon: "Calendar",
										value: collaborator.professionalSituation?.hireDate,
									},
									{
										label: "Responsable :",
										icon: "User",
										value: collaborator.professionalSituation?.responsible,
									},
								].map((item) => (
									<React.Fragment key={item.label}>
										<span className="whitespace-nowrap text-sm text-gray-500">{item.label}</span>
										<div className="flex items-center gap-2">
											<Badge icon={item.icon as IconType} text={item.value} />
										</div>
									</React.Fragment>
								))}
							</div>

							<div className="flex w-full flex-col space-y-4 md:w-auto">
								<OutlineButton onClick={() => router.back()}>Retour</OutlineButton>
								<ActionButton
									disabled={isUpdatePending || isUpdateError || !modifiedCollaborator}
									icon={<Save className="h-4 w-4" />}
									onClick={() =>
										modifiedCollaborator &&
										updateCollaborator({
											collaborator: modifiedCollaborator,
											companyId: company.id,
										})
									}
								>
									Sauvegarder
								</ActionButton>
							</div>
						</div>
					</CardContent>
				</Card>

				{modifiedCollaborator &&
					modifiedCollaborator !== undefined &&
					(modifiedCollaborator?.contractType === "EXT" ? (
						<ModifyCollaboratorExtern collaborator={modifiedCollaborator} handleInputChange={handleInputChange} />
					) : (
						<ModifyCollaborator collaborator={modifiedCollaborator} handleInputChange={handleInputChange} />
					))}

				<NotesCard collaborator={collaborator} companyId={company.id} />

				<DocumentsCard collaborator={collaborator} companyId={company.id} />
			</div>
		</div>
	);
};

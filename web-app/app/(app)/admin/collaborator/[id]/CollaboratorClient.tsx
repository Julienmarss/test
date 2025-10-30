"use client";

import { CompanyResponse } from "@/api/company/company.api";
import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import React from "react";
import Link from "next/link";
import { CollaboratorSearch } from "./CollaboratorSearch";
import Badge, { IconType } from "@/components/ui/Badge";
import { MagicButton } from "@/components/ui/buttons/MagicButton";
import { useCollaborator } from "@/api/collaborator/collaborators.api";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import { useRouter } from "next/navigation";
import { StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";
import { getStatusBorderColor, getStatusColorCollaborator } from "../../components/table.service";
import { displayStatus } from "../collaborator.service";
import { ViewCollaborator } from "./containers/ViewCollaborator";
import { NotesCard } from "./containers/NotesCard";
import { DocumentsCard } from "./containers/DocumentsCard";
import HeaderBar from "@/components/HeaderBar";

type Props = {
	company: CompanyResponse;
	collaboratorId: string;
};

export const CollaboratorClient = ({ company, collaboratorId }: Props) => {
	const router = useRouter();
	const { data: collaborator, isError, isPending } = useCollaborator(company.id, collaboratorId);

	if (isPending) {
		return <PageSpinner />;
	}

	if (!collaborator || isError) {
		return <div>Collaborateur introuvable</div>;
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

			<div className="space-y-6 px-2 py-6 md:px-[15%]">
				{/* Profile Header */}
				<Card className="border-2 border-sky-900">
					<CardContent className="p-6">
						<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-0">
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
										value:
											collaborator.professionalSituation?.contractType === "EXT"
												? "Externe"
												: collaborator.professionalSituation?.contractType,
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
										<span className="whitespace-nowrap text-xs text-gray-500">{item.label}</span>
										<div className="flex items-center gap-2">
											<Badge icon={item.icon as IconType} text={item.value} />
										</div>
									</React.Fragment>
								))}
							</div>

							<div className="flex w-full flex-col space-y-4 md:w-auto">
								<MagicButton collaboratorSelected={collaborator}>Mes actions</MagicButton>
								<Button
									onClick={() => router.push(`/admin/collaborator/${collaborator.id}/edit`)}
									className="border border-gray-200 bg-white font-semibold text-sky-950 hover:bg-sky-50"
								>
									Éditer
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<ViewCollaborator collaborator={collaborator} />

				<NotesCard collaborator={collaborator} companyId={company.id} />

				<DocumentsCard collaborator={collaborator} companyId={company.id} />
			</div>
		</div>
	);
};

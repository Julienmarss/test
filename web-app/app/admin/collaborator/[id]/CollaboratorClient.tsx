'use client';

import { CompanyResponse } from "@/api/company/company.api";
import { Button } from "@/components/ui/buttons/Button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import React from "react";
import Link from "next/link";
import { displayStatus } from "@/app/admin/collaborator/collaborator.service";
import { CollaboratorSearch } from "./CollaboratorSearch";
import { ToggleSidebarButton } from "@/app/admin/components/ToggleSidebarButton";
import Badge, { IconType } from "@/components/ui/Badge";
import { MagicButton } from "@/components/ui/buttons/MagicButton";
import { useCollaborator } from "@/api/collaborator/collaborators.api";
import { NotesCard } from "@/app/admin/collaborator/[id]/containers/NotesCard";
import { DocumentsCard } from "@/app/admin/collaborator/[id]/containers/DocumentsCard";
import { PageSpinner } from "@/components/ui/icons/Spinner";
import { ViewCollaborator } from "@/app/admin/collaborator/[id]/containers/ViewCollaborator";
import { useRouter } from "next/navigation";
import { getStatusBorderColor, getStatusColorCollaborator } from "@/app/admin/components/table.service";
import { StatusResponseCollaborator } from "@/api/collaborator/collaborators.dto";

type Props = {
    company: CompanyResponse;
    collaboratorId: string;
};

export const CollaboratorClient = ({ company, collaboratorId }: Props) => {
    const router = useRouter();
    const { data: collaborator, isError, isPending } = useCollaborator(company.id, collaboratorId);

    if (isPending) {
        return <PageSpinner />
    }

    if (!collaborator || isError) {
        return <div>Collaborateur introuvable</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb and Search */}
            <div className="bg-white border-b border-slate-200 pl-2 pr-6 py-1">
                <div className="flex items-center">
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <ToggleSidebarButton />

                        <div className="h-14 w-px bg-slate-200 mx-4"></div>

                        <Link href="/admin" className="hover:text-slate-900">
                            Copilote Admin
                        </Link>

                        <ChevronRight className="w-4 h-4" />

                        <span className="text-slate-700 text-xs">{collaborator.firstname} {collaborator.lastname}</span>
                    </div>

                    <div className="h-14 w-px bg-slate-200 mx-4"></div>

                    <div className="flex-1 mx-4">
                        <CollaboratorSearch companyId={company.id} />
                    </div>
                </div>
            </div>

            <div className="px-2 md:px-[15%] py-6 space-y-6">
                {/* Profile Header */}
                <Card className="border-2 border-sky-900">
                    <CardContent className="p-6">
                        <div className="flex items-start md:items-center justify-between flex-col gap-4 md:flex-row md:gap-0">
                            <div className="flex items-center space-x-4 flex-col gap-4 w-full md:flex-row md:gap-0 md:w-auto">
                                {collaborator.picture && collaborator.picture.length > 0 ? (
                                    <img src={collaborator.picture}
                                        alt={collaborator.firstname + " " + collaborator.lastname}
                                        className={`w-[80px] h-[80px] rounded-full ${getStatusBorderColor(collaborator?.status)}`} />
                                ) : (<div
                                    className={`w-[80px] h-[80px] bg-blue-100 border border-green-300 text-blue-700 rounded-full flex items-center tracking-normal justify-center text-3xl font-bold ${getStatusBorderColor(collaborator?.status)}`}>
                                    {collaborator.firstname.charAt(0).toUpperCase()}{collaborator.lastname.charAt(0).toUpperCase()}
                                </div>
                                )}
                                <div>
                                    <div className="flex flex-col space-x-1 space-y-1">
                                        <h1 className="text-2xl font-bold text-slate-900">{collaborator.firstname} {collaborator.lastname}</h1>
                                        <div className="flex items-center space-x-2">
                                            <div className={`flex items-center justify-center h-4 w-4 rounded-full border-4
                                                    ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator).border}
                                                `}
                                            >
                                                <div
                                                className={`
                                                    h-2
                                                    w-2
                                                    rounded-full
                                                    ${getStatusColorCollaborator(collaborator.status as StatusResponseCollaborator).bg}
                                                `}
                                            />  
                                            </div>
                                            <span
                                                className="text-sm text-slate-600">{displayStatus(collaborator?.status)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[max-content,1fr] items-center gap-2">
                                {[
                                    {
                                        label: 'Fonction :',
                                        icon: 'Briefcase',
                                        value: collaborator.professionalSituation?.jobTitle
                                    },
                                    {
                                        label: 'Contrat :',
                                        icon: 'DocumentText',
                                        value: collaborator.professionalSituation?.contractType === "EXT" ? "Externe" : collaborator.professionalSituation?.contractType
                                    },
                                    {
                                        label: 'Date de début :',
                                        icon: 'Calendar',
                                        value: collaborator.professionalSituation?.hireDate
                                    },
                                    {
                                        label: 'Responsable :',
                                        icon: 'User',
                                        value: collaborator.professionalSituation?.responsible
                                    }
                                ].map((item) => (
                                    <React.Fragment key={item.label}>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">{item.label}</span>
                                        <div className="flex items-center gap-2">
                                            <Badge icon={item.icon as IconType} text={item.value} />
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="flex flex-col space-y-4 w-full md:w-auto">
                                <MagicButton collaboratorSelected={collaborator.id}>Mes actions</MagicButton>
                                <Button
                                    onClick={() => router.push(`/admin/collaborator/${collaborator.id}/edit`)}
                                    className="bg-white hover:bg-sky-50 text-sky-950 border-gray-200 border font-semibold">
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
    )
};
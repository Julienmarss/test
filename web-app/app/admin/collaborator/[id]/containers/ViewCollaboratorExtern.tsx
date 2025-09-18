import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { InfoField } from "./ViewCollaborator";
import { useState } from "react";

const ViewCollaboratorExtern = ({ collaborator }: { collaborator: CollaboratorResponse }) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "etat-civil-et-informations-professionnelle",
        "coordonnees-et-situation-contractuelle"
    ])

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
        )
    }

    return (
        <>
            {/* État Civil */}
            <Card className="border border-slate-200 rounded-xl">
                <CardHeader className="cursor-pointer"
                    onClick={() => toggleSection("etat-civil-et-informations-professionnelle")}>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                            </svg>
                            <span className="text-lg font-medium text-gray-900">État Civil</span>
                        </div>
                        {expandedSections.includes("etat-civil-et-informations-professionnelle") ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </CardTitle>
                </CardHeader>
                {expandedSections.includes("etat-civil-et-informations-professionnelle") && (
                    <CardContent>
                        <InfoField label="Nom" value={collaborator.lastname} />
                        <InfoField label="Prénoms" value={collaborator.firstname} />
                        <InfoField label="Civilité" value={collaborator.civility} />
                        <InfoField label="Date de naissance" value={collaborator.birthDate} />
                        <InfoField label="Lieu de naissance" value={collaborator.birthPlace} />
                        <InfoField label="Nationalité" value={collaborator.nationality} />
                    </CardContent>
                )}
            </Card>

            {/* Informations Contractuelles */}
            <Card className="border border-slate-200 rounded-xl">
                <CardHeader className="cursor-pointer"
                    onClick={() => toggleSection("etat-civil-et-informations-professionnelle")}>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 13.25V10.625C16.5 8.76104 14.989 7.25 13.125 7.25H11.625C11.0037 7.25 10.5 6.74632 10.5 6.125V4.625C10.5 2.76104 8.98896 1.25 7.125 1.25H5.25M5.25 14H12.75M5.25 17H9M7.5 1.25H2.625C2.00368 1.25 1.5 1.75368 1.5 2.375V19.625C1.5 20.2463 2.00368 20.75 2.625 20.75H15.375C15.9963 20.75 16.5 20.2463 16.5 19.625V10.25C16.5 5.27944 12.4706 1.25 7.5 1.25Z" stroke="#99A1AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span className="text-lg font-medium text-gray-900">Informations Contractuelles</span>
                        </div>
                        {expandedSections.includes("etat-civil-et-informations-professionnelle") ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </CardTitle>
                </CardHeader>
                {expandedSections.includes("etat-civil-et-informations-professionnelle") && (
                    <CardContent>
                        <InfoField label="Profession"
                            value={collaborator.professionalSituation?.jobTitle} />
                        <InfoField label="Date d'embauche"
                            value={collaborator.professionalSituation?.hireDate} />
                        <InfoField label="Date de fin"
                            value={collaborator.professionalSituation?.endDate} />
                        <InfoField label="Lieu de rattachement"
                            value={collaborator.professionalSituation?.location} />
                        <InfoField  label="Rénumération" isAmount={true}
                            value={collaborator.contractInformations?.totalCompensation}
                        />
                    </CardContent>
                )}
            </Card>

            {/* Coordonnées */}
            <Card className="border border-slate-200 rounded-xl">
                <CardHeader className="cursor-pointer"
                    onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                            <span className="text-lg font-medium text-gray-900">Coordonnées</span>
                        </div>
                        {expandedSections.includes("coordonnees-et-situation-contractuelle") ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </CardTitle>
                </CardHeader>
                {expandedSections.includes("coordonnees-et-situation-contractuelle") && (
                    <CardContent>
                        <InfoField label="Téléphone"
                            value={collaborator.contactDetails?.personalPhone} />
                        <InfoField label="Email"
                            value={collaborator.contactDetails?.personalEmail} />
                        <InfoField label="Adresse"
                            value={collaborator.contactDetails?.personalAddress} />
                        <InfoField
                            label="Contact d'urgence"
                            value={collaborator.contactDetails?.emergencyContact?.civility
                                ? `${collaborator.contactDetails?.emergencyContact?.civility} ${collaborator.contactDetails?.emergencyContact.firstname} ${collaborator.contactDetails?.emergencyContact.lastname}\n${collaborator.contactDetails?.emergencyContact.email} - ${collaborator.contactDetails?.emergencyContact.phone}`
                                : "--"}
                        />
                    </CardContent>
                )}
            </Card>

            {/* Informations Professionnelles */}
            <Card className="border border-slate-200 rounded-xl">
                <CardHeader className="cursor-pointer"
                    onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                            <span className="text-lg font-medium text-gray-900">Informations Professionnelles</span>
                        </div>
                        {expandedSections.includes("coordonnees-et-situation-contractuelle") ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </CardTitle>
                </CardHeader>
                {expandedSections.includes("coordonnees-et-situation-contractuelle") && (
                    <CardContent>
                        <InfoField label="Dénomination sociale"
                        // value={collaborator.contactDetails?.personalPhone} 
                        />
                        <InfoField label="Numéro de SIRET"
                        // value={collaborator.contactDetails?.personalEmail} 
                        />
                        <InfoField label="Numéro de TVA"
                        // value={collaborator.contactDetails?.personalAddress} 
                        />
                        <InfoField
                            label="Inscription RCS"
                        // value={collaborator.contactDetails?.emergencyContact?.civility
                        //     ? `${collaborator.contactDetails?.emergencyContact?.civility} ${collaborator.contactDetails?.emergencyContact.firstname} ${collaborator.contactDetails?.emergencyContact.lastname}\n${collaborator.contactDetails?.emergencyContact.email} - ${collaborator.contactDetails?.emergencyContact.phone}`
                        //     : "--"}
                        />
                        <InfoField label="IBAN"
                            value={collaborator.contactDetails?.iban}
                        />
                    </CardContent>
                )}
            </Card>
        </>
    )
}

export default ViewCollaboratorExtern;
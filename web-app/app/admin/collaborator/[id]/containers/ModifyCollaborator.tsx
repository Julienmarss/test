import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
    getCode,
    getNationality,
    isValidSocialSecurityNumber,
    nationalities,
    SERVICES
} from "@/app/admin/collaborator/collaborator.service";
import React, { useState } from "react";
import { cn } from "@/utils/lib";
import { Input, isValidDateFormat } from "@/components/ui/Input";
import { UpdateCollaboratorRequest } from "@/api/collaborator/collaborators.api";
import { Select } from "@/components/ui/Select";
import ReactFlagsSelect from "react-flags-select";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value: string | boolean | number | string[] | undefined) => void
};

const InfoField = ({
    label,
    children,
    className,
}: {
    label: string;
    className?: string;
    children: React.ReactNode;
}) => (
    <div
        className={cn(
            "grid grid-cols-1 md:grid-cols-[1fr_2fr] items-center gap-x-3 px-2 py-3 border-b border-slate-100 last:border-b-0 odd:bg-gray-50",
            className
        )}
    >
        <span className="text-slate-600 text-sm">{label}</span>
        <div className="flex justify-between items-center min-w-0 space-x-2">
            {children}
        </div>
    </div>
);

export const ModifyCollaborator = ({ collaborator, handleInputChange }: Props) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "etat-civil-et-situation-professionnelle",
        "coordonnees-et-situation-contractuelle"
    ])

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* État Civil */}
                <Card className="border border-slate-200 rounded-xl">
                    <CardHeader className="cursor-pointer"
                        onClick={() => toggleSection("etat-civil-et-situation-professionnelle")}>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                                </svg>
                                <span className="text-lg font-medium text-gray-900">État Civil</span>
                            </div>
                            {expandedSections.includes("etat-civil-et-situation-professionnelle") ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </CardTitle>
                    </CardHeader>
                    {expandedSections.includes("etat-civil-et-situation-professionnelle") && (
                        <CardContent>
                            <InfoField label="Nom">
                                <Input placeholder={"Saisissez le nom de votre collaborateur"}
                                    value={collaborator.lastname}
                                    onChange={(e) => handleInputChange("lastname", e.target.value)} required />
                            </InfoField>
                            <InfoField label="Prénoms">
                                <Input placeholder={"Saisissez le prénom de votre collaborateur"}
                                    value={collaborator.firstname}
                                    onChange={(e) => handleInputChange("firstname", e.target.value)} required />
                            </InfoField>
                            <InfoField label="Civilité">
                                <Select
                                    placeholder={"Sélectionnez la civilité de votre collaborateur"}
                                    value={collaborator.civility}
                                    options={[{ label: "Monsieur", value: "Monsieur" }, {
                                        label: "Madame",
                                        value: "Madame"
                                    }]}
                                    onChange={(value) => handleInputChange("civility", value)}
                                    className="w-full" />
                            </InfoField>
                            <InfoField label="Date de naissance">
                                <Input
                                    placeholder={"JJ/MM/AAAA"} value={collaborator.birthDate}
                                    error={!collaborator.birthDate ? undefined : !isValidDateFormat(collaborator.birthDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                                    onChange={(e) => handleInputChange("birthDate", e.target.value)} />
                            </InfoField>
                            <InfoField label="Lieu de naissance">
                                <Input
                                    placeholder={"Saisissez le lieu de naissance"}
                                    value={collaborator.birthPlace}
                                    onChange={(e) => handleInputChange("birthPlace", e.target.value)} />
                            </InfoField>
                            <InfoField label="Nationalité">
                                <ReactFlagsSelect
                                    placeholder="Sélectionnez"
                                    selected={collaborator.nationality ? getCode(collaborator.nationality) : ""}
                                    onSelect={(code) => handleInputChange("nationality", getNationality(code))}
                                    customLabels={nationalities}
                                    className="w-full h-12"
                                    searchable
                                />
                            </InfoField>
                            <InfoField label="N° de sécurité sociale">
                                <Input
                                    placeholder={"Saisissez le numéro de sécurité sociale de votre collaborateur"}
                                    value={collaborator.socialSecurityNumber}
                                    error={!collaborator.socialSecurityNumber ? undefined : !isValidSocialSecurityNumber(collaborator.socialSecurityNumber) ? "Le numéro de sécurité sociale doit contenir exactement 15 chiffres." : undefined}
                                    onChange={(e) => handleInputChange("socialSecurityNumber", e.target.value)}
                                    className="w-full" />
                            </InfoField>
                        </CardContent>
                    )}
                </Card>

                {/* Situation Professionnelle */}
                <Card className="border border-slate-200 rounded-xl">
                    <CardHeader className="cursor-pointer"
                        onClick={() => toggleSection("etat-civil-et-situation-professionnelle")}>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                </svg>
                                <span className="text-lg font-medium text-gray-900">Situation Professionnelle</span>
                            </div>
                            {expandedSections.includes("etat-civil-et-situation-professionnelle") ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </CardTitle>
                    </CardHeader>
                    {expandedSections.includes("etat-civil-et-situation-professionnelle") && (
                        <CardContent>
                            <InfoField label="Intitulé du poste">
                                <Input placeholder={"Saisissez l'intitulé du poste"}
                                    value={collaborator.jobTitle}
                                    onChange={(e) => handleInputChange("jobTitle", e.target.value)} />
                            </InfoField>
                            <InfoField label="Type de contrat">
                                <Select placeholder={"Sélectionnez le type de contrat"}
                                    options={[{ label: "Contrat à durée indéterminée", value: "CDI" },
                                    { label: "Contrat à durée déterminée", value: "CDD" },
                                    { label: "Contrat d’apprentissage", value: "APP" },
                                    { label: "Contrat de professionnalisation", value: "PRO" },
                                    { label: "Convention de stage", value: "STA" },
                                    { label: "Contrat de travail temporaire", value: "CTT" },
                                    { label: "Contrat de travail intermittent", value: "CTI" },
                                    { label: "Contrat unique d'insertion", value: "CUI" }]}
                                    value={collaborator.contractType}
                                    onChange={(value) => handleInputChange("contractType", value)} />
                            </InfoField>
                            <InfoField label="Date d'embauche">
                                <Input placeholder={"JJ/MM/YYYY"}
                                    value={collaborator.hireDate}
                                    error={!collaborator.hireDate ? undefined : !isValidDateFormat(collaborator.hireDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                                    onChange={(e) => handleInputChange("hireDate", e.target.value)} />
                            </InfoField>
                            <InfoField label="Date de fin contrat">
                                <Input
                                    placeholder={"JJ/MM/YYYY"}
                                    value={collaborator.endDate}
                                    error={!collaborator.endDate ? undefined : !isValidDateFormat(collaborator.endDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                                    onChange={(e) => handleInputChange("endDate", e.target.value)} />
                            </InfoField>
                            <InfoField label="Ancienneté">
                                <span className="text-gray-400 text-sm">(Calculé automatiquement)</span>
                            </InfoField>
                            <InfoField label="Durée du travail">
                                <div className="flex flex-col w-full gap-2">
                                    <Input type="number"
                                        placeholder={"Saisissez la Durée du travail"}
                                        value={collaborator.workHoursPerWeek}
                                        onChange={(e) => handleInputChange("workHoursPerWeek", e.target.value)}
                                        className="w-full" />
                                    <Select placeholder={"Sélectionnez la durée de travail"}
                                        options={[{ label: "Heures", value: "H" },
                                        { label: "Forfait heures ", value: "FH" },
                                        { label: "Forfait jours", value: "FJ" },
                                        ]}
                                        value={collaborator.workHoursType}
                                        onChange={(value) => handleInputChange("workHoursType", value)} />
                                </div>
                            </InfoField>
                            <InfoField label="Lieu de rattachement">
                                <Input placeholder={"Saisissez le lieu de rattachement"}
                                    value={collaborator.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    className="w-full" />
                            </InfoField>
                            <InfoField label="Responsable hiérarchique">
                                <Input placeholder={"Saisissez le nom du responsable"}
                                    value={collaborator.responsible}
                                    onChange={(e) => handleInputChange("responsible", e.target.value)}
                                    className="w-full" />
                            </InfoField>
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
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className=" text-xs font-medium text-sky-600 mb-4">Coordonnées Personnelles</h4>
                                <div>
                                    <InfoField label="Téléphone personnel">
                                        <Input type="tel"
                                            placeholder={"Ex: (+33) 6 00 00 00 00"}
                                            value={collaborator.personalPhone}
                                            onChange={(e) => handleInputChange("personalPhone", e.target.value)} />
                                    </InfoField>
                                    <InfoField label="Email personnel">
                                        <Input type="email"
                                            placeholder={"Saisissez l'email personnel"}
                                            value={collaborator.personalEmail}
                                            onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                                            required />
                                    </InfoField>
                                    <InfoField label="Adresse">
                                        <Input placeholder="Saisissez l'adresse de votre collaborateur"
                                            value={collaborator.personalAddress}
                                            onChange={(e) => handleInputChange("personalAddress", e.target.value)}
                                            className="w-full" />
                                    </InfoField>
                                    <InfoField label="Coordonnées urgence">
                                        <div className="flex flex-col gap-y-2 w-full">
                                            <Select label={"Civilité"} placeholder={"Sélectionnez la civilité"}
                                                value={collaborator.emergencyCivility}
                                                options={[{ label: "Monsieur", value: "Monsieur" }, {
                                                    label: "Madame",
                                                    value: "Madame"
                                                }]}
                                                onChange={(value) => handleInputChange("emergencyCivility", value)} />
                                            <Input label="Nom" placeholder={"Saisissez le nom"}
                                                value={collaborator.emergencyLastname}
                                                onChange={(e) => handleInputChange("emergencyLastname", e.target.value)} />
                                            <Input label="Prénom" placeholder={"Saisissez le prénom"}
                                                value={collaborator.emergencyFirstname}
                                                onChange={(e) => handleInputChange("emergencyFirstname", e.target.value)} />
                                            <Input type="tel" label="Téléphone" placeholder={"Ex: (+33) 6 00 00 00 00"}
                                                value={collaborator.emergencyPhone}
                                                onChange={(e) => handleInputChange("emergencyPhone", e.target.value)} />
                                            <Input type="email" label="E-mail" placeholder={"Saisissez l'email"}
                                                value={collaborator.emergencyEmail}
                                                onChange={(e) => handleInputChange("emergencyEmail", e.target.value)} />
                                        </div>
                                    </InfoField>
                                </div>
                            </div>

                            <div>
                                <h4 className=" text-xs font-medium text-sky-600 mb-4">Coordonnées
                                    Professionnelles</h4>
                                <div>
                                    <InfoField label="Téléphone">
                                        <Input type="tel"
                                            placeholder={"Ex: (+33) 6 00 00 00 00"}
                                            value={collaborator.professionalPhone}
                                            onChange={(e) => handleInputChange("professionalPhone", e.target.value)} />
                                    </InfoField>
                                    <InfoField label="Email">
                                        <Input type="email"
                                            placeholder={"Saisissez l'email professionnel"}
                                            value={collaborator.professionalEmail}
                                            onChange={(e) => handleInputChange("professionalEmail", e.target.value)} />
                                    </InfoField>
                                </div>
                            </div>

                            <div>
                                <h4 className=" text-xs font-medium text-sky-600 mb-4">Coordonnées Bancaires</h4>
                                <InfoField label="IBAN">
                                    <Input type="text"
                                        placeholder={"Saisissez l'IBAN"}
                                        value={collaborator.iban}
                                        onChange={(e) => handleInputChange("iban", e.target.value)} />
                                </InfoField>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Situation Contractuelle */}
                <Card className="border border-slate-200 rounded-xl">
                    <CardHeader className="cursor-pointer"
                        onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <span className="text-lg font-medium text-gray-900">Situation Contractuelle</span>
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
                            <InfoField label="Catégorie">
                                <Select
                                    label="Statut"
                                    placeholder="Saisissez le statut de votre collaborateur"
                                    value={collaborator.category}
                                    onChange={(value) => handleInputChange("category", value)}
                                    options={[
                                        { value: "Ouvrier", label: "Ouvrier" },
                                        { value: "Employé", label: "Employé" },
                                        { value: "Technicien", label: "Technicien" },
                                        { value: "Agent de maîtrise", label: "Agent de maîtrise" },
                                        { value: "Cadre", label: "Cadre" }
                                    ]}
                                />
                            </InfoField>
                            <InfoField label="Classification">
                                <Input
                                    placeholder={"Saisissez la classification de votre collaborateur"}
                                    value={collaborator.classification}
                                    onChange={(e) => handleInputChange("classification", e.target.value)} />
                            </InfoField>
                            <InfoField label="Salaire annuel brut">
                                <Input type="amount"
                                    placeholder={"Saisissez le salaire annuel brut"}
                                    value={collaborator.annualSalary}
                                    onChange={(e) => handleInputChange("annualSalary", e.target.value)} />
                            </InfoField>
                            <InfoField label="Rémunération variable">
                                <Input type="amount"
                                    placeholder={"Saisissez la rémunération variable"}
                                    value={collaborator.variableCompensation}
                                    onChange={(e) => handleInputChange("variableCompensation", e.target.value)} />
                            </InfoField>
                            <InfoField label="Rémunération totale">
                                <Input type="amount"
                                    placeholder={"Saisissez la rémunération totale"}
                                    value={collaborator.totalCompensation}
                                    onChange={(e) => handleInputChange("totalCompensation", e.target.value)} />
                            </InfoField>
                            <InfoField label="Avantage en nature">
                                <Input type="amount"
                                    placeholder={"Saisissez le montant des avantages en nature"}
                                    value={collaborator.benefitsInKind}
                                    onChange={(e) => handleInputChange("benefitsInKind", e.target.value)}
                                    className="w-full" />
                            </InfoField>
                            <InfoField label="Période d'essai">
                                <Input placeholder={"Saisissez la durée de la période d'essai"}
                                    value={collaborator.trialPeriod}
                                    onChange={(e) => handleInputChange("trialPeriod", e.target.value)}
                                    className="w-full" />
                            </InfoField>
                            <InfoField label="Clause de non-concurrence">
                                <Select
                                    placeholder="Sélectionnez la clause de non-concurrence"
                                    value={collaborator.nonCompeteClause ? "Oui" : "Non"}
                                    onChange={(value) => handleInputChange("nonCompeteClause", value === "Oui")}
                                    options={[
                                        { value: "Oui", label: "Oui" },
                                        { value: "Non", label: "Non" },
                                    ]}
                                    className="w-full"
                                />
                            </InfoField>
                        </CardContent>
                    )}
                </Card>

                {/* Situation Personnelle */}
                <Card className="border border-slate-200 rounded-xl">
                    <CardHeader className="cursor-pointer">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                <span className="text-lg font-medium text-gray-900">Situation Personnelle</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InfoField label="Situation familiale">
                            <Select
                                placeholder="Sélectionnez votre situation familiale"
                                value={collaborator.maritalStatus}
                                onChange={(value) => handleInputChange("maritalStatus", value)}
                                options={[
                                    { value: "Marié(e)", label: "Marié(e)" },
                                    { value: "Célibataire", label: "Célibataire" },
                                    { value: "Pacsé(e)", label: "Pacsé(e)" },
                                ]}
                            />
                        </InfoField>
                        <InfoField label="Enfants à charge">
                            <Select
                                placeholder="Sélectionnez le nombre d'enfants à charge"
                                value={`${collaborator.numberOfChildren}`}
                                onChange={(value) => handleInputChange("numberOfChildren", Number(value))}
                                options={[
                                    { value: "0", label: "0" },
                                    { value: "1", label: "1" },
                                    { value: "2", label: "2" },
                                    { value: "3", label: "3" },
                                    { value: "4", label: "4" },
                                    { value: "5", label: "5" },
                                    { value: "6", label: "6" },
                                    { value: "7", label: "7" },
                                    { value: "8", label: "8" },
                                    { value: "9", label: "9" },
                                    { value: "10", label: "10" },
                                ]}
                            />
                        </InfoField>
                        <InfoField label="Niveau de diplôme">
                            <Select
                                placeholder="Sélectionnez le niveau de diplome"
                                value={collaborator.educationLevel}
                                onChange={(value) => handleInputChange("educationLevel", value)}
                                options={[
                                    { value: "CAP / BEP", label: "CAP / BEP" },
                                    { value: "BAC", label: "BAC" },
                                    { value: "BAC +2", label: "BAC +2" },
                                    { value: "BAC +3", label: "BAC +3" },
                                    { value: "BAC +4", label: "BAC +4" },
                                    { value: "BAC +5", label: "BAC +5" },
                                    { value: "BAC +8", label: "BAC +8" },
                                    { value: "Pas de diplôme", label: "Pas de diplôme" },
                                ]}
                            />
                        </InfoField>
                        <InfoField label="Permis">
                            <Select
                                placeholder="Sélectionnez les permis de conduire"
                                value={collaborator.drivingLicenses ?? []}
                                onChange={(selectedOptions) => handleInputChange("drivingLicenses", selectedOptions)}
                                options={[
                                    { value: "", label: "" },
                                    { value: "A", label: "A" },
                                    { value: "B", label: "B" },
                                    { value: "BE", label: "BE" },
                                    { value: "C", label: "C" },
                                    { value: "C1", label: "C1" },
                                    { value: "CE", label: "CE" },
                                    { value: "D", label: "D" },
                                    { value: "D1", label: "D1" },
                                    { value: "DE", label: "DE" },
                                    { value: "F", label: "F" },
                                    { value: "CACES", label: "CACES" },
                                ]}
                                multiple
                            />
                        </InfoField>
                        <InfoField label="RQTH">
                            <Select
                                label="Le collaborateur a-t-il la reconnaissance de la qualité de travailleur handicapé (RQTH) ?"
                                placeholder="Sélectionnez le RQTH"
                                value={collaborator.rqth === undefined ? "" : collaborator.rqth ? "Oui" : "Non"}
                                onChange={(value) => {
                                    if (value === "") {
                                        handleInputChange("rqth", undefined);
                                    } else {
                                        handleInputChange("rqth", value === "Oui");
                                    }
                                }}
                                options={[
                                    { value: "", label: "" },
                                    { value: "Oui", label: "Oui" },
                                    { value: "Non", label: "Non" },
                                ]}
                            />
                        </InfoField>
                    </CardContent>
                </Card>

                {/* Recommandation de services */}
                <Card className="border border-slate-200 rounded-xl">
                    <CardHeader className="cursor-pointer">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                <span
                                    className="text-lg font-medium text-gray-900">Recommandation de services</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent
                        className="flex flex-col justify-between min-h-[17rem] p-0 md:p-6"> {/* ← adapte la hauteur */}
                        <table className="w-full">
                            <tbody>
                                {SERVICES.map((service) => (
                                    <tr key={service.name} className="border border-slate-200">
                                        <td className="p-4">
                                            <img className="w-6 h-6 rounded" src={service.logo}
                                                alt={`Logo de ${service.name}`} />
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span
                                                    className="text-sm font-medium text-gray-900">{service.name}</span>
                                                <span
                                                    className="text-sm font-medium text-gray-500">{service.description}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <a className="text-sm font-medium text-sky-700" href={service.link}
                                                target="_blank">
                                                Découvrir
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm font-medium text-gray-700">Publicité</span>
                            <a className="text-sm font-medium text-sky-700" href="mailto:marin@legipilot.com" target="_blank">
                                En savoir plus
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};
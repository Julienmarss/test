import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { displayWorkHoursType, getSeniority, SERVICES } from "../../collaborator.service";
import { useState } from "react";
import { InfoField } from "./ViewCollaborator";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";
import AccordionSubtitle from "@/components/ui/accordion/AccordionSubtitle";

const ViewCollaboratorIntern = ({ collaborator }: { collaborator: CollaboratorResponse }) => {
	const [expandedSections, setExpandedSections] = useState<string[]>([
		"etat-civil-et-situation-professionnelle",
		"coordonnees-et-situation-contractuelle",
	]);

	const toggleSection = (sectionId: string) => {
		setExpandedSections((prev) =>
			prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
		);
	};

	return (
		<>
			{/* État Civil */}
			<Card className="rounded-xl border border-slate-200">
				<CardHeader className="cursor-pointer" onClick={() => toggleSection("etat-civil-et-situation-professionnelle")}>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 text-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
								/>
							</svg>
							<span className="text-lg font-medium text-gray-900">État Civil</span>
						</div>
						{expandedSections.includes("etat-civil-et-situation-professionnelle") ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</CardTitle>
				</CardHeader>
				{expandedSections.includes("etat-civil-et-situation-professionnelle") && (
					<CardContent>
						<InfoField label="Nom" value={collaborator.lastname} />
						<InfoField label="Prénoms" value={collaborator.firstname} />
						<InfoField label="Civilité" value={collaborator.civility} />
						<InfoField label="Date de naissance" value={collaborator.birthDate} />
						<InfoField label="Lieu de naissance" value={collaborator.birthPlace} />
						<InfoField label="Nationalité" value={collaborator.nationality} />
						<InfoField label="N° de sécurité sociale" value={collaborator.socialSecurityNumber} />
					</CardContent>
				)}
			</Card>

			{/* Situation Professionnelle */}
			<Card className="rounded-xl border border-slate-200">
				<CardHeader className="cursor-pointer" onClick={() => toggleSection("etat-civil-et-situation-professionnelle")}>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 text-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
								/>
							</svg>
							<span className="text-lg font-medium text-gray-900">Situation Professionnelle</span>
						</div>
						{expandedSections.includes("etat-civil-et-situation-professionnelle") ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</CardTitle>
				</CardHeader>
				{expandedSections.includes("etat-civil-et-situation-professionnelle") && (
					<CardContent>
						<InfoField label="Intitulé du poste" value={collaborator.professionalSituation?.jobTitle} />
						<InfoField label="Type de contrat" value={collaborator.professionalSituation?.contractType} />
						<InfoField label="Date d'embauche" value={collaborator.professionalSituation?.hireDate} />
						<InfoField label="Date de fin contrat" value={collaborator.professionalSituation?.endDate} />
						<InfoField label="Ancienneté" value={getSeniority(collaborator.professionalSituation?.hireDate)} />
						<InfoField
							label="Durée du travail"
							value={`${collaborator.professionalSituation?.workHoursPerWeek} ${displayWorkHoursType(collaborator.professionalSituation?.workHoursType)}`}
						/>
						<InfoField label="Lieu de rattachement" value={collaborator.professionalSituation?.location} />
						<InfoField label="Responsable hiérarchique" value={collaborator.professionalSituation?.responsible} />
					</CardContent>
				)}
			</Card>

			{/* Coordonnées */}
			<Card className="rounded-xl border border-slate-200">
				<CardHeader className="cursor-pointer" onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 text-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
								/>
							</svg>
							<span className="text-lg font-medium text-gray-900">Coordonnées</span>
						</div>
						{expandedSections.includes("coordonnees-et-situation-contractuelle") ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</CardTitle>
				</CardHeader>
				{expandedSections.includes("coordonnees-et-situation-contractuelle") && (
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-4 text-xs font-medium text-sky-600">Coordonnées Personnelles</h4>
							<div>
								<InfoField label="Téléphone personnel" value={collaborator.contactDetails?.personalPhone} />
								<InfoField label="Email personnel" value={collaborator.contactDetails?.personalEmail} />
								<InfoField label="Adresse" value={collaborator.contactDetails?.personalAddress} />
								<InfoField
									label="Contact d'urgence"
									value={
										collaborator.contactDetails?.emergencyContact?.civility
											? `${collaborator.contactDetails?.emergencyContact?.civility} ${collaborator.contactDetails?.emergencyContact.firstname} ${collaborator.contactDetails?.emergencyContact.lastname}\n${collaborator.contactDetails?.emergencyContact.email} - ${collaborator.contactDetails?.emergencyContact.phone}`
											: "--"
									}
								/>
							</div>
						</div>

						<div>
							<h4 className="mb-4 text-xs font-medium text-sky-600">Coordonnées Professionnelles</h4>
							<div>
								<InfoField label="Téléphone" value={collaborator.contactDetails?.professionalPhone} />
								<InfoField label="Email" value={collaborator.contactDetails?.professionalEmail} />
							</div>
						</div>

						<div>
							<h4 className="mb-4 text-xs font-medium text-sky-600">Coordonnées Bancaires</h4>
							<div>
								<InfoField label="IBAN" value={collaborator.contactDetails?.iban} />
								<InfoField label="BIC" value={collaborator.contactDetails?.bic} />
							</div>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Situation Contractuelle */}
			<Card className="rounded-xl border border-slate-200">
				<CardHeader className="cursor-pointer" onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 text-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
								/>
							</svg>
							<span className="text-lg font-medium text-gray-900">Situation Contractuelle</span>
						</div>
						{expandedSections.includes("coordonnees-et-situation-contractuelle") ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</CardTitle>
				</CardHeader>
				{expandedSections.includes("coordonnees-et-situation-contractuelle") && (
					<CardContent>
						<InfoField label="Catégorie" value={collaborator.contractInformations?.category} />
						<InfoField label="Classification" value={collaborator.contractInformations?.classification} />
						<InfoField
							label="Salaire annuel brut"
							isAmount={true}
							value={collaborator.contractInformations?.annualSalary}
						/>
						<InfoField
							label="Rémunération variable"
							isAmount={true}
							value={collaborator.contractInformations?.variableCompensation}
						/>
						<InfoField
							label="Avantage en nature"
							isAmount={true}
							value={collaborator.contractInformations?.benefitsInKind}
						/>
						<InfoField
							label="Rémunération totale"
							isAmount={true}
							value={collaborator.contractInformations?.totalCompensation}
						/>
						<InfoField label="Période d'essai" value={collaborator.contractInformations?.trialPeriod} />
						<InfoField
							label="Clause de non-concurrence"
							value={collaborator.contractInformations?.nonCompeteClause ? "Oui" : "Non"}
						/>
						<AccordionSubtitle className="mt-4">Titre de séjour</AccordionSubtitle>
						<InfoField label="Type de titre" value={collaborator.contractInformations?.stayType} />
						<InfoField label="Numéro de titre" value={collaborator.contractInformations?.stayNumber} />
						<InfoField label="Date de validité" value={collaborator.contractInformations?.stayValidityDate} />
					</CardContent>
				)}
			</Card>

			{/* Situation Personnelle */}
			<Card className="rounded-xl border border-slate-200">
				<CardHeader className="cursor-pointer">
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 text-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
								/>
							</svg>
							<span className="text-lg font-medium text-gray-900">Situation Personnelle</span>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<InfoField label="Situation familiale" value={collaborator.personalSituation?.maritalStatus} />
					<InfoField label="Enfants à charge" value={collaborator.personalSituation?.numberOfChildren} />
					<InfoField label="Niveau de diplôme" value={collaborator.personalSituation?.educationLevel} />
					<InfoField label="Permis" value={collaborator.personalSituation?.drivingLicenses.join(", ")} />
					<InfoField label="RQTH" value={collaborator.personalSituation?.rqth ? "Oui" : "Non"} />
				</CardContent>
			</Card>

			{/* Recommandation de services */}
			<Card className="rounded-xl border border-slate-200">
				<CardHeader className="cursor-pointer">
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 text-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
								/>
							</svg>
							<span className="text-lg font-medium text-gray-900">Recommandation de services</span>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="flex min-h-[17rem] flex-col justify-between">
					{" "}
					{/* ← adapte la hauteur */}
					<div className="overflow-x-auto">
						<table className="w-max md:w-full">
							<tbody>
								{SERVICES.map((service) => (
									<tr key={service.name} className="border border-slate-200">
										<td className="p-4">
											<img className="h-6 w-6 rounded" src={service.logo} alt={`Logo de ${service.name}`} />
										</td>
										<td>
											<div className="flex flex-col">
												<span className="text-sm font-medium text-gray-900">{service.name}</span>
												<span className="text-sm font-medium text-gray-500">{service.description}</span>
											</div>
										</td>
										<td>
											<a className="text-sm font-medium text-sky-700" href={service.link} target="_blank">
												Découvrir
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="mt-4 flex items-center justify-between">
						<span className="text-sm font-medium text-gray-700">Publicité</span>
						<a className="text-sm font-medium text-sky-700" href="mailto:marin@legipilot.com" target="_blank">
							En savoir plus
						</a>
					</div>
				</CardContent>
			</Card>
		</>
	);
};
export default ViewCollaboratorIntern;

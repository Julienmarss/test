import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getCode, getNationality, nationalities, SERVICES } from "@/app/(app)/admin/collaborator/collaborator.service";
import React, { useState } from "react";
import { cn } from "@/utils/lib";
import { Input, isValidDateFormat } from "@/components/ui/Input";
import { UpdateCollaboratorRequest } from "@/api/collaborator/collaborators.api";
import { Select } from "@/components/ui/Select";
import ReactFlagsSelect from "react-flags-select";

type Props = {
	collaborator: UpdateCollaboratorRequest;
	handleInputChange: (key: string, value: string | boolean | number | string[] | undefined) => void;
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
			"grid grid-cols-1 items-center gap-x-3 border-b border-slate-100 px-2 py-3 last:border-b-0 odd:bg-gray-50 md:grid-cols-[1fr_2fr]",
			className,
		)}
	>
		<span className="text-sm text-slate-600">{label}</span>
		<div className="flex min-w-0 items-center justify-between space-x-2">{children}</div>
	</div>
);

export const ModifyCollaboratorExtern = ({ collaborator, handleInputChange }: Props) => {
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
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* État Civil */}
				<Card className="rounded-xl border border-slate-200">
					<CardHeader
						className="cursor-pointer"
						onClick={() => toggleSection("etat-civil-et-situation-professionnelle")}
					>
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
							<InfoField label="Nom">
								<Input
									placeholder={"Saisissez le nom de votre collaborateur"}
									value={collaborator.lastname}
									onChange={(e) => handleInputChange("lastname", e.target.value)}
									required
								/>
							</InfoField>
							<InfoField label="Prénoms">
								<Input
									placeholder={"Saisissez le prénom de votre collaborateur"}
									value={collaborator.firstname}
									onChange={(e) => handleInputChange("firstname", e.target.value)}
									required
								/>
							</InfoField>
							<InfoField label="Civilité">
								<Select
									placeholder={"Sélectionnez la civilité de votre collaborateur"}
									value={collaborator.civility}
									options={[
										{ label: "Monsieur", value: "Monsieur" },
										{
											label: "Madame",
											value: "Madame",
										},
									]}
									onChange={(value) => handleInputChange("civility", value)}
									className="w-full"
								/>
							</InfoField>
							<InfoField label="Date de naissance">
								<Input
									placeholder={"JJ/MM/AAAA"}
									value={collaborator.birthDate}
									error={
										!collaborator.birthDate
											? undefined
											: !isValidDateFormat(collaborator.birthDate)
												? "Le format de la date est incorrect (JJ/MM/AAAA)."
												: undefined
									}
									onChange={(e) => handleInputChange("birthDate", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Lieu de naissance">
								<Input
									placeholder={"Saisissez le lieu de naissance"}
									value={collaborator.birthPlace}
									onChange={(e) => handleInputChange("birthPlace", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Nationalité">
								<ReactFlagsSelect
									placeholder="Sélectionnez"
									selected={collaborator.nationality ? getCode(collaborator.nationality) : ""}
									onSelect={(code) => handleInputChange("nationality", getNationality(code))}
									customLabels={nationalities}
									className="h-12 w-full"
									searchable
								/>
							</InfoField>
						</CardContent>
					)}
				</Card>

				{/* Informations Contractuelles */}
				<Card className="rounded-xl border border-slate-200">
					<CardHeader
						className="cursor-pointer"
						onClick={() => toggleSection("etat-civil-et-situation-professionnelle")}
					>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M16.5 13.25V10.625C16.5 8.76104 14.989 7.25 13.125 7.25H11.625C11.0037 7.25 10.5 6.74632 10.5 6.125V4.625C10.5 2.76104 8.98896 1.25 7.125 1.25H5.25M5.25 14H12.75M5.25 17H9M7.5 1.25H2.625C2.00368 1.25 1.5 1.75368 1.5 2.375V19.625C1.5 20.2463 2.00368 20.75 2.625 20.75H15.375C15.9963 20.75 16.5 20.2463 16.5 19.625V10.25C16.5 5.27944 12.4706 1.25 7.5 1.25Z"
										stroke="#99A1AF"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<span className="text-lg font-medium text-gray-900">Informations Contractuelles</span>
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
							<InfoField label="Profession">
								<Input
									placeholder={"Saisissez la profession"}
									value={collaborator.jobTitle}
									onChange={(e) => handleInputChange("jobTitle", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Date d'embauche">
								<Input
									placeholder={"JJ/MM/YYYY"}
									value={collaborator.hireDate}
									error={
										!collaborator.hireDate
											? undefined
											: !isValidDateFormat(collaborator.hireDate)
												? "Le format de la date est incorrect (JJ/MM/AAAA)."
												: undefined
									}
									onChange={(e) => handleInputChange("hireDate", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Date de fin">
								<Input
									placeholder={"JJ/MM/YYYY"}
									value={collaborator.endDate}
									error={
										!collaborator.endDate
											? undefined
											: !isValidDateFormat(collaborator.endDate)
												? "Le format de la date est incorrect (JJ/MM/AAAA)."
												: undefined
									}
									onChange={(e) => handleInputChange("endDate", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Lieu de rattachement">
								<Input
									placeholder={"Saisissez le lieu de rattachement"}
									value={collaborator.location}
									onChange={(e) => handleInputChange("location", e.target.value)}
									className="w-full"
								/>
							</InfoField>
							<InfoField label="Rénumération">
								<Input
									type="amount"
									placeholder={"Saisissez la rémunération"}
									value={collaborator.totalCompensation}
									onChange={(e) => handleInputChange("totalCompensation", e.target.value)}
								/>
							</InfoField>
						</CardContent>
					)}
				</Card>

				{/* Coordonnées */}
				<Card className="rounded-xl border border-slate-200">
					<CardHeader
						className="cursor-pointer"
						onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}
					>
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
							<InfoField label="Téléphone">
								<Input
									type="tel"
									placeholder={"Ex: (+33) 6 00 00 00 00"}
									value={collaborator.personalPhone}
									onChange={(e) => handleInputChange("personalPhone", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Email">
								<Input
									type="email"
									placeholder={"Saisissez l'email"}
									value={collaborator.personalEmail}
									onChange={(e) => handleInputChange("personalEmail", e.target.value)}
									required
								/>
							</InfoField>
							<InfoField label="Adresse">
								<Input
									placeholder="Saisissez l'adresse"
									value={collaborator.personalAddress}
									onChange={(e) => handleInputChange("personalAddress", e.target.value)}
									className="w-full"
								/>
							</InfoField>
							<InfoField label="Coordonnées urgence">
								<div className="flex w-full flex-col gap-y-2">
									<Select
										label={"Civilité"}
										placeholder={"Sélectionnez la civilité"}
										value={collaborator.emergencyCivility}
										options={[
											{ label: "Monsieur", value: "Monsieur" },
											{
												label: "Madame",
												value: "Madame",
											},
										]}
										onChange={(value) => handleInputChange("emergencyCivility", value)}
									/>
									<Input
										label="Nom"
										placeholder={"Saisissez le nom"}
										value={collaborator.emergencyLastname}
										onChange={(e) => handleInputChange("emergencyLastname", e.target.value)}
									/>
									<Input
										label="Prénom"
										placeholder={"Saisissez le prénom"}
										value={collaborator.emergencyFirstname}
										onChange={(e) => handleInputChange("emergencyFirstname", e.target.value)}
									/>
									<Input
										type="tel"
										label="Téléphone"
										placeholder={"Ex: (+33) 6 00 00 00 00"}
										value={collaborator.emergencyPhone}
										onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
									/>
									<Input
										type="email"
										label="E-mail"
										placeholder={"Saisissez l'email"}
										value={collaborator.emergencyEmail}
										onChange={(e) => handleInputChange("emergencyEmail", e.target.value)}
									/>
								</div>
							</InfoField>
						</CardContent>
					)}
				</Card>

				{/* Informations Professionnelles */}
				<Card className="rounded-xl border border-slate-200">
					<CardHeader
						className="cursor-pointer"
						onClick={() => toggleSection("coordonnees-et-situation-contractuelle")}
					>
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
							<InfoField label="Dénomination sociale">
								<Input
									placeholder={"Saisissez la dénomination sociale"}
									value={collaborator.classification}
									onChange={(e) => handleInputChange("socialName", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Numéro de SIRET">
								<Input
									placeholder={"Saisissez le numéro de SIRET"}
									value={collaborator.classification}
									onChange={(e) => handleInputChange("siret", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Numéro de TVA">
								<Input
									placeholder={"Saisissez le numéro de TVA"}
									value={collaborator.classification}
									onChange={(e) => handleInputChange("tva", e.target.value)}
								/>
							</InfoField>
							<InfoField label="Inscription RCS">
								<Input
									placeholder={"Saisissez l'inscription RCS"}
									value={collaborator.classification}
									onChange={(e) => handleInputChange("rcs", e.target.value)}
								/>
							</InfoField>
							<div>
								<h4 className="mb-4 text-xs font-medium text-sky-600">Coordonnées Bancaires</h4>
								<InfoField label="IBAN">
									<Input
										type="text"
										placeholder={"Saisissez l'IBAN"}
										value={collaborator.iban}
										onChange={(e) => handleInputChange("iban", e.target.value)}
									/>
								</InfoField>
								<InfoField label="BIC">
									<Input
										type="text"
										placeholder={"Saisissez le BIC"}
										value={collaborator.bic}
										onChange={(e) => handleInputChange("bic", e.target.value)}
									/>
								</InfoField>
							</div>
						</CardContent>
					)}
				</Card>
			</div>
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
				<CardContent className="flex min-h-[17rem] flex-col justify-between p-0 md:p-6">
					{" "}
					{/* ← adapte la hauteur */}
					<table className="w-full">
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

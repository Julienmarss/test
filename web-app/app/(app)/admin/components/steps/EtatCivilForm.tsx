import {
	UpdateCollaboratorRequest,
	useAddCollaborator,
	useSendMailCollaboratorToComplete,
	useUpdateCollaborator,
} from "@/api/collaborator/collaborators.api";
import {
	getCode,
	getNationality,
	isValidSocialSecurityNumber,
	nationalities,
} from "@/app/(app)/admin/collaborator/collaborator.service";
import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { Input, isValidDateFormat } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { useEffect, useState } from "react";
import ReactFlagsSelect from "react-flags-select";

type Props = {
	collaborator: UpdateCollaboratorRequest;
	handleInputChange: (key: string, value: string | boolean | number | string[]) => void;
	isFreelance?: boolean;
	showInvitationButton?: boolean; // NOUVEAU: prop pour contrôler l'affichage du bouton
};

export const EtatCivilForm = ({ collaborator, handleInputChange, isFreelance, showInvitationButton = true }: Props) => {
	const { company } = showInvitationButton ? useSelectedCompany() : { company: null }; // Utiliser useCompany seulement si nécessaire
	const [invitationSent, setInvitationSent] = useState(false);
	const [needsToSendEmail, setNeedsToSendEmail] = useState(false);

	// Hooks d'invitation conditionnels
	const {
		mutate: addCollaborator,
		isPending: isAddPending,
		isSuccess: isAddSuccess,
		data: addData,
	} = showInvitationButton
		? useAddCollaborator()
		: {
				mutate: () => {},
				isPending: false,
				isSuccess: false,
				data: null,
			};

	const {
		mutate: updateCollaborator,
		isPending: isUpdatePending,
		isSuccess: isUpdateSuccess,
	} = showInvitationButton
		? useUpdateCollaborator()
		: {
				mutate: () => {},
				isPending: false,
				isSuccess: false,
			};

	const {
		mutate: sendMailToComplete,
		isPending: isSendMailPending,
		isSuccess: isSendMailSuccess,
		isError: isSendMailError,
		error: sendMailError,
	} = showInvitationButton
		? useSendMailCollaboratorToComplete()
		: {
				mutate: () => {},
				isPending: false,
				isSuccess: false,
				isError: false,
				error: null,
			};

	// Affichage des erreurs
	useEffect(() => {
		if (isSendMailError) {
			console.error("Erreur envoi email complète:", {
				error: sendMailError,
				message: sendMailError?.message,
				response: sendMailError?.response,
				status: sendMailError?.response?.status,
				data: sendMailError?.response?.data,
			});
			// Réinitialiser l'état en cas d'erreur
			setNeedsToSendEmail(false);
		}
	}, [isSendMailError, sendMailError]);

	// Fonction pour envoyer l'invitation
	const handleInviteCollaborator = () => {
		// Si le collaborateur n'existe pas encore, on le crée d'abord
		if (!collaborator.id && collaborator.firstname && collaborator.lastname && collaborator.personalEmail) {
			setNeedsToSendEmail(true);
			addCollaborator({ collaborator, companyId: company.id });
		}
		// Si le collaborateur existe déjà, on met à jour ses infos d'abord, puis on envoie l'email
		else if (collaborator.id) {
			setNeedsToSendEmail(true);
			updateCollaborator({ collaborator, companyId: company.id });
		} else {
			console.error("Impossible d'envoyer l'invitation : données manquantes", {
				id: collaborator.id,
				firstname: collaborator.firstname,
				lastname: collaborator.lastname,
				email: collaborator.personalEmail,
			});
		}
	};

	// Vérifier si les champs requis pour l'invitation sont remplis
	const canInvite = collaborator.firstname && collaborator.lastname && collaborator.personalEmail && !invitationSent;

	useEffect(() => {
		if (isAddSuccess && addData?.id && needsToSendEmail) {
			handleInputChange("id", addData.id);

			// Délai plus long pour laisser le temps à la base de données de se synchroniser
			setTimeout(() => {
				sendMailToComplete({
					companyId: company.id,
					collaboratorId: addData.id,
				});
			}, 2000);

			setNeedsToSendEmail(false);
		}
	}, [isAddSuccess, addData]);

	useEffect(() => {
		if (isSendMailSuccess) {
			setInvitationSent(true);
		}
	}, [isSendMailSuccess]);

	return (
		<div id="etat-civil" className="flex flex-col gap-y-4 rounded-lg border border-slate-200 bg-white p-2 md:p-6">
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

			<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
				<Input
					label="Nom"
					placeholder={"Saisissez le nom de votre collaborateur"}
					value={collaborator.lastname}
					onChange={(e) => handleInputChange("lastname", e.target.value)}
					required
				/>
				<Input
					label="Prénom"
					placeholder={"Saisissez le prénom de votre collaborateur"}
					value={collaborator.firstname}
					onChange={(e) => handleInputChange("firstname", e.target.value)}
					required
				/>
			</div>

			<div className="grid grid-cols-1 gap-2">
				<Input
					type="email"
					label="E-mail personnel"
					placeholder="Saisissez l'email personnel du collaborateur"
					value={collaborator.personalEmail}
					onChange={(e) => handleInputChange("personalEmail", e.target.value)}
					required
					className="w-full"
				/>
				{showInvitationButton && (
					<ActionButton
						disabled={!canInvite || isSendMailPending || isAddPending}
						onClick={handleInviteCollaborator}
						className={`w-fit transition-all duration-300 ${!canInvite && "cursor-not-allowed bg-gray-400"}`}
					>
						{isSendMailPending || (isAddPending && needsToSendEmail) ? (
							<div className="flex items-center gap-x-2">
								<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
								<span>Envoi en cours...</span>
							</div>
						) : invitationSent ? (
							<div className="flex items-center gap-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="size-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Invitation envoyée ✓</span>
							</div>
						) : (
							<div className="flex items-center gap-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
									/>
								</svg>
								<span>Inviter le collaborateur à remplir son profil</span>
							</div>
						)}
					</ActionButton>
				)}
			</div>

			{/* Bouton d'invitation en option en dessous du champ email */}

			<Select
				label={"Civilité"}
				placeholder={"Sélectionnez la civilité de votre collaborateur"}
				value={collaborator.civility}
				options={[
					{ label: "Monsieur", value: "Monsieur" },
					{ label: "Madame", value: "Madame" },
				]}
				onChange={(value) => handleInputChange("civility", value)}
				className="w-full"
			/>

			<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
				<Input
					label="Date de naissance"
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
				<Input
					label="Lieu de naissance"
					placeholder={"Saisissez le lieu de naissance"}
					value={collaborator.birthPlace}
					onChange={(e) => handleInputChange("birthPlace", e.target.value)}
				/>
			</div>

			<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
				<div className="flex flex-col gap-y-1">
					<label className="text-sm font-medium text-gray-900">Nationalité</label>
					<ReactFlagsSelect
						placeholder="Sélectionnez la nationalité"
						selected={collaborator.nationality ? getCode(collaborator.nationality) : ""}
						onSelect={(code) => handleInputChange("nationality", getNationality(code))}
						customLabels={nationalities}
						className="h-12 md:w-full [&_button]:rounded-md [&_button]:border-gray-300 [&_button]:py-1 [&_button]:transition [&_button]:hover:border-gray-400 [&_button_span]:text-sm [&_button_span]:text-gray-400 [&_ul]:bottom-0 [&_ul]:-translate-y-14"
						searchable
					/>
				</div>
				{!isFreelance && (
					<Input
						label="Numéro de sécurité sociale"
						placeholder={"Saisissez le numéro de sécurité sociale"}
						value={collaborator.socialSecurityNumber}
						error={
							!collaborator.socialSecurityNumber
								? undefined
								: !isValidSocialSecurityNumber(collaborator.socialSecurityNumber)
									? "Le numéro de sécurité sociale doit contenir exactement 15 chiffres."
									: undefined
						}
						onChange={(e) => handleInputChange("socialSecurityNumber", e.target.value)}
						className="w-full"
					/>
				)}
			</div>
		</div>
	);
};

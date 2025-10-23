import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { Modal } from "@/components/ui/Modal";
import React, { useEffect, useState } from "react";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import {
	UpdateCollaboratorRequest,
	useAddCollaborator,
	useUpdateCollaborator,
} from "@/api/collaborator/collaborators.api";
import { cn } from "@/utils/lib";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { EtatCivilForm } from "../steps/EtatCivilForm";
import { CoordonneesForm } from "@/app/admin/components/steps/CoordonneesForm";
import { DocumentsForm } from "@/app/admin/components/steps/DocumentsForm";
import { isServiceError } from "@/api/client.api";
import { INITIAL_CREATION_STATE } from "@/app/admin/components/modals/create-collaborator.service";
import CompleteProfileForm from "../steps/CompleteProfileForm";
import { InformationContractuelleForm } from "../steps/InformationContractuelleForm";
import { InformationProfessionnelleForm } from "../steps/InformationProfessionnelleForm";

type Props = {
	open: boolean;
	onClose: () => void;
};

const STEPS = [
	{ id: "etat-civil", label: "État Civil" },
	{ id: "information-contractuelle", label: "Informations Contractuelles" },
	{ id: "coordonnees", label: "Coordonnées" },
	{ id: "information-professionnelle", label: "Informations Professionnelles" },
	{ id: "documents", label: "Ajout de documents" },
];

export const CreateFreelanceModal = ({ open, onClose }: Props) => {
	const { company } = useSelectedCompany();
	const [currentStep, setCurrentStep] = useState(0);
	const [collaborator, setCollaborator] = useState<UpdateCollaboratorRequest>(INITIAL_CREATION_STATE);
	const {
		mutate: addCollaborator,
		isPending: isAddPending,
		isError: isAddError,
		isSuccess: isAddSuccess,
		error: addError,
		data,
	} = useAddCollaborator();
	const {
		mutate: updateCollaborator,
		isPending: isUpdatePending,
		isError: isUpdateError,
		isSuccess: isUpdateSuccess,
		error: updateError,
	} = useUpdateCollaborator();

	function handleInputChange(field: string, value?: string | boolean | number | string[]) {
		setCollaborator({ ...collaborator, [field]: value });
	}

	const handleScrollTo = (step: number) => {
		const id = STEPS[step].id;
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
		setCurrentStep(step);
	};

	useEffect(() => {
		if (isAddSuccess) {
			handleInputChange("id", data.id);
			handleScrollTo(currentStep + 1);
		}
	}, [isAddSuccess]);

	useEffect(() => {
		if (isUpdateSuccess && currentStep < STEPS.length - 1) {
			handleScrollTo(currentStep + 1);
		} else if (isUpdateSuccess && currentStep === STEPS.length - 1) {
			onClose();
		}
	}, [isUpdateSuccess]);

	const save = () => {
		if (collaborator.id === undefined) {
			addCollaborator({ collaborator, companyId: company.id });
		} else {
			updateCollaborator({ collaborator: { ...collaborator, contractType: "EXT" }, companyId: company.id });
		}
	};

	const disabled = isAddPending || isUpdatePending || collaborator.firstname === "" || collaborator.lastname === "";

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={"Ajouter un profil freelance"}
			subtitle={"Création de votre profil freelance"}
			footer={
				<div className={`flex w-full flex-row ${currentStep > 0 ? "justify-between" : "justify-end"}`}>
					<>
						{currentStep > 0 && (
							<OutlineButton onClick={() => handleScrollTo(currentStep - 1)}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 text-gray-400"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
								</svg>
								Revenir à {STEPS[currentStep - 1].label}
							</OutlineButton>
						)}
						{isAddError && isServiceError(isAddError) && (
							<span className="text-sm text-red-500">{addError.message}</span>
						)}
						{isUpdateError && isServiceError(isUpdateError) && (
							<span className="text-sm text-red-500">{updateError.message}</span>
						)}
						{currentStep < STEPS.length - 1 ? (
							<ActionButton disabled={disabled} onClick={() => save()}>
								Continuer vers {STEPS[currentStep + 1].label}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 text-sky-50"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
								</svg>
							</ActionButton>
						) : (
							<ActionButton onClick={() => save()} disabled={disabled || isAddPending || isUpdatePending}>
								Finaliser la création du profil
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 text-sky-50"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
								</svg>
							</ActionButton>
						)}
					</>
				</div>
			}
		>
			<article className="flex h-full w-full flex-row items-start justify-start gap-x-6 py-[1em] md:h-auto md:px-[3em]">
				<aside className="hidden flex-col rounded-lg border border-slate-200 bg-white md:flex">
					{STEPS.map((step, index) => (
						<div
							key={step.id}
							className={cn(
								"flex cursor-pointer items-center justify-start gap-x-4 p-4",
								index > 0 && "border-t border-slate-200",
							)}
							onClick={() => !disabled && handleScrollTo(index)}
						>
							<span
								className={`text-center ${currentStep >= index ? "bg-sky-100 pt-1" : "border-2 border-slate-200 bg-white pt-0.5 text-slate-400"} h-[32px] w-[32px] rounded-full`}
							>
								{currentStep > index ? "✓" : index + 1}
							</span>
							<div className="flex flex-col">
								<span className="text-sm text-sky-600">Etape {index + 1}</span>
								<span className={`text-sm ${index + 1 === currentStep ? "text-gray-900" : "text-gray-500"}`}>
									{step.label}
								</span>
							</div>
						</div>
					))}
				</aside>

				<section className="flex h-full w-full flex-col gap-y-4 md:max-h-[70vh] md:w-[75%] md:overflow-y-hidden">
					<EtatCivilForm collaborator={collaborator} handleInputChange={handleInputChange} isFreelance />
					<InformationContractuelleForm collaborator={collaborator} handleInputChange={handleInputChange} />
					<CoordonneesForm collaborator={collaborator} handleInputChange={handleInputChange} isFreelance />
					<InformationProfessionnelleForm collaborator={collaborator} handleInputChange={handleInputChange} />
					{collaborator.id && <DocumentsForm collaboratorId={collaborator.id} companyId={company.id} />}
				</section>
			</article>
		</Modal>
	);
};

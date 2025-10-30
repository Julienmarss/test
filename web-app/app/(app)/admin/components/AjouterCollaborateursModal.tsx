import { Modal } from "@/components/ui/Modal";
import React, { useState } from "react";
import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { ImportCollaboratorsModal } from "./modals/ImportCollaboratorsModal";
import { CreateCollaboratorModal } from "./modals/CreateCollaboratorModal";
import { User } from "lucide-react";
import { CreateFreelanceModal } from "./modals/CreateFreelanceModal";

type CreationStep = "MENU" | "CREATE" | "IMPORT" | "CREATE-FREELANCE";
type Props = {
	open: boolean;
	onClose: () => void;
};
export const AjouterCollaborateursModal = ({ open, onClose }: Props) => {
	const [step, setStep] = useState<CreationStep>("MENU");

	if (step === "CREATE") {
		return <CreateCollaboratorModal open={open} onClose={onClose} />;
	}

	if (step === "CREATE-FREELANCE") {
		return <CreateFreelanceModal open={open} onClose={onClose} />;
	}

	if (step === "IMPORT") {
		return <ImportCollaboratorsModal open={open} onClose={onClose} />;
	}

	return (
		<Modal open={open} onClose={onClose} title={"Ajouter un collaborateur"}>
			<article className="flex flex-col gap-4 p-0 md:flex-row md:gap-0 md:p-[8em]">
				<div className="mr-4 w-[20em] justify-center justify-items-center rounded-lg border bg-white p-6 text-center shadow-sm">
					<div className="mb-4 flex justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-12 text-gray-400"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-sm font-medium text-gray-900">Création unique d'un collaborateur</h3>
					<p className="mb-4 text-sm text-gray-500">Compléter manuellement le profil</p>
					<ActionButton onClick={() => setStep("CREATE")}>+ Créer le profil</ActionButton>
				</div>

				<div className="mr-4 w-[20em] justify-center justify-items-center rounded-lg border bg-white p-6 text-center shadow-sm">
					<div className="mb-4 flex justify-center">
						<User className="size-12 text-gray-400" />
					</div>
					<h3 className="mb-2 text-sm font-medium text-gray-900">Création unique d'un profil freelance</h3>
					<p className="mb-4 text-sm text-gray-500">Compléter manuellement le profil</p>
					<ActionButton onClick={() => setStep("CREATE-FREELANCE")}>+ Créer le profil</ActionButton>
				</div>

				{/* Carte 2 : Importation */}
				<div className="w-[20em] justify-center justify-items-center rounded-lg border bg-white p-6 text-center shadow-sm">
					<div className="mb-4 flex justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-12 text-gray-400"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
							/>
						</svg>
					</div>
					<h3 className="mb-2 text-sm font-medium text-gray-900">Importation groupée de collaborateurs</h3>
					<p className="mb-4 text-sm text-gray-500">Créer plusieurs profils depuis un fichier</p>
					<ActionButton onClick={() => setStep("IMPORT")}>+ Importer un fichier</ActionButton>
				</div>
			</article>
		</Modal>
	);
};

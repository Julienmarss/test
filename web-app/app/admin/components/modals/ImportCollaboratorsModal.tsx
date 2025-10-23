import { ActionButton } from "@/components/ui/buttons/ActionButton";
import { isServiceError } from "@/api/client.api";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { Modal } from "@/components/ui/Modal";
import { DragEvent, useEffect, useRef, useState } from "react";
import { useImportCollaborators } from "@/api/collaborator/collaborators.api";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";

type Props = {
	open: boolean;
	onClose: () => void;
};
export const ImportCollaboratorsModal = ({ open, onClose }: Props) => {
	const { company } = useSelectedCompany();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<Array<File>>([]);
	const { mutate: importCollaborators, isPending, isError, isSuccess, error } = useImportCollaborators();

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const droppedFiles = Array.from(e.dataTransfer.files);
		const acceptedFiles = droppedFiles.filter(
			(file) => file.name.endsWith(".csv") || file.name.endsWith(".xlsx") || file.name.endsWith(".txt"),
		);
		setFiles((prev) => [...prev, ...acceptedFiles]);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	useEffect(() => {
		if (isSuccess) {
			onClose();
		}
	}, [isSuccess]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={"Ajouter un collaborateur"}
			subtitle={"Importation de vos collaborateurs"}
			footer={
				<div className="flex flex-row justify-end">
					<ActionButton
						onClick={() => company && importCollaborators({ files, companyId: company.id })}
						disabled={!files || (files && files.length === 0) || isPending}
					>
						Importer
					</ActionButton>
				</div>
			}
		>
			<article className="gap-y-4 p-[8px] md:p-[8em]">
				<div className="flex flex-col gap-2">
					{files && files.length > 0 ? (
						<>
							{files.map((file, index) => (
								<div key={index} className="flex flex-col items-start space-x-2 rounded-lg bg-white p-4">
									<div className="flex flex-row items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-8 text-gray-400"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
											/>
										</svg>
										<span className="ml-2 pt-1 text-lg text-gray-900">Importation de votre fichier</span>
									</div>

									<div className="mt-4 flex w-full flex-row items-center rounded-lg bg-gray-50 p-8">
										{isPending ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="size-6 animate-spin text-sky-600"
											>
												<path
													fillRule="evenodd"
													d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
													clipRule="evenodd"
												/>
											</svg>
										) : isError ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 text-red-600"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
												/>
											</svg>
										) : isSuccess ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 text-green-600"
											>
												<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6 text-sky-600"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
													className="text-gray-400"
												/>
											</svg>
										)}
										<span className="ml-3 text-sm text-gray-900">{file.name}</span>
									</div>
								</div>
							))}

							{isError && isServiceError(error) && <span className="mt-4 text-sm text-red-600">{error.message}</span>}
						</>
					) : (
						<div
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							className="flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:border-solid hover:border-sky-600 hover:bg-sky-50"
						>
							{/* Icône */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="mb-4 size-12 rounded-full bg-sky-600 p-2 font-semibold text-white"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
								/>
							</svg>

							{/* Texte */}
							<h2 className="text-lg font-semibold text-gray-800">
								Importer un fichier contenant les informations de vos collaborateurs
							</h2>
							<p className="mb-4 text-xs text-gray-500">
								Déposez ou choisissez votre fichier comme la DSN, le registre unique du personnel, ou tout fichier
								contenant la liste de vos collaborateurs en format Excel, csv ou txt.
							</p>

							{/* Bouton Choisir un fichier */}
							<label className="inline-block cursor-pointer">
								<input
									type="file"
									accept=".csv,.xlsx,.txt"
									className="hidden"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											setFiles((prev) => [...prev, file]);
										}
									}}
									ref={fileInputRef}
								/>
								<OutlineButton
									onClick={() => fileInputRef.current?.click()}
									icon={
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-4 text-gray-500"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
											/>
										</svg>
									}
								>
									Choisissez un fichier
								</OutlineButton>
							</label>
						</div>
					)}

					<div className="mt-4 flex w-full flex-row items-center justify-start rounded-lg bg-blue-100 p-4 text-blue-900">
						<div className="flex flex-row items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-6 text-blue-900"
							>
								<path
									fillRule="evenodd"
									d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="ml-3">
								Accéder à la page aide et commentaires pour comprendre l'importation groupée.
							</span>
						</div>
						<a
							href="https://www.legipilot.com/aide-commentaires"
							className="ml-3 flex flex-row items-center font-semibold hover:underline"
							target="_blank"
						>
							Accéder
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="ml-2 size-6 text-blue-900"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
							</svg>
						</a>
					</div>
				</div>
			</article>
		</Modal>
	);
};

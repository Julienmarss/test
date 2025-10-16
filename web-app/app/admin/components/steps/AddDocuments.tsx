import { Select } from "@/components/ui/Select";
import { DocumentResponse, DocumentTypeResponse } from "@/api/collaborator/collaborators.dto";
import { isServiceError } from "@/api/client.api";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { DragEvent, useRef } from "react";
import { useAddDocuments, useDeleteDocument, useUpdateDocument } from "@/api/collaborator/documents.api";
import { UUID } from "crypto";
import { Ellipsis } from "@/components/ui/Ellipsis";
import { Trash } from "@/components/ui/icons/Trash";

type Props = {
	collaboratorId: UUID;
	companyId: UUID;
	documents?: Array<DocumentResponse>;
};
export const AddDocuments = ({ collaboratorId, companyId, documents }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { mutate: addDocuments, isPending, isError, isSuccess, error } = useAddDocuments();
	const { mutate: updateDocument, isPending: isPendingUpdate } = useUpdateDocument();
	const { mutate: deleteDocument, isPending: isPendingDelete } = useDeleteDocument();

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const droppedFiles = Array.from(e.dataTransfer.files);
		addDocuments({ collaboratorId, companyId, documents: droppedFiles });
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	return (
		<>
			{documents && documents.length > 0 ? (
				<table className="w-full rounded-lg bg-gray-50">
					<tbody>
						{documents.map((document, index) => (
							<tr key={index}>
								<td className="w-0 whitespace-nowrap p-4 align-middle">
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
											d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
										/>
									</svg>
								</td>

								<td className="w-[30vw] align-middle">
									<span className="ml-3 flex items-center gap-x-2 text-sm text-gray-900">
										{document.filename}
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
												viewBox="0 0 24 24"
												fill="currentColor"
												className="size-5 text-green-600"
											>
												<path
													fillRule="evenodd"
													d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
													clipRule="evenodd"
												/>
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="size-5 text-green-600"
											>
												<path
													fillRule="evenodd"
													d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</span>
								</td>

								<td className="p-2 align-middle">
									<Select
										placeholder="Catégorie de document"
										value={document.type}
										options={[
											{
												value: "Contrats et avenants",
												label: "Contrats et avenants",
											},
											{ value: "Administratif", label: "Administratif" },
											{
												value: "Autres",
												label: "Autres",
											},
										]}
										onChange={(value) =>
											updateDocument({
												document: {
													id: document.id,
													type: value as DocumentTypeResponse,
												},
												collaboratorId,
												companyId,
											})
										}
										isClearable={false}
										disabled={isPending || isPendingUpdate}
										placement="top"
									/>
								</td>

								<td>
									<Ellipsis
										actions={[
											{
												label: "Supprimer",
												icon: Trash,
												onClick: () =>
													deleteDocument({
														collaboratorId,
														companyId,
														documentId: document.id,
													}),
											},
										]}
									/>
								</td>
							</tr>
						))}
					</tbody>

					{isError && isServiceError(error) && <span className="mt-4 text-sm text-red-600">{error.message}</span>}
				</table>
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
						className="mb-4 size-20 rounded-full bg-sky-600 p-2 font-semibold text-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
						/>
					</svg>

					{/* Texte */}
					<h2 className="text-lg font-semibold text-gray-800">Télécharger les documents</h2>
					<p className="mb-4 text-xs text-gray-500">
						Vous pouvez télécharger des documents aux formats :.PDF, .JPEG, .PNG...
					</p>

					{/* Bouton Choisir un fichier */}
					<label className="inline-block cursor-pointer">
						<input
							type="file"
							className="hidden"
							onChange={(e) => {
								const selectedFiles = e.target.files;
								selectedFiles &&
									addDocuments({
										collaboratorId,
										companyId,
										documents: [...selectedFiles],
									});
							}}
							ref={fileInputRef}
							multiple
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
							Ajouter un document
						</OutlineButton>
					</label>
				</div>
			)}
		</>
	);
};

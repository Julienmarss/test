import { CollaboratorResponse, DocumentResponse, DocumentTypeResponse } from "@/api/collaborator/collaborators.dto";
import {
	useAddDocuments,
	useDeleteDocument,
	useUpdateDocument,
	useVisualizeDocument,
} from "@/api/collaborator/documents.api";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ellipsis } from "@/components/ui/Ellipsis";
import { EyeDocument } from "@/components/ui/icons/EyeDocument";
import { Pencil } from "@/components/ui/icons/Pencil";
import { Trash } from "@/components/ui/icons/Trash";
import { Select } from "@/components/ui/Select";
import { UUID } from "node:crypto";
import { useEffect, useRef, useState } from "react";

type Props = {
	collaborator: CollaboratorResponse;
	companyId: UUID;
};
const types: { name: string; value?: DocumentTypeResponse }[] = [
	{
		name: "Contrats et avenants",
		value: "Contrats et avenants",
	},
	{
		name: "Administratif",
		value: "Administratif",
	},
	{
		name: "Autres",
		value: "Autres",
	},
	{
		name: "Sans type",
		value: undefined,
	},
];

export const DocumentsCard = ({ collaborator, companyId }: Props) => {
	const [editionMode, setEditionMode] = useState(false);
	const documentsInputRef = useRef<HTMLInputElement>(null);
	const { mutate: addDocument } = useAddDocuments();
	const { mutate: updateDocument, isPending: isPendingUpdate, isSuccess } = useUpdateDocument();
	const { mutate: deleteDocument } = useDeleteDocument();
	const { mutate: visualizeDocument } = useVisualizeDocument();

	const addAdocument = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			addDocument({
				collaboratorId: collaborator.id,
				companyId: companyId,
				documents: [...event.target.files],
			});
		}
	};

	function documentsOfType(type?: DocumentTypeResponse): DocumentResponse[] {
		if (!type) {
			return collaborator.documents.filter((document) => !document.type);
		} else {
			return collaborator.documents.filter((document) => document.type === type);
		}
	}

	useEffect(() => {
		if (isSuccess) {
			setEditionMode(false);
		}
	}, [isSuccess]);

	return (
		<Card className="rounded-xl border border-slate-200">
			<input
				type="file"
				ref={documentsInputRef}
				style={{ display: "none" }}
				onChange={addAdocument}
				accept="image/*,.pdf,.doc,.docx,.odt,.xls,.xlsx,.ppt,.pptx"
			/>

			<CardHeader className="cursor-pointer">
				<CardTitle className="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
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
								d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
							/>
						</svg>

						<span className="text-lg font-medium text-gray-900">Documents</span>
					</div>
					<OutlineButton onClick={() => documentsInputRef.current?.click()}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 text-gray-500"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
							/>
						</svg>
						Ajouter un document
					</OutlineButton>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{types.map((type) => (
					<div key={type.name}>
						{documentsOfType(type.value).length > 0 && <span className="text-sm text-sky-600">{type.name}</span>}
						<table className="w-max overflow-x-auto md:w-full">
							<tbody>
								{documentsOfType(type.value).map((document, index) => (
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

										<td className="w-full align-middle">
											<span className="ml-3 flex items-center gap-x-2 text-sm text-gray-900">{document.filename}</span>
										</td>

										{editionMode && (
											<td className="min-w-[15em] p-2 align-middle">
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
															collaboratorId: collaborator.id,
															companyId,
														})
													}
													isClearable={false}
													disabled={isPendingUpdate}
												/>
											</td>
										)}

										<td>
											<Ellipsis
												actions={[
													{
														label: "Consulter",
														icon: EyeDocument,
														onClick: () =>
															visualizeDocument({
																collaboratorId: collaborator.id,
																companyId,
																documentId: document.id,
															}),
													},
													{
														label: "Modifier",
														icon: Pencil,
														onClick: () => setEditionMode(true),
													},
													{
														label: "Supprimer",
														icon: Trash,
														onClick: () =>
															deleteDocument({
																collaboratorId: collaborator.id,
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
						</table>
					</div>
				))}
			</CardContent>
		</Card>
	);
};

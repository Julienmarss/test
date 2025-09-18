import {useCollaborator} from "@/api/collaborator/collaborators.api";
import {UUID} from "node:crypto";
import {AddDocuments} from "./AddDocuments";

export const DocumentsForm = ({collaboratorId, companyId}: {
    collaboratorId: UUID,
    companyId: UUID
}) => {
    const {data: collaborator} = useCollaborator(companyId, collaboratorId);

    return (
        <div id="documents"
             className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-6 overflow-visible z-0">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                </svg>
                <span className="text-lg font-medium text-gray-900">Documents</span>
            </div>

            {collaborator && <AddDocuments
                collaboratorId={collaboratorId}
                companyId={companyId}
                documents={collaborator.documents || []}
            />}
        </div>
    );
};
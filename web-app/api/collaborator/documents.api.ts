import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UUID} from "node:crypto";
import {serviceClient} from "@/api/client.api";
import {toast} from "@/hooks/use-toast";
import {CollaboratorResponse, DocumentResponse, DocumentTypeResponse} from "@/api/collaborator/collaborators.dto";

export type UpdateDocumentRequest = {
    id: UUID,
    type: DocumentTypeResponse,
}

type CollaboratorDocumentResponse = {
    url: string;
}

export function useAddDocuments() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({collaboratorId, companyId, documents}: {
            collaboratorId: UUID,
            companyId: UUID,
            documents: File[]
        }) => {
            const formData = new FormData();
            documents.forEach((document) => {
                formData.append("documents", document);
            });

            const response = await serviceClient.post<CollaboratorResponse>(`/companies/${companyId}/collaborators/${collaboratorId}/documents`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        },
        onSuccess: (collaborator: CollaboratorResponse) => {
            queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
        },
        onError: () => {
            toast({
                title: "Ajout echoué",
                description: "Désolé, une erreur est survenue lors de l'ajout de votre document.",
                variant: "destructive",
            });
        },
    });
}

export function useUpdateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({document, collaboratorId, companyId}: { document: UpdateDocumentRequest, companyId: UUID, collaboratorId: UUID }) => {
            const response = await serviceClient.patch<CollaboratorResponse>(`/companies/${companyId}/collaborators/${collaboratorId}/documents/${document.id}`, document);
            return response.data;
        },
        onSuccess: (collaborator: CollaboratorResponse) => {
            queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
        },
        onError: () => {
            toast({
                title: "Modification echouée",
                description: "Désolé, une erreur est survenue lors de la mise à jour de votre document.",
                variant: "destructive",
            });
        },
    });
}

export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({collaboratorId, companyId, documentId}: {
            collaboratorId: UUID,
            companyId: UUID,
            documentId: UUID
        }) => {
            const response = await serviceClient.delete<CollaboratorResponse>(`/companies/${companyId}/collaborators/${collaboratorId}/documents/${documentId}`);
            return response.data;
        },
        onSuccess: (collaborator: CollaboratorResponse) => {
            queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
        },
        onError: () => {
            toast({
                title: "Suppression echouée",
                description: "Désolé, une erreur est survenue lors de la suppression de votre document.",
                variant: "destructive",
            });
        },
    });
}

export function useVisualizeDocument() {
    return useMutation({
        mutationFn: async ({collaboratorId, companyId, documentId}: {
            collaboratorId: UUID,
            companyId: UUID,
            documentId: UUID
        }) => {
            const response = await serviceClient.get<CollaboratorDocumentResponse>(`/companies/${companyId}/collaborators/${collaboratorId}/documents/${documentId}`);
            return response.data;
        },
        onSuccess: (document: CollaboratorDocumentResponse) => {
            window.open(document.url, "_blank");
        },
        onError: () => {
            toast({
                title: "Télechargement echoué",
                description: "Désolé, une erreur est survenue lors du téléchargement de votre document.",
                variant: "destructive",
            });
        },
    });
}
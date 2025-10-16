import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UUID } from "node:crypto";
import { serviceClient } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";

export function useAddNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			collaboratorId,
			companyId,
			content,
			title,
		}: {
			collaboratorId: UUID;
			companyId: UUID;
			title: string;
			content: string;
		}) => {
			const response = await serviceClient.post<CollaboratorResponse>(
				`/companies/${companyId}/collaborators/${collaboratorId}/notes`,
				{
					title: title,
					content: content,
				},
			);
			return response.data;
		},
		onSuccess: (collaborator: CollaboratorResponse) => {
			queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
		},
		onError: () => {
			toast({
				title: "Ajout echoué",
				description: "Désolé, une erreur est survenue lors de l'ajout de la note du collaborateur.",
				variant: "destructive",
			});
		},
	});
}

export function useModifyNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			collaboratorId,
			companyId,
			content,
			title,
			id,
		}: {
			collaboratorId: UUID;
			companyId: UUID;
			title: string;
			content: string;
			id: UUID;
		}) => {
			const response = await serviceClient.patch<CollaboratorResponse>(
				`/companies/${companyId}/collaborators/${collaboratorId}/notes/${id}`,
				{
					title: title,
					content: content,
				},
			);
			return response.data;
		},
		onSuccess: (collaborator: CollaboratorResponse) => {
			queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
		},
		onError: () => {
			toast({
				title: "Ajout echoué",
				description: "Désolé, une erreur est survenue lors de l'ajout de la note du collaborateur.",
				variant: "destructive",
			});
		},
	});
}

export function useDeleteNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			collaboratorId,
			companyId,
			noteId,
		}: {
			collaboratorId: UUID;
			companyId: UUID;
			noteId: UUID;
		}) => {
			const response = await serviceClient.delete<CollaboratorResponse>(
				`/companies/${companyId}/collaborators/${collaboratorId}/notes/${noteId}`,
			);
			return response.data;
		},
		onSuccess: (collaborator: CollaboratorResponse) => {
			queryClient.setQueryData(["collaborator", collaborator.id], () => collaborator);
		},
		onError: () => {
			toast({
				title: "Suppression echouée",
				description: "Désolé, une erreur est survenue lors de la suppression de votre note.",
				variant: "destructive",
			});
		},
	});
}

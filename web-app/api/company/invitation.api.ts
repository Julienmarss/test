import { serviceClient, serviceClientNonAuthentifie } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UUID } from "node:crypto";

export type InvitationResponse = {
	id: UUID;
	email: string;
	right: string;
};

export type CreateInvitationRequest = {
	email: string;
	right: string;
};

export type AcceptInvitationRequest = {
	token: UUID;
	firstname: string;
	lastname: string;
	role: string;
	phone: string;
	password: string;
};

export type InvitationByTokenResponse = {
	email: string;
	companyName: string;
	firstname: string;
	lastname: string;
};

export function useAddInvitation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ invitation, companyId }: { invitation: CreateInvitationRequest; companyId: UUID }) => {
			const res = await serviceClient.post<InvitationResponse>(`/companies/${companyId}/invitation`, invitation);
			return res.data;
		},
		onSuccess: (data, { companyId }) => {
			const listKey = ["invitations", { companyId }] as const;

			queryClient.setQueryData<InvitationResponse[]>(listKey, (old) => (old ? [...old, data] : [data]));

			queryClient.setQueryData(["invitation", data.id], data);
		},
	});
}

export function useInvitations(companyId: string) {
	return useQuery({
		queryKey: ["invitations", { companyId }],
		queryFn: async () => {
			const res = await serviceClient.get<InvitationResponse[]>(`/companies/${companyId}/invitations`);
			return res.data;
		},
		enabled: !!companyId,
	});
}

export function useDeleteInvitation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ invitationId, companyId }: { invitationId: UUID; companyId: UUID }) => {
			await serviceClient.delete(`/companies/${companyId}/invitations/${invitationId}`);
			return invitationId;
		},
		onSuccess: (invitationId, { companyId }) => {
			const listKey = ["invitations", { companyId }] as const;

			queryClient.setQueryData<InvitationResponse[]>(listKey, (old = []) => old.filter((i) => i.id !== invitationId));

			queryClient.removeQueries({
				queryKey: ["invitation", invitationId],
				exact: true,
			});
		},
	});
}

export function useAcceptInvitation() {
	return useMutation({
		mutationFn: async (payload: AcceptInvitationRequest) => {
			await serviceClientNonAuthentifie.post<void>(`/invitations/accept`, payload);
		},
		onError: (err: any) => {
			toast({
				title: err?.title || err?.error || "Échec de l’acceptation de l’invitation",
				description: err?.message || "Une erreur est survenue pendant la création du compte.",
				variant: "destructive",
			});
		},
	});
}

export function useInvitationByToken(token: UUID) {
	return useQuery({
		queryKey: ["invitation-by-token", { token }],
		queryFn: async () => {
			const res = await serviceClientNonAuthentifie.get<InvitationByTokenResponse>("/invitations/details", {
				params: { token },
			});
			return res.data;
		},
		enabled: !!token,
	});
}

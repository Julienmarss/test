import { serviceClient, serviceClientNonAuthentifie } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UUID } from "node:crypto";

export type InvitationByTokenResponse = {
    token: string;
    email: string;
    status: string;
    rights: string;
    companyName: string;
    inviterFirstname: string;
    inviterLastname: string;
    isExpired: boolean;
};

export type InvitationResponse = {
    id: UUID;
    token: UUID;
    email: string;
    status: string;
    rights: string;
    createdAt: string;
    expiresAt: string;
};

export type CreateInvitationRequest = {
    email: string;
    rights: "MANAGER" | "READONLY";
};

export function useInvitationByToken(token: UUID) {
    return useQuery({
        queryKey: ["invitation-by-token", { token }],
        queryFn: async () => {
            const res = await serviceClientNonAuthentifie.get<InvitationByTokenResponse>(
                `/public/invitations/${token}`
            );
            return res.data;
        },
        enabled: !!token,
    });
}

export function useAddInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ invitation, companyId }: { invitation: CreateInvitationRequest; companyId: UUID }) => {
            const res = await serviceClient.post<InvitationResponse>(
                `/companies/${companyId}/administrators/invite`,
                invitation
            );
            return res.data;
        },
        onSuccess: (data, { companyId }) => {
            const listKey = ["invitations", { companyId }] as const;
            queryClient.setQueryData<InvitationResponse[]>(listKey, (old) => (old ? [...old, data] : [data]));
            queryClient.setQueryData(["invitation", data.id], data);

            toast({
                title: "Invitation envoyée",
                description: `L'invitation a été envoyée à ${data.email}`,
                variant: "default",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error?.response?.data?.message || "Impossible d'envoyer l'invitation",
                variant: "destructive",
            });
        },
    });
}

export function useInvitations(companyId: string) {
    return useQuery({
        queryKey: ["invitations", { companyId }],
        queryFn: async () => {
            const res = await serviceClient.get<InvitationResponse[]>(
                `/companies/${companyId}/administrators/invitations`
            );
            return res.data;
        },
        enabled: !!companyId,
    });
}

export function useDeleteInvitation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ invitationId, companyId }: { invitationId: UUID; companyId: UUID }) => {
            await serviceClient.delete(`/companies/${companyId}/administrators/invitations/${invitationId}`);
            return invitationId;
        },
        onSuccess: (invitationId, { companyId }) => {
            const listKey = ["invitations", { companyId }] as const;

            queryClient.setQueryData<InvitationResponse[]>(listKey, (old = []) => old.filter((i) => i.id !== invitationId));

            queryClient.removeQueries({
                queryKey: ["invitation", invitationId],
                exact: true,
            });

            toast({
                title: "Invitation supprimée",
                description: "L'invitation a été supprimée avec succès",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de supprimer l'invitation",
                variant: "destructive",
            });
        },
    });
}
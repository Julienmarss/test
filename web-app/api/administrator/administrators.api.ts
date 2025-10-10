import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceClient, serviceClientNonAuthentifie } from "@/api/client.api";
import { UUID } from "node:crypto";
import { AdministratorResponse } from "@/app/signup/signup.service";
import { toast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";

export type ModifyAdministratorRequest = {
    firstname?: string,
    lastname?: string,
    email?: string,
    phone?: string,
    picture?: string,
    fonction?: string,
    companyName?: string;
    siren?: string;
    siret?: string;
    legalForm?: string;
    nafCode?: string;
    principalActivity?: string;
    activityDomain?: string;
    collectiveAgreement?: string;
    idcc?: string;
    idCompany?: UUID;
    companyPicture?: string;
    isNotifViewed?: boolean;
    isNewsViewed?: boolean;
}

export function useValidateAccount() {
    return useMutation({
        mutationFn: async ({ id, token }: { id: number, token: UUID }) => {
            const response = await serviceClientNonAuthentifie.post<VoidFunction>(`/public/validate-account/${id}?token=${token}`);
            return response.data;
        }
    });
}

export function useAdministrator(id?: UUID) {
    return useQuery({
        queryKey: ["administrator"],
        queryFn: async () => {
            const response = await serviceClient.get<AdministratorResponse>(`/administrators/${id}`);
            return response.data;
        },
        enabled: !!id
    });
}

export function useModifyAdministrator() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ request, id }: { request: ModifyAdministratorRequest, id: UUID }) => {
            const response = await serviceClient.patch<AdministratorResponse>(`/administrators/${id}`, request);
            return response.data;
        },
        onSuccess: (admin: AdministratorResponse) => {
            queryClient.setQueryData(["administrator"], () => admin);
        },
        onError: () => {
            toast({
                title: "Modification echouée",
                description: "Désolé, une erreur est survenue lors de la mise à jour de votre compte.",
                variant: "destructive",
            });
        },
    });
}

export function useModifyAdministratorPicture() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, id }: { file: File, id: UUID }) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await serviceClient.post<AdministratorResponse>(`/administrators/${id}/picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: (admin: AdministratorResponse) => {
            queryClient.setQueryData(["administrator"], () => admin);
            toast({
                title: "Photo ajoutée",
                description: "Votre photo a bien été ajoutée.",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Ajout impossible",
                description: "Désolé, une erreur est survenue lors de l'ajout de votre photo de profil.",
                variant: "destructive",
            });
        },
    });
}

export function useDeleteAdministrator() {
    return useMutation({
        mutationFn: async (id: UUID) => {
            const response = await serviceClient.delete<VoidFunction>(`/administrators/${id}`);
            return response.data;
        },
        onSuccess: () => {
            signOut({ callbackUrl: "/signin" });
        },
        onError: () => {
            toast({
                title: "Supression echouée",
                description: "Désolé, une erreur est survenue lors de la supression de votre compte.",
                variant: "destructive",
            });
        },
    });
}
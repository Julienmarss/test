import {serviceClient, serviceClientNonAuthentifie} from "@/api/client.api";
import {AdministratorResponse, FonctionRequest} from "@/app/signup/signup.service";
import {toast} from "@/hooks/use-toast";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {signOut} from "next-auth/react";
import {UUID} from "node:crypto";

export type ModifyAdministratorRequest = {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    picture?: string;
    fonction?: string;
    isNewsViewed?: boolean;
    isNotifViewed?: boolean;
};

export function useValidateAccount() {
    return useMutation({
        mutationFn: async ({id, token}: { id: number; token: UUID }) => {
            const response = await serviceClientNonAuthentifie.post<VoidFunction>(
                `/public/validate-account/${id}?token=${token}`,
            );
            return response.data;
        },
    });
}

export function useAdministrator(id?: UUID) {
    return useQuery({
        queryKey: ["administrator"],
        queryFn: async () => {
            const response = await serviceClient.get<AdministratorResponse>(`/administrators/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useModifyAdministrator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({request, id}: { request: ModifyAdministratorRequest; id: UUID }) => {
            const response = await serviceClient.patch<AdministratorResponse>(
                `/administrators/${id}`,
                request
            );
            return response.data;
        },
        onMutate: async ({request}) => {
            await queryClient.cancelQueries({queryKey: ["administrator"]});

            const previousAdmin = queryClient.getQueryData<AdministratorResponse>(["administrator"]);

            if (previousAdmin) {
                queryClient.setQueryData<AdministratorResponse>(["administrator"], (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        ...(request.firstname !== undefined && {firstname: request.firstname}),
                        ...(request.lastname !== undefined && {lastname: request.lastname}),
                        ...(request.email !== undefined && {email: request.email}),
                        ...(request.phone !== undefined && {phone: request.phone}),
                        ...(request.fonction !== undefined && {fonction: request.fonction as FonctionRequest}),
                        ...(request.isNewsViewed !== undefined && {isNewsViewed: request.isNewsViewed}),
                        ...(request.isNotifViewed !== undefined && {isNotifViewed: request.isNotifViewed}),
                    };
                });
            }

            return {previousAdmin};
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["administrator"]});

            toast({
                title: "Modifications enregistrées",
                description: "Vos informations ont été mises à jour avec succès.",
                variant: "default",
            });
        },
        onError: (error: any, _variables, context) => {
            if (context?.previousAdmin) {
                queryClient.setQueryData(["administrator"], context.previousAdmin);
            }

            console.error("❌ Error:", error);
            toast({
                title: "Modification échouée",
                description: error?.response?.data?.message || "Une erreur est survenue.",
                variant: "destructive",
            });
        },
    });
}

export function useModifyAdministratorPicture() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({file, id}: { file: File; id: UUID }) => {
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
            signOut({callbackUrl: "/signin"});
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

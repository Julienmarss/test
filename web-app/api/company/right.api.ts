import { serviceClient } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UUID } from "node:crypto";

export type CompanyAdministratorInfo = {
    administratorId: UUID;
    rights: "OWNER" | "MANAGER" | "READONLY";
    firstname: string;
    lastname: string;
    email: string;
};

export type CompanyRightInfo = {
    right: "OWNER" | "MANAGER" | "READONLY";
    displayName: string;
};

export type UpdateRightsRequest = {
    rights: "MANAGER" | "READONLY";
};

export function useCompanyAdministrators(companyId: string) {
    return useQuery({
        queryKey: ["company-administrators", { companyId }],
        queryFn: async () => {
            const res = await serviceClient.get<CompanyAdministratorInfo[]>(`/companies/${companyId}/administrators`);
            return res.data;
        },
        enabled: !!companyId,
    });
}

export function useUpdateAdministratorRights() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               companyId,
                               administratorId,
                               rights,
                           }: {
            companyId: UUID;
            administratorId: UUID;
            rights: "MANAGER" | "READONLY"; // OWNER retiré
        }) => {
            await serviceClient.put(`/companies/${companyId}/administrators/${administratorId}/rights`, { rights });
        },
        onSuccess: (_, { companyId }) => {
            queryClient.invalidateQueries({
                queryKey: ["company-administrators", { companyId }],
            });

            toast({
                title: "Droits mis à jour",
                description: "Les droits de l'administrateur ont été modifiés",
                variant: "default",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error?.response?.data?.message || "Impossible de mettre à jour les droits",
                variant: "destructive",
            });
        },
    });
}

export function useRemoveAdministrator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ companyId, administratorId }: { companyId: UUID; administratorId: UUID }) => {
            await serviceClient.delete(`/companies/${companyId}/administrators/${administratorId}`);
            return { companyId, administratorId };
        },
        onSuccess: ({ companyId, administratorId }) => {
            queryClient.setQueryData<CompanyAdministratorInfo[]>(
                ["company-administrators", { companyId }],
                (old = []) => old.filter((a) => a.administratorId !== administratorId)
            );

            toast({
                title: "Administrateur retiré",
                description: "L'administrateur a été retiré de l'entreprise",
                variant: "default",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Erreur",
                description: error?.response?.data?.message || "Impossible de retirer l'administrateur",
                variant: "destructive",
            });
        },
    });
}

export function useAvailableRights() {
    return useQuery({
        queryKey: ["available-rights"],
        queryFn: async () => {
            const res = await serviceClient.get<CompanyRightInfo[]>(`/companies/any/administrators/available-rights`);
            return res.data;
        },
    });
}

export function useMyRights(companyId: string) {
    return useQuery({
        queryKey: ["my-rights", { companyId }],
        queryFn: async () => {
            const res = await serviceClient.get<CompanyRightInfo>(`/companies/${companyId}/administrators/my-rights`);
            return res.data;
        },
        enabled: !!companyId,
    });
}
import {UUID} from "node:crypto";
import {getCurrentUser, serverGet} from "@/api/server.api";
import {redirect} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "@/hooks/use-toast";
import {serviceClient} from "../client.api";
import {AdministratorsResponse} from "../administration/administration.api";
import {useSelectedCompany} from "@/components/utils/CompanyProvider";
import {CollaboratorResponse} from "@/api/collaborator/collaborators.dto";

export type CompanyResponse = {
    id: UUID;
    name: string;
    picture: string;
    siren: string;
    siret: string;
    legalForm: string;
    nafCode: string;
    activityDomain: string;
    collectiveAgreement: { titre: string; idcc: string };
    collaborators: CollaboratorResponse[];
};
export type CompanyRightResponse = {
    right: "OWNER" | "MANAGER" | "READONLY";
    displayName: string;
};

export type MyCompanyInfo = {
    companyId: UUID;
    rights: "OWNER" | "MANAGER" | "READONLY";
    companyName: string;
};

export type ModifyCompanyRequest = {
    id: UUID;
    name?: string;
    siren?: string;
    siret?: string;
    legalForm?: string;
    nafCode?: string;
    principalActivity?: string;
    activityDomain?: string;
    collectiveAgreement?: string;
    idcc?: string;
}

export function useCompany(companyId: UUID) {
    return useQuery({
        queryKey: ["company", companyId],
        queryFn: async () => {
            const response = await serviceClient.get<CompanyResponse>(
                "/companies/" + companyId
            );
            return response.data;
        },
    });
}

export function useMyCompanies() {
    return useQuery({
        queryKey: ["my-companies"],
        queryFn: async () => {
            const response = await serviceClient.get<MyCompanyInfo[]>(
                "/administrators/companies/my-companies"
            );
            return response.data;
        },
    });
}

export async function getCompany() {
    const user = await getCurrentUser();
    if (!user?.id) {
        redirect("/signin");
    }

    return serverGet<CompanyResponse>(`/companies?administratorId=${encodeURIComponent(user.id)}`);
}

export function useMyCompanyRights(companyId?: UUID) {
    return useQuery<CompanyRightResponse>({
        queryKey: ["my-company-rights", companyId],
        queryFn: async () => {
            const response = await serviceClient.get<CompanyRightResponse>(
                `/companies/${companyId}/administrators/my-rights`,
            );
            return response.data;
        },
        enabled: !!companyId,
        staleTime: 5 * 60 * 1000,
    });
}

export function useModifyCompany() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (company: ModifyCompanyRequest) => {
            const response = await serviceClient.put<CompanyResponse>(`/companies/${company.id}`, company);
            return response.data;
        },
        onSuccess: (company: CompanyResponse) => {
            queryClient.setQueryData(["company", company.id], company);
        },
    })
}

export function useModifyCompanyPicture() {
    const queryClient = useQueryClient();
    const {company, setCompany} = useSelectedCompany();
    return useMutation({
        mutationFn: async ({file, id}: { file: File; id: UUID }) => {
            const formData = new FormData();
            formData.append("file", file);
            const response = await serviceClient.post<CompanyResponse>(`/companies/${id}/picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: (result: CompanyResponse) => {
            const admin: AdministratorsResponse | undefined = queryClient.getQueryData(["administrator"]);
            if (admin) {
                const adminToUpdate: AdministratorsResponse = {
                    ...admin,
                    companies: [{...admin.companies[0], picture: result.picture}],
                };
                queryClient.setQueryData(["administrator"], () => adminToUpdate);
            }
            setCompany({...company, picture: result.picture});
            toast({
                title: "Photo ajoutée",
                description: "Votre photo a bien été ajoutée.",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Ajout impossible",
                description: "Désolé, une erreur est survenue lors de l'ajout de votre photo.",
                variant: "destructive",
            });
        },
    });
}

import { UUID } from "node:crypto";
import { getCurrentUser, serverGet } from "@/api/server.api";
import { redirect } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { serviceClient } from "../client.api";
import { AdministratorsResponse } from "../administration/administration.api";
import { useSelectedCompany } from "@/components/utils/CompanyProvider";
import { CollaboratorResponse } from "@/api/collaborator/collaborators.dto";

export enum LegipilotSubscriptionEnum {
	Admin,
	RH,
	Legal,
	Planning,
}

export type CompanyResponse = {
	id: UUID;
	name: string;
	picture: string;
	siren: string;
	siret: string;
	legalForm: string;
	nafCode: string;
	activityDomain: string;
	principalActivity: string;
	collectiveAgreement: { titre: string; idcc: string };
	collaborators: CollaboratorResponse[];
	subscription: LegipilotSubscriptionEnum[];
};
export type CompanyRightResponse = {
	right: "OWNER" | "MANAGER" | "READONLY";
	displayName: string;
};

export type MyCompanyInfo = {
	companyId: UUID;
	rights: "OWNER" | "MANAGER" | "READONLY";
	companyName: string;
	picture: string;
};

export type ModifyCompanyRequest = {
	id: UUID;
	companyName?: string;
	siren?: string;
	siret?: string;
	legalForm?: string;
	nafCode?: string;
	principalActivity?: string;
	activityDomain?: string;
	collectiveAgreement?: string;
	collectiveAgreementTitle?: string;
	idcc?: string;
};

export function useCompany(companyId: UUID) {
	return useQuery({
		queryKey: ["company", companyId],
		queryFn: async () => {
			const response = await serviceClient.get<CompanyResponse>("/companies/" + companyId);
			return response.data;
		},
	});
}

export function useMyCompanies() {
	return useQuery({
		queryKey: ["my-companies"],
		queryFn: async () => {
			const response = await serviceClient.get<MyCompanyInfo[]>("/administrators/companies/my-companies");
			return response.data;
		},
	});
}

export async function getCompany() {
	const user = await getCurrentUser();
	if (!user?.id) {
		redirect("/signin");
	}

	return await serverGet<CompanyResponse>(`/companies?administratorId=${encodeURIComponent(user.id)}`);
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
	const { company: currentCompany, setCompany } = useSelectedCompany();

	return useMutation({
		mutationFn: async (request: ModifyCompanyRequest) => {
			const response = await serviceClient.patch<CompanyResponse>(`/companies/${request.id}`, request);
			return response.data;
		},
		onSuccess: (updatedCompany: CompanyResponse) => {
			queryClient.setQueryData(["company", updatedCompany.id], updatedCompany);

			if (currentCompany.id === updatedCompany.id) {
				setCompany(updatedCompany);
			}

			queryClient.invalidateQueries({ queryKey: ["administrator"] });
			queryClient.invalidateQueries({ queryKey: ["my-companies"] });

			toast({
				title: "Entreprise modifiée",
				description: "Les informations ont été mises à jour avec succès.",
				variant: "default",
			});
		},
		onError: (error: any) => {
			toast({
				title: "Modification échouée",
				description: error?.response?.data?.message || "Une erreur est survenue",
				variant: "destructive",
			});
		},
	});
}

export function useModifyCompanyPicture() {
	const queryClient = useQueryClient();
	const { company, setCompany } = useSelectedCompany();

	return useMutation({
		mutationFn: async ({ file, id }: { file: File; id: UUID }) => {
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
			queryClient.setQueryData(["company", result.id], result);

			const admin: AdministratorsResponse | undefined = queryClient.getQueryData(["administrator"]);
			if (admin) {
				const adminToUpdate: AdministratorsResponse = {
					...admin,
					companies: admin.companies.map((c) => (c.id === result.id ? { ...c, picture: result.picture } : c)),
				};
				queryClient.setQueryData(["administrator"], adminToUpdate);
			}

			if (company.id === result.id) {
				setCompany({ ...company, picture: result.picture });
			}

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

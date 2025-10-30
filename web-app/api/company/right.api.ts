import { serviceClient } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UUID } from "node:crypto";

export type Right = "OWNER" | "MANAGER" | "READONLY";

export type CompanyAdministratorInfo = {
	administratorId: UUID;
	rights: Right;
	firstname: string;
	lastname: string;
	email: string;
};

export type CompanyRightInfo = {
	right: Right;
	displayName: string;
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
			rights: Right;
		}) => {
			await serviceClient.put(`/companies/${companyId}/administrators/${administratorId}/rights`, { rights });
		},
		onSuccess: (_, { companyId }) => {
			queryClient.invalidateQueries({
				queryKey: ["company-administrators", { companyId }],
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
			queryClient.setQueryData<CompanyAdministratorInfo[]>(["company-administrators", { companyId }], (old = []) =>
				old.filter((a) => a.administratorId !== administratorId),
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

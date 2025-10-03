// right.api.ts
import { serviceClient } from "@/api/client.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UUID } from "node:crypto";

export type RightUser = {
	id: UUID;
	firstname: string;
	lastname: string;
	email: string;
};

export type RightResponse = {
	user: RightUser;
	right: string;
};

export function useRights(companyId: string) {
	return useQuery({
		queryKey: ["rights", { companyId }],
		queryFn: async () => {
			const res = await serviceClient.get<RightResponse[]>(`/companies/${companyId}/rights`);
			return res.data;
		},
		enabled: !!companyId,
	});
}

export function useDeleteRight() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, companyId }: { userId: UUID; companyId: UUID }) => {
			await serviceClient.delete(`/right`, {
				params: { id: userId, companyId },
			});
			return { userId, companyId } as const;
		},
		onSuccess: ({ userId, companyId }) => {
			const key = ["rights", { companyId }] as const;
			queryClient.setQueryData<RightResponse[]>(key, (old = []) => old.filter((i) => i.user.id !== userId));
		},
	});
}

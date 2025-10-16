import { serviceClient, serviceClientNonAuthentifie } from "@/api/client.api";
import { AdministratorResponse, FonctionRequest } from "@/app/signup/signup.service";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { UUID } from "node:crypto";

export type ModifyAdministratorRequest = {
	firstname?: string;
	lastname?: string;
	email?: string;
	phone?: string;
	picture?: string;
	fonction?: string;
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
};

export function useValidateAccount() {
	return useMutation({
		mutationFn: async ({ id, token }: { id: number; token: UUID }) => {
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
		mutationFn: async ({ request, id }: { request: ModifyAdministratorRequest; id: UUID }) => {
			const response = await serviceClient.patch<AdministratorResponse>(`/administrators/${id}`, request);
			return response.data;
		},
		onMutate: async ({ request }) => {
			await queryClient.cancelQueries({ queryKey: ["administrator"] });

			const previousAdmin = queryClient.getQueryData<AdministratorResponse>(["administrator"]);

			if (previousAdmin) {
				queryClient.setQueryData<AdministratorResponse>(["administrator"], (old) => {
					if (!old) return old;

					return {
						...old,
						...(request.firstname !== undefined && { firstname: request.firstname }),
						...(request.lastname !== undefined && { lastname: request.lastname }),
						...(request.email !== undefined && { email: request.email }),
						...(request.phone !== undefined && { phone: request.phone }),
						...(request.fonction !== undefined && { fonction: request.fonction as FonctionRequest }),
						...(request.picture !== undefined && { picture: request.picture }),
						...(request.isNewsViewed !== undefined && { isNewsViewed: request.isNewsViewed }),
						...(request.isNotifViewed !== undefined && { isNotifViewed: request.isNotifViewed }),
						companies: old.companies.map((company) => {
							if (company.id === request.idCompany) {
								return {
									...company,
									...(request.companyName !== undefined && { name: request.companyName }),
									...(request.siren !== undefined && { siren: request.siren }),
									...(request.siret !== undefined && { siret: request.siret }),
									...(request.legalForm !== undefined && { legalForm: request.legalForm }),
									...(request.nafCode !== undefined && { nafCode: request.nafCode }),
									...(request.activityDomain !== undefined && { activityDomain: request.activityDomain }),
									...(request.companyPicture !== undefined && { picture: request.companyPicture }),
									...(request.idcc !== undefined &&
										request.collectiveAgreement !== undefined && {
											collectiveAgreement: {
												idcc: request.idcc,
												titre: request.collectiveAgreement,
											},
										}),
								};
							}
							return company;
						}),
					};
				});
			}

			return { previousAdmin };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["administrator"] });

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
				description:
					error?.response?.data?.message || "Désolé, une erreur est survenue lors de la mise à jour de votre compte.",
				variant: "destructive",
			});
		},
	});
}

export function useModifyAdministratorPicture() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ file, id }: { file: File; id: UUID }) => {
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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceClient } from "@/api/client.api";
import { UUID } from "node:crypto";
import { toast } from "@/hooks/use-toast";

import {
    CategoryResponse,
    CivilityResponse,
    CollaboratorResponse,
    ContractTypeResponse,
    MaritalStatusResponse
} from "./collaborators.dto";
import { useRouter } from "next/navigation";
import axios from "axios";

export type CreateCollaboratorRequest = {
    firstname: string;
    lastname: string;
    civility?: string;
    birthDate?: string;
    birthPlace?: string;
    nationality?: string;
    socialSecurityNumber?: string;
}

export type UpdateCollaboratorRequest = {
    id?: UUID;
    firstname?: string;
    lastname?: string;
    civility?: string;
    birthDate?: string;
    birthPlace?: string;
    nationality?: string;
    socialSecurityNumber?: string;
    picture?: string;

    jobTitle?: string;
    contractType?: ContractTypeResponse;
    hireDate?: string;
    endDate?: string;
    location?: string;
    workHoursPerWeek?: number;
    workHoursType?: string;
    responsible?: string;

    category?: CategoryResponse;
    classification?: string;
    annualSalary?: number;
    variableCompensation?: number;
    totalCompensation?: number;
    benefitsInKind?: number;
    trialPeriod?: string;
    nonCompeteClause?: boolean;

    personalPhone?: string;
    personalEmail?: string;
    personalAddress?: string;
    emergencyCivility?: CivilityResponse;
    emergencyFirstname?: string;
    emergencyLastname?: string;
    emergencyPhone?: string;
    emergencyEmail?: string;
    professionalEmail?: string;
    professionalPhone?: string;
    iban?: string;
    bic?: string;

    maritalStatus?: MaritalStatusResponse;
    numberOfChildren?: number;
    educationLevel?: string;
    drivingLicenses?: string[];
    rqth?: boolean;

    status?: string;
    socialName?: string;
    siret?: string;
    tva?: string;
    rcs?: string;
}

export function useCollaborators(companyId: string) {
    return useQuery({
        queryKey: ["collaborators"],
        queryFn: async () => {
            const response = await serviceClient.get<CollaboratorResponse[]>(`/companies/${companyId}/collaborators`);
            return response.data;
        },
    });
}

export function useCollaborator(companyId: string, collaboratorId: string) {
    return useQuery({
        queryKey: ["collaborator", collaboratorId],
        queryFn: async () => {
            const response = await serviceClient.get<CollaboratorResponse>(`/companies/${companyId}/collaborators/${collaboratorId}`);
            return response.data;
        },
    });
}

export function useCollaboratorByToken() {
    return useMutation({
        mutationFn: async ({ token }: { token: string }) => {
            const response = await axios.post<CollaboratorResponse>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/public/collaborator`, {
                token
            });
            return response.data;
        },
    });
}

export function useImportCollaborators() {
    return useMutation({
        mutationFn: async ({ files, companyId }: { files: File[], companyId: UUID }) => {
            const formData = new FormData();
            formData.append("files", files[0]);

            const response = await serviceClient.post<VoidFunction>(`/companies/${companyId}/collaborators/import`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Importation en cours !",
                description: "Vous serez notifié par email une fois l'import terminé.",
                variant: "wip",
            });
        },
    });
}

export function useAddCollaborator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ collaborator, companyId }: { collaborator: CreateCollaboratorRequest, companyId: UUID }) => {

            const response = await serviceClient.post<CollaboratorResponse>(`/companies/${companyId}/collaborators`, collaborator);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["collaborators"], (oldData: CollaboratorResponse[]) => ([...oldData, data]));
            queryClient.setQueryData(["collaborator", data.id], () => data);
            // toast({
            //     title: "Création réussie",
            //     description: 'Vous pouvez consulter las fiches de votres collaborateur',
            //     variant: "default",
            // });
        },
    });
}

export function useUpdateCollaborator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ collaborator, companyId }: { collaborator: UpdateCollaboratorRequest, companyId: UUID }) => {
            const response = await serviceClient.patch<CollaboratorResponse>(`/companies/${companyId}/collaborators/${collaborator.id}`, collaborator);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["collaborators"], (oldData: CollaboratorResponse[] = []) =>
                oldData.map((c) => (c.id === data.id ? data : c))
            );
            queryClient.setQueryData(["collaborator", data.id], () => data);
            toast({
                title: "Modification réussie",
                description: 'Votre collaborateur a bien été mis à jour.',
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Modification impossible",
                description: 'Désolé, une erreur est survenue lors de la modification du collaborateur.',
                variant: "destructive",
            });
        },
    });
}

export function useUpdateCollaboratorByToken() {
    return useMutation({
        mutationFn: async ({ collaborator, token }: { collaborator: UpdateCollaboratorRequest, token: string }) => {
            const response = await axios.post<CollaboratorResponse>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/public/collaborator/update`, {
                token,
                ...collaborator
            });
            return response.data;
        },
        onError: () => {
            toast({
                title: "Modification impossible",
                description: 'Désolé, une erreur est survenue lors de la modification',
                variant: "destructive",
            });
        },
    });
}

export function useDeleteCollaborator() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ collaboratorId, companyId }: { collaboratorId: UUID, companyId: UUID }) => {
            await serviceClient.delete(`/companies/${companyId}/collaborators/${collaboratorId}`);
            return collaboratorId;
        },
        onSuccess: (collaboratorId: UUID) => {
            queryClient.setQueryData(["collaborators"], (oldData: CollaboratorResponse[]) => {
                return oldData?.filter((collaborator) => collaborator.id !== collaboratorId);
            });
        },
        onError: () => {
            toast({
                title: "Suppression echouée",
                description: 'Désolé, une erreur est survenue lors de la suppression du collaborateur.',
                variant: "destructive",
            });
        },
    });
}

export function useExportCollaborators() {
    return useMutation({
        mutationFn: async (companyId: UUID) => {
            const response = await serviceClient.get(`/companies/${companyId}/collaborators/export`, {
                responseType: "blob",
            });
            return response.data;
        },
        onSuccess: (data) => {
            const blob = new Blob([data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "collaborateurs.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onError: () => {
            toast({
                title: "Export en échec",
                description: "Désolé, nous n'avons pas réussi à générer le fichier d'export de vos collaborateurs.",
                variant: "destructive",
            });
        },
    });
}

export function useModifyCollaboratorPicture() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ companyId, collaboratorId, file }: { companyId: UUID, collaboratorId: UUID, file: File }) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await serviceClient.post(`/companies/${companyId}/collaborators/${collaboratorId}/picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["collaborators"], (oldData: CollaboratorResponse[] = []) =>
                oldData.map((c) => (c.id === data.id ? data : c))
            );
            queryClient.setQueryData(["collaborator", data.id], () => data);
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

export function useModifyCollaboratorPictureByToken() {
    return useMutation({
        mutationFn: async ({ token, file }: { token: string, file: File }) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("token", token);

            const response = await axios.post<CollaboratorResponse>(`${process.env.NEXT_PUBLIC_SERVICE_URL}/public/collaborator/picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return response.data;
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

export function useSendMailCollaboratorToComplete() {
    return useMutation({
        mutationFn: async ({ companyId, collaboratorId }: { companyId: UUID, collaboratorId: UUID }) => {
            const response = await serviceClient.post(`/companies/${companyId}/collaborators/${collaboratorId}/fill-profile-request`);
            return response.data;
        },
        onSuccess: (data) => {
            console.log("DATA", data)
            toast({
                title: "Email envoyé",
                description: "Un email a été envoyé pour compléter son profil.",
                variant: "default",
            });
        },
        onError: () => {
            toast({
                title: "Envoi impossible",
                description: "Désolé, une erreur est survenue lors de l'emvoi de l'email.",
                variant: "destructive",
            });
        },
    });
}

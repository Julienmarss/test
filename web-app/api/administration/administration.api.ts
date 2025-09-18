import {useMutation, useQuery} from "@tanstack/react-query";
import {serviceClient} from "@/api/client.api";
import {FonctionRequest} from "@/app/signup/signup.service";
import {UUID} from "node:crypto";
import {CompanyResponse} from "@/api/company/company.api";

export type AdministratorsResponse = {
    id: UUID,
    email: string,
    phone: string,
    firstname: string,
    lastname: string,
    fonction: FonctionRequest,
    picture: string,
    roles: Array<string>
    companies: Array<CompanyResponse>
    isNewsViewed:boolean | null
    isNotifViewed:boolean | null
}

export function useAdministrators() {
    return useQuery({
        queryKey: ["administrators"],
        queryFn: async () => {
            const response = await serviceClient.get<AdministratorsResponse[]>(`/administration/administrators`);
            return response.data;
        },
    });
}

export function useExportAdministrators() {
    return useMutation({
        mutationFn: async () => {
            const response = await serviceClient.get(`/administration/administrators/export`, {
                responseType: "blob",
            });
            return response.data;
        },
        onSuccess: (data) => {
            const blob = new Blob([data], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "export_legipilot.zip");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onError: () => {
            alert("Erreur lors de l'export du fichier");
        },
    });
}


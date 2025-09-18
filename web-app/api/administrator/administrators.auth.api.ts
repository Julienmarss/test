import { useMutation } from "@tanstack/react-query";
import { serviceClientNonAuthentifie } from "@/api/client.api";
import { toast } from "@/hooks/use-toast";

type ReinitialisationMotDePasseResponse = {
    message: string;
}

export function useForgottenPassword() {
    return useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const response = await serviceClientNonAuthentifie.post<ReinitialisationMotDePasseResponse>(`/public/authentification/forgotten-password`, { email });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Mot de passe oublié",
                description: "Un lien de réinitialisation est envoyé à votre adresse email.",
                variant: "default",
            });
        },
    });
}

export function useModifyPassword() {
    return useMutation({
        mutationFn: async ({ email, password, token }: { email: string, password: string, token: string }) => {
            const response = await serviceClientNonAuthentifie.put<ReinitialisationMotDePasseResponse>(`/public/authentification/modify-password`, {
                email,
                token,
                password
            });
            return response.data;
        }
    });
}
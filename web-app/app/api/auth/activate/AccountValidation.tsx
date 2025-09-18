'use client';

import {CheckCircle, CircleX, Mail} from "lucide-react";
import {UUID} from "node:crypto";
import {useValidateAccount} from "@/api/administrator/administrators.api";
import {useEffect} from "react";
import {isServiceError} from "@/api/client.api";
import {PageSpinner} from "@/components/ui/icons/Spinner";

export const AccountValidation = ({id, token}: { id?: number; token?: UUID }) => {
    const {mutate: validateAccount, isSuccess, isError, error, isPending} = useValidateAccount();

    useEffect(() => {
        if (id && token) {
            validateAccount({id, token});
        }
    }, [id, token]);

    if (isPending) {
        return <PageSpinner/>
    }

    if (isSuccess) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600"/>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Compte validé avec succès !</h2>
                    <p className="text-slate-600">
                        Votre compte LégiPilot a été validé. Vous pouvez maintenant vous connecter.
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <CircleX className="w-10 h-10 text-red-600"/>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Nous n'avons pas pu valider votre
                        compte.</h2>
                    <p className="text-slate-600">
                        {error && isServiceError(error) ? error.message : "Une erreur inattendue s'est produite."}
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-blue-700">
                        <Mail className="w-5 h-5"/>
                        <span className="font-medium">Vérifiez votre boîte email</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                        Veuillez réessayer de valider votre compte en cliquant sur le lien de validation dans l'email. Si cela ne fonctionne pas, vous pouvez nous contacter.
                    </p>
                </div>
            </div>
        );
    }

    return <PageSpinner/>;
};
"use client";

import { CheckCircle, CircleX, Mail } from "lucide-react";
import { UUID } from "node:crypto";
import { useValidateAccount } from "@/api/administrator/administrators.api";
import { useEffect } from "react";
import { isServiceError } from "@/api/client.api";
import { PageSpinner } from "@/components/ui/icons/Spinner";

export const AccountValidation = ({ id, token }: { id?: number; token?: UUID }) => {
	const { mutate: validateAccount, isSuccess, isError, error, isPending } = useValidateAccount();

	useEffect(() => {
		if (id && token) {
			validateAccount({ id, token });
		}
	}, [id, token]);

	if (isPending) {
		return <PageSpinner />;
	}

	if (isSuccess) {
		return (
			<div className="space-y-6 text-center">
				<div className="flex justify-center">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-10 w-10 text-green-600" />
					</div>
				</div>
				<div>
					<h2 className="mb-2 text-2xl font-bold text-slate-900">Compte validé avec succès !</h2>
					<p className="text-slate-600">Votre compte LégiPilot a été validé. Vous pouvez maintenant vous connecter.</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="space-y-6 text-center">
				<div className="flex justify-center">
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
						<CircleX className="h-10 w-10 text-red-600" />
					</div>
				</div>
				<div>
					<h2 className="mb-2 text-2xl font-bold text-slate-900">Nous n'avons pas pu valider votre compte.</h2>
					<p className="text-slate-600">
						{error && isServiceError(error) ? error.message : "Une erreur inattendue s'est produite."}
					</p>
				</div>

				<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex items-center justify-center space-x-2 text-blue-700">
						<Mail className="h-5 w-5" />
						<span className="font-medium">Vérifiez votre boîte email</span>
					</div>
					<p className="mt-2 text-sm text-blue-600">
						Veuillez réessayer de valider votre compte en cliquant sur le lien de validation dans l'email. Si cela ne
						fonctionne pas, vous pouvez nous contacter.
					</p>
				</div>
			</div>
		);
	}

	return <PageSpinner />;
};

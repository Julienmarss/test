import { CheckCircle, Mail } from "lucide-react";

export const AccountCreated = ({ email }: { email?: string }) => {
	return (
		<div className="space-y-6 self-center text-center">
			<div className="flex justify-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
					<CheckCircle className="h-10 w-10 text-green-600" />
				</div>
			</div>
			<div>
				<h2 className="mb-2 text-2xl font-bold text-slate-900">Compte créé avec succès !</h2>
				<p className="text-slate-600">
					Votre compte LégiPilot a été créé. Un email de validation a été envoyé à{" "}
					<span className="font-medium text-slate-900">{email}</span>.
				</p>
			</div>
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div className="flex items-center justify-center space-x-2 text-blue-700">
					<Mail className="h-5 w-5" />
					<span className="font-medium">Vérifiez votre boîte email</span>
				</div>
				<p className="mt-2 text-sm text-blue-600">
					Cliquez sur le lien de validation dans l'email pour activer votre compte et commencez à utiliser LégiPilot.
				</p>
			</div>
			{/*<div className="text-sm text-slate-500">*/}
			{/*    Vous n'avez pas reçu l'email ?{" "}*/}
			{/*    <button className="text-blue-600 hover:text-blue-700 underline">Renvoyer l'email</button>*/}
			{/*</div>*/}
		</div>
	);
};

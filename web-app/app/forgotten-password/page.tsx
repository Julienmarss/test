import Link from "next/link";
import { ForgottenPassword } from "./ForgottenPassword";

export default async function Page() {
	return (
		<div className="flex min-h-screen items-center justify-center gap-2 bg-orange-200 bg-gradient-to-br p-2">
			{/* White card */}
			<div className="flex h-[98vh] flex-col items-start justify-between overflow-y-auto rounded-lg bg-white px-12 py-20 md:min-w-[36vw] md:max-w-[36vw]">
				<img src="/picto-legipilot.svg" alt="Logo de Legipilot" className="mt-4 h-auto w-10" />

				{/* Welcome Text */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-slate-900">Bienvenue !</h1>
					<p className="text-gray-500">Vous avez oublié votre mot de passe ?</p>
				</div>

				{/* Forgotten Password Form */}
				<ForgottenPassword />

				{/* Divider */}
				<div className="mt-4 flex w-full items-center">
					<div className="flex-grow border-t border-slate-200"></div>
					<div className="flex-grow border-t border-slate-200"></div>
				</div>

				{/* Sign Up Link */}
				<div className="flex flex-col items-start">
					<div className="mb-4 text-center text-slate-600">
						Pas encore de compte ?{" "}
						<Link href="/signup" className="font-bold text-slate-900 underline underline-offset-4 hover:text-slate-700">
							Créer un compte
						</Link>
					</div>
					<div className="mb-4 text-center text-slate-600">
						Je me connecte :{" "}
						<Link href="/signin" className="font-bold text-slate-900 underline underline-offset-4 hover:text-slate-700">
							Se connecter
						</Link>
					</div>
				</div>
			</div>

			{/* Right Panel - Branding */}
			<div className="right-panel h-[98vh] flex-1 content-center rounded-lg bg-orange-100 text-center">
				<div className="flex items-center justify-center space-x-4 px-6">
					<img
						src="https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/Illustration-Connexion.png"
						className="h-[90vh]"
						alt="Logo de Legipilot"
					/>
				</div>
			</div>
		</div>
	);
}

import Link from "next/link";
import {ChangePassword} from "./ChangePassword";
import {Suspense} from "react";

export default async function Page() {

    return (
        <div className="min-h-screen bg-gradient-to-br bg-orange-200 flex items-center justify-center p-2 gap-2">

            {/* White card */}
            <div
                className="flex flex-col justify-between items-start py-20 px-12 bg-white rounded-lg h-[98vh] md:max-w-[36vw] md:min-w-[36vw] overflow-y-auto">

                <img src="/picto-legipilot.svg" alt="Logo de Legipilot" className="w-10 h-auto mt-4"/>

                {/* Welcome Text */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Bienvenue !</h1>
                    <p className="text-gray-500">Vous avez demandé un changement de mot de passe.</p>
                </div>

                {/* Forgotten Password Form */}
                <Suspense>
                    <ChangePassword/>
                </Suspense>

                {/* Divider */}
                <div className="flex items-center w-full mt-4">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center text-slate-600 mb-4">
                    Pas encore de compte ?{" "}
                    <Link href="/signup"
                          className="text-slate-900 hover:text-slate-700 underline underline-offset-4 font-bold">
                        Créer un compte
                    </Link>
                </div>
                <div className="text-center text-slate-600 mb-4">
                    Je me connecte :{" "}
                    <Link href="/signin"
                          className="text-slate-900 hover:text-slate-700 underline underline-offset-4 font-bold">
                        Se connecter
                    </Link>
                </div>
            </div>

            {/* Right Panel - Branding */}
            <div className="right-panel flex-1 text-center content-center bg-orange-100 h-[98vh] rounded-lg">
                <div className="flex items-center justify-center space-x-4 px-6">
                    <img
                        src="https://legipilot-documents.s3.fr-par.scw.cloud/public/prod/visuals/Illustration-Connexion.png" className="h-[90vh]"
                        alt="Logo de Legipilot"/>
                </div>
            </div>
        </div>
    );
}

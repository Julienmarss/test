import {CheckCircle, Mail} from "lucide-react";

export const AccountCreated = ({email}: { email?: string }) => {
    return (
        <div className="space-y-6 text-center self-center">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600"/>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Compte créé avec succès !</h2>
                <p className="text-slate-600">
                    Votre compte LégiPilot a été créé. Un email de validation a été envoyé à{" "}
                    <span className="font-medium text-slate-900">
                        {email}
                    </span>.
                </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                    <Mail className="w-5 h-5"/>
                    <span className="font-medium">Vérifiez votre boîte email</span>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                    Cliquez sur le lien de validation dans l'email pour activer votre compte et commencez à utiliser
                    LégiPilot.
                </p>
            </div>
            {/*<div className="text-sm text-slate-500">*/}
            {/*    Vous n'avez pas reçu l'email ?{" "}*/}
            {/*    <button className="text-blue-600 hover:text-blue-700 underline">Renvoyer l'email</button>*/}
            {/*</div>*/}
        </div>
    );
};
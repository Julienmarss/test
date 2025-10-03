import { Input } from "@/components/ui/Input";
import { UpdateCollaboratorRequest } from "@/api/collaborator/collaborators.api";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void
};
export const InformationProfessionnelleForm = ({ collaborator, handleInputChange }: Props) => {
    return (
        <div id="information-professionnelle"
            className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="text-lg font-medium text-gray-900">Informations Professionnelles</span>
            </div>

            <Input label="Dénomination sociale" placeholder={"Saisissez la dénomination sociale"}
                value={collaborator.socialName}
                onChange={(e) => handleInputChange("socialName", e.target.value)} />

            <div className="flex flex-col md:flex-row gap-x-2">
                <Input label="Numéro de SIRET" placeholder={"Saisissez le numéro de SIRET"}
                    value={collaborator.siret}
                    onChange={(e) => handleInputChange("siret", e.target.value)} />
                <Input label="Numéro de TVA" placeholder={"Saisissez le numéro de TVA"}
                    value={collaborator.tva}
                    onChange={(e) => handleInputChange("tva", e.target.value)} />
            </div>

            <Input label="Inscription RCS" placeholder={"Saisissez l'nscription RCS"}
                value={collaborator.rcs}
                onChange={(e) => handleInputChange("rcs", e.target.value)} />

            <Input type="text" label="Numéro IBAN" placeholder={"Saisissez l'IBAN"}
                value={collaborator.iban}
                onChange={(e) => handleInputChange("iban", e.target.value)} />

            <Input type="text" label="BIC" placeholder={"Saisissez le BIC"}
                value={collaborator.bic}
                onChange={(e) => handleInputChange("bic", e.target.value)} />
        </div>
    );
};
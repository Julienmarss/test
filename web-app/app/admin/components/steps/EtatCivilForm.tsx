import {Input, isValidDateFormat} from "@/components/ui/Input";
import {Select} from "@/components/ui/Select";
import { UpdateCollaboratorRequest} from "@/api/collaborator/collaborators.api";
import ReactFlagsSelect from "react-flags-select";
import {
    getCode,
    getNationality,
    isValidSocialSecurityNumber,
    nationalities
} from "@/app/admin/collaborator/collaborator.service";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void
    isFreelance?:boolean
};
export const EtatCivilForm = ({collaborator, handleInputChange, isFreelance}: Props) => {
    return (
        <div id="etat-civil" className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"/>
                </svg>
                <span className="text-lg font-medium text-gray-900">État Civil</span>
            </div>

            <div className="flex flex-col md:flex-row gap-x-2">
                <Input label="Nom" placeholder={"Saisissez le nom de votre collaborateur"}
                       value={collaborator.lastname}
                       onChange={(e) => handleInputChange("lastname", e.target.value)} required/>
                <Input label="Prénom" placeholder={"Saisissez le prénom de votre collaborateur"}
                       value={collaborator.firstname}
                       onChange={(e) => handleInputChange("firstname", e.target.value)} required/>
            </div>

            <Select label={"Civilité"} placeholder={"Sélectionnez la civilité de votre collaborateur"}
                    value={collaborator.civility}
                    options={[{label: "Monsieur", value: "Monsieur"}, {label: "Madame", value: "Madame"}]}
                    onChange={(value) => handleInputChange("civility", value)}
                    className="w-full"/>

            <div className="flex flex-col gap-y-2 md:flex-row flex-row gap-x-2">
                <Input label="Date de naissance"
                       placeholder={"JJ/MM/AAAA"} value={collaborator.birthDate}
                       error={!collaborator.birthDate ? undefined : !isValidDateFormat(collaborator.birthDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                       onChange={(e) => handleInputChange("birthDate", e.target.value)}/>
                <Input label="Lieu de naissance"
                       placeholder={"Saisissez le lieu de naissance"} value={collaborator.birthPlace}
                       onChange={(e) => handleInputChange("birthPlace", e.target.value)}/>
            </div>

            <div className="flex flex-col gap-y-2">
                <label className="text-sm font-medium text-gray-900">Nationalité</label>
                <ReactFlagsSelect
                    placeholder="Sélectionnez la nationalité de votre collaborateur"
                    selected={collaborator.nationality ? getCode(collaborator.nationality) : ""}
                    onSelect={(code) => handleInputChange("nationality", getNationality(code))}
                    customLabels={nationalities}
                    className="md:w-full h-12"
                    searchable
                />
            </div>

            {!isFreelance && <Input label="Numéro de sécurité sociale"
                   placeholder={"Saisissez le numéro de sécurité sociale de votre collaborateur"}
                   value={collaborator.socialSecurityNumber}
                   error={!collaborator.socialSecurityNumber ? undefined : !isValidSocialSecurityNumber(collaborator.socialSecurityNumber) ? "Le numéro de sécurité sociale doit contenir exactement 15 chiffres." : undefined}
                   onChange={(e) => handleInputChange("socialSecurityNumber", e.target.value)}
                   className="w-full"/>}
        </div>
    );
};
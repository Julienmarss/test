import { Input, isValidDateFormat } from "@/components/ui/Input";
import { UpdateCollaboratorRequest } from "@/api/collaborator/collaborators.api";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void
};
export const InformationContractuelleForm = ({ collaborator, handleInputChange }: Props) => {
    return (
        <div id="information-contractuelle"
            className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>
                <span className="text-lg font-medium text-gray-900">Informations Contractuelles</span>
            </div>

            <Input label="Profession" placeholder={"Saisissez la profession"}
                value={collaborator.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)} />

            <div className="flex flex-col md:flex-row gap-x-2">
                <Input label="Date d'embauche" placeholder={"Saisissez la date d'embauche"}
                    value={collaborator.hireDate}
                    error={!collaborator.hireDate ? undefined : !isValidDateFormat(collaborator.hireDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                    onChange={(e) => handleInputChange("hireDate", e.target.value)} />
                <Input label="Date de fin" placeholder={"Saisissez la date de fin"}
                    value={collaborator.endDate}
                    error={!collaborator.endDate ? undefined : !isValidDateFormat(collaborator.endDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                    onChange={(e) => handleInputChange("endDate", e.target.value)} />
            </div>

            <Input label="Lieu de rattachement" placeholder={"Saisissez le lieu de rattachement"}
                value={collaborator.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full" />
            <Input type="amount" label="Rémunération" placeholder={"Saisissez la rémunération"}
                value={collaborator.totalCompensation}
                onChange={(e) => handleInputChange("totalCompensation", e.target.value)}
                className="w-full" />
        </div>
    );
};
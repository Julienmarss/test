import {Input} from "@/components/ui/Input";
import {UpdateCollaboratorRequest} from "@/api/collaborator/collaborators.api";
import {Select} from "@/components/ui/Select";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void
};

const isValidDateFormat = (date: string): boolean => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
};

export const SituationContractuelleForm = ({collaborator, handleInputChange}: Props) => {
    return (
        <div id="situation-contractuelle"
             className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                </svg>
                <span className="text-lg font-medium text-gray-900">Situation Contractuelle</span>
            </div>

            <div className="flex flex-col md:flex-row gap-x-2 mt-4">
                <Select
                    label="Statut"
                    placeholder="Saisissez le statut de votre collaborateur"
                    value={collaborator.category}
                    onChange={(value) => handleInputChange("category", value)}
                    options={[
                        {value: "Ouvrier", label: "Ouvrier"},
                        {value: "Employé", label: "Employé"},
                        {value: "Technicien", label: "Technicien"},
                        {value: "Agent de maîtrise", label: "Agent de maîtrise"},
                        {value: "Cadre", label: "Cadre"}
                    ]}
                />
                <Input label="Classification" placeholder={"Saisissez la classification de votre collaborateur"}
                       value={collaborator.classification}
                       onChange={(e) => handleInputChange("classification", e.target.value)}/>
            </div>

            <div className="flex flex-col md:flex-row gap-x-2">
                <Input type="amount" label="Salaire annuel brut" placeholder={"Saisissez le salaire annuel brut"}
                       value={collaborator.annualSalary}
                       onChange={(e) => handleInputChange("annualSalary", e.target.value)}/>
                <Input type="amount" label="Avantage en nature" placeholder={"Saisissez le montant des avantages en nature"}
                       value={collaborator.benefitsInKind}
                       onChange={(e) => handleInputChange("benefitsInKind", e.target.value)}
                />
                <Input type="amount" label="Rémunération variable" placeholder={"Saisissez la rémunération variable"}
                       value={collaborator.variableCompensation}
                       onChange={(e) => handleInputChange("variableCompensation", e.target.value)}/>
            </div>

            <Input type="amount" label="Rémunération totale" placeholder={"Saisissez la rémunération totale"}
                   value={collaborator.totalCompensation}
                   onChange={(e) => handleInputChange("totalCompensation", e.target.value)}
                   className="w-full"/>

            <Input label="Période d'essai" placeholder={"Saisissez la durée de la période d'essai"}
                   value={collaborator.trialPeriod}
                   onChange={(e) => handleInputChange("trialPeriod", e.target.value)}
                   className="w-full"/>

            <Select
                label="Clause de non-concurrence"
                placeholder="Sélectionnez la clause de non-concurrence"
                value={collaborator.nonCompeteClause ? "Oui" : "Non"}
                onChange={(value) => handleInputChange("nonCompeteClause", value === "Oui")}
                options={[
                    {value: "Oui", label: "Oui"},
                    {value: "Non", label: "Non"},
                ]}
                className="w-full"
            />

            <div className="flex flex-col md:flex-row gap-x-2">
                <Input
                    label="Type de titre"
                    placeholder={"Saisissez le type de séjour"}
                    value={collaborator.stayType}
                    onChange={(e) => handleInputChange("stayType", e.target.value)}
                />
                <Input
                    label="Numéro de séjour"
                    placeholder={"Saisissez le numéro de séjour"}
                    value={collaborator.stayNumber}
                    onChange={(e) => handleInputChange("stayNumber", e.target.value)}
                />
            </div>

            <Input
                label="Date de validité"
                placeholder={"JJ/MM/AAAA"}
                value={collaborator.stayValidityDate}
                error={!collaborator.stayValidityDate ? undefined : !isValidDateFormat(collaborator.stayValidityDate) ? "Le format de la date est incorrect (JJ/MM/AAAA)." : undefined}
                onChange={(e) => handleInputChange("stayValidityDate", e.target.value)}
                className="w-full"
            />

        </div>
    );
};
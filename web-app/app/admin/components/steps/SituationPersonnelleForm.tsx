import {Input} from "@/components/ui/Input";
import {CreateCollaboratorRequest, UpdateCollaboratorRequest} from "@/api/collaborator/collaborators.api";
import {Select} from "@/components/ui/Select";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value?: string | boolean | number | string[]) => void
};
export const SituationPersonnelleForm = ({collaborator, handleInputChange}: Props) => {
    return (
        <div id="situation-personnelle"
             className="flex flex-col gap-y-4 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span className="text-lg font-medium text-gray-900">Situation Personnelle</span>
            </div>

            <Select
                label="Situation familiale"
                placeholder="Sélectionnez votre situation familiale"
                value={collaborator.maritalStatus}
                onChange={(value) => handleInputChange("maritalStatus", value)}
                options={[
                    {value: "Marié(e)", label: "Marié(e)"},
                    {value: "Célibataire", label: "Célibataire"},
                    {value: "Pacsé(e)", label: "Pacsé(e)"},
                ]}
            />

            <Select
                label="Enfants à charge"
                placeholder="Sélectionnez le nombre d'enfants à charge"
                value={`${collaborator.numberOfChildren}`}
                onChange={(value) => handleInputChange("numberOfChildren", Number(value))}
                options={[
                    {value: "0", label: "0"},
                    {value: "1", label: "1"},
                    {value: "2", label: "2"},
                    {value: "3", label: "3"},
                    {value: "4", label: "4"},
                    {value: "5", label: "5"},
                    {value: "6", label: "6"},
                    {value: "7", label: "7"},
                    {value: "8", label: "8"},
                    {value: "9", label: "9"},
                    {value: "10", label: "10"},
                ]}
            />

            <Select
                label="Niveau de diplome"
                placeholder="Sélectionnez le niveau de diplome"
                value={collaborator.educationLevel}
                onChange={(value) => handleInputChange("educationLevel", value)}
                options={[
                    {value: "CAP / BEP", label: "CAP / BEP"},
                    {value: "BAC", label: "BAC"},
                    {value: "BAC +2", label: "BAC +2"},
                    {value: "BAC +3", label: "BAC +3"},
                    {value: "BAC +4", label: "BAC +4"},
                    {value: "BAC +5", label: "BAC +5"},
                    {value: "BAC +8", label: "BAC +8"},
                    {value: "Pas de diplôme", label: "Pas de diplôme"},
                ]}
            />

            <Select
                label="Permis"
                placeholder="Sélectionnez les permis de conduire"
                value={collaborator.drivingLicenses ?? []}
                onChange={(selectedOptions) => handleInputChange("drivingLicenses", selectedOptions)}
                options={[
                    {value: "", label: ""},
                    {value: "A", label: "A"},
                    {value: "B", label: "B"},
                    {value: "BE", label: "BE"},
                    {value: "C", label: "C"},
                    {value: "C1", label: "C1"},
                    {value: "CE", label: "CE"},
                    {value: "D", label: "D"},
                    {value: "D1", label: "D1"},
                    {value: "DE", label: "DE"},
                    {value: "F", label: "F"},
                    {value: "CACES", label: "CACES"},
                ]}
                multiple
            />

            <Select
                label="Le collaborateur a-t-il la reconnaissance de la qualité de travailleur handicapé (RQTH) ?"
                placeholder="Sélectionnez le RQTH"
                value={collaborator.rqth === undefined ? "" : collaborator.rqth ? "Oui" : "Non"}
                onChange={(value) => {
                    if (value === "") {
                        handleInputChange("rqth", undefined);
                    } else {
                        handleInputChange("rqth", value === "Oui");
                    }
                }}
                options={[
                    {value: "", label: ""},
                    {value: "Oui", label: "Oui"},
                    {value: "Non", label: "Non"},
                ]}
            />

        </div>
    );
};
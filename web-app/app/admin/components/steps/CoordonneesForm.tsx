import { Input } from "@/components/ui/Input";
import { UpdateCollaboratorRequest } from "@/api/collaborator/collaborators.api";
import { Select } from "@/components/ui/Select";
import * as React from "react";

type Props = {
    collaborator: UpdateCollaboratorRequest,
    handleInputChange: (key: string, value: string | boolean | number | string[]) => void
    isFreelance?: boolean
};
export const CoordonneesForm = ({ collaborator, handleInputChange, isFreelance }: Props) => {
    return (
        <div id="coordonnees"
             className="flex flex-col gap-y-2 bg-white rounded-lg border border-slate-200 p-2 md:p-6">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                <span className="text-lg font-medium text-gray-900">Coordonnées</span>
            </div>

            {!isFreelance && <span className="text-xs text-sky-600 mt-2">Coordonnées personnelles</span>}

            <div className="flex flex-col md:flex-row gap-x-2">
                <Input type="tel" label={!isFreelance ? "Téléphone personnel" : "Téléphone"} placeholder={"Ex: (+33) 6 00 00 00 00"}
                       value={collaborator.personalPhone}
                       setInputValue={(value) => handleInputChange("personalPhone", value)}
                       onChange={(e) => handleInputChange("personalPhone", e.target.value)} />
            </div>

            <Input placeholder={!isFreelance ? "Saisissez l'adresse de votre collaborateur" : "Saisissez l'adresse"} label="Adresse"
                   value={collaborator.personalAddress}
                   onChange={(e) => handleInputChange("personalAddress", e.target.value)}
                   className="w-full" />

            <span className="text-xs text-sky-600 mt-2">Contact d'urgence</span>

            <div className="flex flex-col md:flex-row gap-x-2">
                <Select label={"Civilité"} placeholder={"Sélectionnez la civilité"}
                        value={collaborator.emergencyCivility}
                        options={[{ label: "Monsieur", value: "Monsieur" }, { label: "Madame", value: "Madame" }]}
                        onChange={(value) => handleInputChange("emergencyCivility", value)} />
                <Input label="Nom" placeholder={"Saisissez le nom"}
                       value={collaborator.emergencyLastname}
                       onChange={(e) => handleInputChange("emergencyLastname", e.target.value)} />
                <Input label="Prénom" placeholder={"Saisissez le prénom"}
                       value={collaborator.emergencyFirstname}
                       onChange={(e) => handleInputChange("emergencyFirstname", e.target.value)} />
            </div>

            {!isFreelance && <>
                <div className="flex flex-col md:flex-row gap-x-2 mt-2">
                    <Input type="tel" label="Téléphone" placeholder={"Ex: (+33) 6 00 00 00 00"}
                           value={collaborator.emergencyPhone}
                           setInputValue={(value) => handleInputChange("emergencyPhone", value)}
                           onChange={(e) => handleInputChange("emergencyPhone", e.target.value)} />
                    <Input type="email" label="E-mail" placeholder={"Saisissez l'email"}
                           value={collaborator.emergencyEmail}
                           onChange={(e) => handleInputChange("emergencyEmail", e.target.value)} />
                </div>

                <span className="text-xs text-sky-600 mt-2">Coordonnées professionnelles</span>

                <div className="flex flex-col md:flex-row gap-x-2">
                    <Input type="tel" label="Téléphone professionnel" placeholder={"Ex: (+33) 6 00 00 00 00"}
                           value={collaborator.professionalPhone}
                           setInputValue={(value) => handleInputChange("emergencyPhone", value)}
                           onChange={(e) => handleInputChange("professionalPhone", e.target.value)} />
                    <Input type="email" label="E-mail professionnel" placeholder={"Saisissez l'email professionnel"}
                           value={collaborator.professionalEmail}
                           onChange={(e) => handleInputChange("professionalEmail", e.target.value)} />
                </div>

                <span className="text-xs text-sky-600 mt-2">Coordonnées bancaires</span>

                <div className="flex flex-col md:flex-row gap-x-2">
                    <Input type="text" label="Numéro IBAN" placeholder={"Saisissez l'IBAN"}
                           value={collaborator.iban}
                           onChange={(e) => handleInputChange("iban", e.target.value)} />
                    <Input type="text" label="BIC" placeholder={"Saisissez le BIC"}
                           value={collaborator.bic}
                           onChange={(e) => handleInputChange("bic", e.target.value)} />
                </div>
            </>}
        </div>
    );
};
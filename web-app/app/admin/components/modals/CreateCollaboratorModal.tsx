import {ActionButton} from "@/components/ui/buttons/ActionButton";
import {Modal} from "@/components/ui/Modal";
import React, {useEffect, useState} from "react";
import {useCompany} from "@/components/utils/CompanyProvider";
import {
    UpdateCollaboratorRequest,
    useAddCollaborator,
    useUpdateCollaborator
} from "@/api/collaborator/collaborators.api";
import {cn} from "@/utils/lib";
import {OutlineButton} from "@/components/ui/buttons/OutlineButton";
import {EtatCivilForm} from "../steps/EtatCivilForm";
import {SituationProfessionnelleForm} from "../steps/SituationProfessionnelleForm";
import {SituationContractuelleForm} from "@/app/admin/components/steps/SituationContractuelleForm";
import {CoordonneesForm} from "@/app/admin/components/steps/CoordonneesForm";
import {SituationPersonnelleForm} from "@/app/admin/components/steps/SituationPersonnelleForm";
import {DocumentsForm} from "@/app/admin/components/steps/DocumentsForm";
import {isServiceError} from "@/api/client.api";
import {INITIAL_CREATION_STATE} from "@/app/admin/components/modals/create-collaborator.service";
import CompleteProfileForm from "../steps/CompleteProfileForm";

type Props = {
    open: boolean;
    onClose: () => void;
};

const STEPS = [
    {id: "etat-civil", label: "État Civil"},
    {id: "situation-professionnelle", label: "Situation Professionnelle"},
    {id: "situation-contractuelle", label: "Situation Contractuelle"},
    {id: "coordonnees", label: "Coordonnées"},
    {id: "situation-personnelle", label: "Situation Personnelle"},
    {id: "documents", label: "Ajout de documents"},
];

export const CreateCollaboratorModal = ({open, onClose}: Props) => {
    const { company } = useCompany()
    const [currentStep, setCurrentStep] = useState(0);
    const [collaborator, setCollaborator] = useState<UpdateCollaboratorRequest>(INITIAL_CREATION_STATE);
    const [showInviteButton, setShowInviteButton] = useState(false);

    const {
        mutate: addCollaborator,
        isPending: isAddPending,
        isError: isAddError,
        isSuccess: isAddSuccess,
        error: addError,
        data
    } = useAddCollaborator();

    const {
        mutate: updateCollaborator,
        isPending: isUpdatePending,
        isError: isUpdateError,
        isSuccess: isUpdateSuccess,
        error: updateError
    } = useUpdateCollaborator();

    function handleInputChange(field: string, value?: string | boolean | number | string[]) {
        setCollaborator({...collaborator, [field]: value});
    }

    const handleScrollTo = (step: number) => {
        setCurrentStep(step);
        const id = STEPS[step]?.id;
        if (id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({behavior: "smooth", block: "start"});
            }
        }
    };

    const handleInviteCollaborator = () => {
        console.log("Inviter le collaborateur:", collaborator.id);
        onClose();
    };

    useEffect(() => {
        if (isAddSuccess) {
            handleInputChange("id", data.id);
            setShowInviteButton(true);
            if (currentStep < STEPS.length - 1) {
                handleScrollTo(currentStep + 1);
            }
        }
    }, [isAddSuccess]);

    useEffect(() => {
        if (isUpdateSuccess && currentStep < STEPS.length - 1) {
            handleScrollTo(currentStep + 1);
        }
    }, [isUpdateSuccess]);

    const save = () => {
        if (collaborator.id === undefined) {
            addCollaborator({collaborator, companyId: company.id});
        } else {
            updateCollaborator({collaborator, companyId: company.id});
        }
    }

    const disabled = isAddPending || isUpdatePending || (collaborator.firstname === "" || collaborator.lastname === "");

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Ajouter un collaborateur"
            subtitle="Création de votre collaborateur"
            className="max-w-6xl max-h-[90vh]"
            footer={
                <div className="flex flex-col gap-4 w-full">
                    {/* Bouton Inviter en haut */}
                    {showInviteButton && collaborator.id && (
                        <div className="flex justify-center border-b pb-4">
                            <ActionButton
                                onClick={handleInviteCollaborator}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                📧 Inviter le collaborateur à compléter son profil
                            </ActionButton>
                        </div>
                    )}

                    {/* Navigation des étapes */}
                    <div className={`flex flex-row w-full ${currentStep > 0 ? "justify-between" : "justify-end"}`}>
                        {currentStep > 0 && (
                            <OutlineButton onClick={() => handleScrollTo(currentStep - 1)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                     stroke="currentColor" className="size-4 text-gray-400 rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                                </svg>
                                Revenir à {STEPS[currentStep - 1]?.label}
                            </OutlineButton>
                        )}

                        {/* Messages d'erreur */}
                        {isAddError && isServiceError(addError) && (
                            <span className="text-red-500 text-sm self-center">{addError.message}</span>
                        )}
                        {isUpdateError && isServiceError(updateError) && (
                            <span className="text-red-500 text-sm self-center">{updateError.message}</span>
                        )}

                        {currentStep < STEPS.length - 1 ? (
                            <ActionButton
                                disabled={disabled}
                                onClick={save}
                            >
                                Continuer vers {STEPS[currentStep + 1]?.label}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="size-4 text-sky-50">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                                </svg>
                            </ActionButton>
                        ) : (
                            <ActionButton
                                onClick={save}
                                disabled={disabled}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                ✓ Finaliser la création du profil
                            </ActionButton>
                        )}
                    </div>
                </div>
            }
        >
            <div className="flex flex-row h-full max-h-[60vh] gap-6">
                {/* Sidebar des étapes - sticky */}
                <aside className="hidden md:flex flex-col bg-white rounded-lg border border-slate-200 min-w-[280px] max-h-fit sticky top-0">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex items-center justify-start p-3 gap-x-3 cursor-pointer transition-colors hover:bg-slate-50",
                                index > 0 && "border-t border-slate-200",
                                currentStep === index && "bg-blue-50"
                            )}
                            onClick={() => !disabled && handleScrollTo(index)}
                        >
                            <span
                                className={cn(
                                    "flex items-center justify-center text-center rounded-full w-8 h-8 text-sm font-medium",
                                    currentStep > index
                                        ? "bg-green-100 text-green-700"
                                        : currentStep === index
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-400"
                                )}
                            >
                                {currentStep > index ? "✓" : index + 1}
                            </span>
                            <div className="flex flex-col">
                                <span className="text-xs text-blue-600 font-medium">Étape {index + 1}</span>
                                <span className={cn(
                                    "text-sm",
                                    currentStep === index ? "text-gray-900 font-medium" : "text-gray-600"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Contenu principal - scrollable */}
                <section className="flex flex-col w-full overflow-y-auto pr-2">
                    <div className="space-y-8">
                        <div id="etat-civil">
                            <EtatCivilForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                        </div>

                        <div id="situation-professionnelle">
                            <SituationProfessionnelleForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                        </div>

                        <div id="situation-contractuelle">
                            <SituationContractuelleForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                        </div>

                        <div id="coordonnees">
                            <CoordonneesForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                        </div>

                        <div id="situation-personnelle">
                            <SituationPersonnelleForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                        </div>

                        {collaborator.id && (
                            <div id="documents">
                                <DocumentsForm collaboratorId={collaborator.id} companyId={company.id}/>
                            </div>
                        )}

                        {/* Espace supplémentaire en bas pour faciliter le scroll */}
                        <div className="h-16"></div>
                    </div>
                </section>
            </div>
        </Modal>
    );
};
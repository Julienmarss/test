"use client";

import {ActionButton} from "@/components/ui/buttons/ActionButton";
import {Modal} from "@/components/ui/Modal";
import React, {useEffect, useState} from "react";
import {
    UpdateCollaboratorRequest,
    useCollaboratorByToken,
    useUpdateCollaboratorByToken
} from "@/api/collaborator/collaborators.api";
import {cn} from "@/utils/lib";
import {OutlineButton} from "@/components/ui/buttons/OutlineButton";
import {CoordonneesForm} from "@/app/admin/components/steps/CoordonneesForm";
import {SituationPersonnelleForm} from "@/app/admin/components/steps/SituationPersonnelleForm";
import {isServiceError} from "@/api/client.api";
import {INITIAL_CREATION_STATE} from "@/app/admin/components/modals/create-collaborator.service";
import {EtatCivilForm} from "@/app/admin/components/steps/EtatCivilForm";
import AddPictureProfile from "@/app/admin/components/steps/AddPictureProfile";
import {useRouter} from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {toUpdateCollaboratorRequest} from "../admin/collaborator/collaborator.service";

const STEPS = [
    {id: "etat-civil", label: "État Civil"},
    {id: "coordonnees", label: "Coordonnées"},
    {id: "situation-personnelle", label: "Situation Personnelle"},
    {id: "picture-profile", label: "Ajout de photo de profil"},
];

type Props = {
    token: string;
};

const FormCompletedByCollaborator = ({token}: Props) => {
    const {mutate: collaboratorByToken, data: dataCollaborator, error} = useCollaboratorByToken();
    const [currentStep, setCurrentStep] = useState(0);
    const [collaborator, setCollaborator] = useState<UpdateCollaboratorRequest>(INITIAL_CREATION_STATE);
    const {
        mutate: updateCollaborator,
        isPending: isUpdatePending,
        isError: isUpdateError,
        isSuccess: isUpdateSuccess,
        error: updateError
    } = useUpdateCollaboratorByToken();
    const [isGood, setIsGood] = useState(false);
    const router = useRouter();

    function handleInputChange(field: string, value?: string | boolean | number | string[]) {
        setCollaborator({...collaborator, [field]: value});
    }

    const handleScrollTo = (step: number) => {
        const id = STEPS[step].id;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: "smooth", block: "start"});
        }
        setCurrentStep(step);
    };

    useEffect(() => {
        if (isUpdateSuccess && currentStep < STEPS.length - 1) {
            handleScrollTo(currentStep + 1);
        }
    }, [isUpdateSuccess]);

    useEffect(() => {
        collaboratorByToken({token: token.replace(/ /g, "+")});
    }, [])

    useEffect(() => {
        if (dataCollaborator) {
            setCollaborator(toUpdateCollaboratorRequest(dataCollaborator));
        }
    }, [dataCollaborator])

    const save = () => {
        if (collaborator?.id !== undefined) {
            updateCollaborator({collaborator, token: token.replace(/ /g, "+")});
        }
    }

    const handleLastSave = () => {
        save();
        setIsGood(true);
        toast({
            title: "Modification terminé",
            description: "Vos données sont bien enregistrées.",
            variant: "default",
        })
    }

    const disabled = isUpdatePending || (collaborator.firstname === "" || collaborator.lastname === "");

    if (error) {
        router.push("/404");
        return;
    }

    return (
        <Modal open={true} onClose={() => {}}
               title={"Édition d’un collaborateur"}
               subtitle={`${collaborator?.firstname || ""} ${collaborator?.lastname || ""}`}
               closable={false}
               footer={
                   <>
                       {!isGood ? <div
                               className={`flex flex-row w-full ${currentStep > 0 ? "justify-between" : "justify-end"}`}>
                               <>
                                   {currentStep > 0 && <OutlineButton
                                       onClick={() => handleScrollTo(currentStep - 1)}>
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor" className="size-6 text-gray-400">
                                           <path strokeLinecap="round" strokeLinejoin="round"
                                                 d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"/>
                                       </svg>
                                       Revenir à {STEPS[currentStep - 1].label}
                                   </OutlineButton>
                                   }
                                   {isUpdateError && isServiceError(isUpdateError) &&
                                       <span className="text-red-500 text-sm">{updateError.message}</span>}
                                   {currentStep < STEPS.length - 1 ?
                                       <ActionButton
                                           disabled={disabled}
                                           onClick={() => save()}>
                                           Continuer vers {STEPS[currentStep + 1].label}
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor" className="size-6 text-sky-50">
                                               <path strokeLinecap="round" strokeLinejoin="round"
                                                     d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
                                           </svg>
                                       </ActionButton>
                                       : <ActionButton
                                           onClick={handleLastSave}
                                           disabled={disabled || isUpdatePending}>
                                           Finaliser la création du profil
                                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor" className="size-6 text-sky-50">
                                               <path strokeLinecap="round" strokeLinejoin="round"
                                                     d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
                                           </svg>
                                       </ActionButton>
                                   }
                               </>
                           </div> :
                           <div>
                               <span className="text-green-500">Vos données sont bien enregistrées.</span>
                           </div>}
                   </>
               }
        >
            <article
                className="flex flex-row h-full items-start justify-start gap-x-6 py-[1em] md:px-[3em] md:h-auto w-full">
                <aside className="hidden md:flex flex-col bg-white rounded-lg border border-slate-200">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={cn("flex items-center justify-start p-4 gap-x-4 cursor-pointer", index > 0 && "border-t border-slate-200")}
                            onClick={() => !disabled && handleScrollTo(index)}>
                            <span
                                className={`text-center ${currentStep >= index ? "bg-sky-100 pt-1" : "bg-white border-2 border-slate-200 text-slate-400 pt-0.5"} rounded-full w-[32px] h-[32px]`}>{currentStep > index ? "✓" : index + 1}</span>
                            <div className="flex flex-col">
                                <span className="text-sm text-sky-600">Etape {index + 1}</span>
                                <span
                                    className={`text-sm ${index + 1 === currentStep ? "text-gray-900" : "text-gray-500"}`}>{step.label}</span>
                            </div>
                        </div>
                    ))}
                </aside>


                <section
                    className="flex flex-col gap-y-4 w-full h-full md:w-[75%] md:max-h-[70vh] md:overflow-y-hidden">
                    <EtatCivilForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                    <CoordonneesForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                    <SituationPersonnelleForm collaborator={collaborator} handleInputChange={handleInputChange}/>
                    <AddPictureProfile token={token.replace(/ /g, "+")} handleInputChange={handleInputChange}/>
                </section>
            </article>
        </Modal>
    );
};

export default FormCompletedByCollaborator;
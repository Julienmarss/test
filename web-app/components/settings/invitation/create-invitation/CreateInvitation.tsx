import { CreateInvitationRequest, useAddInvitation } from "@/api/company/invitation.api";
import AccordionSubtitle from "@/components/ui/accordion/AccordionSubtitle";
import { Button } from "@/components/ui/hero-ui/Button";
import { Form } from "@/components/ui/hero-ui/Form";
import { Input } from "@/components/ui/hero-ui/Input";
import { Select, SelectItem } from "@/components/ui/hero-ui/Select";
import { PaperAirplane } from "@/components/ui/icons/PaperAirplane";
import { useCompany } from "@/components/utils/CompanyProvider";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CreateInvitation() {
    const { company } = useCompany();
    const addInvitation = useAddInvitation();
    const [selectedRight, setSelectedRight] = useState<"MANAGER" | "READONLY">("MANAGER");

    const rightOptions = [
        { key: "OWNER", label: "Propriétaire" },
        { key: "MANAGER", label: "Responsable" },
    ];

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        const email = (fd.get("email") as string | null)?.trim() ?? "";
        const right = (fd.get("right") as string | null)?.trim() ?? "";

        if (!email || !right) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs",
                variant: "destructive",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Email invalide",
                description: "Veuillez saisir une adresse email valide",
                variant: "destructive",
            });
            return;
        }

        if (right !== "MANAGER" && right !== "READONLY") {
            toast({
                title: "Erreur",
                description: "Seuls les droits Responsable et Observateur sont autorisés",
                variant: "destructive",
            });
            return;
        }

        const payload: CreateInvitationRequest = {
            email,
            rights: right as "MANAGER" | "READONLY"
        };

        try {
            await addInvitation.mutateAsync({ invitation: payload, companyId: company.id });

            setSelectedRight("MANAGER");

            toast({
                title: "Invitation envoyée",
                description: `Une invitation a été envoyée à ${email} avec les droits ${right === "MANAGER" ? "Responsable" : "Observateur"}`,
                variant: "default",
            });
        } catch (err: any) {
            console.error("Erreur lors de l'envoi de l'invitation:", err);
        }
    };

    return (
        <div>
            <AccordionSubtitle>Nouvelle invitation</AccordionSubtitle>

            <Form onSubmit={onSubmit} className="flex flex-col items-end gap-4">
                <div className="flex w-full flex-col gap-4 md:flex-row md:items-start">
                    {/* CHAMP EMAIL */}
                    <div className="flex-1">
                        <Input
                            name="email"
                            type="email"
                            isRequired
                            label="Adresse email"
                            labelPlacement="outside"
                            placeholder="exemple@entreprise.com"
                            errorMessage={({ validationDetails, validationErrors }) => {
                                if (validationDetails.typeMismatch) {
                                    return "Entrez une adresse email valide.";
                                }
                                return validationErrors;
                            }}
                            description="L'utilisateur recevra un email pour créer son compte"
                        />
                    </div>

                    {/* SÉLECTION DU DROIT - SEULEMENT MANAGER ET READONLY */}
                    <div className="flex-1">
                        <Select
                            name="right"
                            label="Droit d'accès"
                            labelPlacement="outside"
                            isRequired
                            selectedKeys={[selectedRight]}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as "MANAGER" | "READONLY";
                                setSelectedRight(selected);
                            }}
                            placeholder="Sélectionnez un droit"
                            description={
                                selectedRight === "MANAGER"
                                    ? "Peut inviter et gérer les observateurs"
                                    : "Accès en lecture seule uniquement"
                            }
                        >
                            {rightOptions.map((option) => (
                                <SelectItem key={option.key}>{option.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* BOUTON D'ENVOI */}
                <Button
                    endContent={<PaperAirplane className="size-4" />}
                    type="submit"
                    isLoading={addInvitation.isPending}
                    isDisabled={addInvitation.isPending}
                >
                    {addInvitation.isPending ? "Envoi en cours..." : "Envoyer l'invitation"}
                </Button>
            </Form>
        </div>
    );
}